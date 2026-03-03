import axios, { type AxiosError, type AxiosInstance } from "axios";

let at = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc3MjI2MjA5MCwiZXhwIjoxNzcyMjYyOTkwfQ.vGu2IsXJC4-7Z9E61Fv8eSvD1zXXhyn1EmvLRdNtGWk`;
let rt = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInNlc3Npb25JZCI6MSwiaWF0IjoxNzcyMjYyMDkwLCJleHAiOjE3NzI4NjY4OTB9.wzY0zNlAkEiN9S-BNuQ5BMkntvmfKIfBODC-6WO9ax0`;

class AuthToken {
  #accessToken: string;
  #refreshToken: string;

  constructor(accessToken: string, refreshToken: string) {
    this.#accessToken = accessToken;
    this.#refreshToken = refreshToken;
  }

  getAccessToken() {
    return this.#accessToken;
  }
  getRefreshToken() {
    return this.#refreshToken;
  }
  setAccessToken(accessToken: string) {
    this.#accessToken = accessToken;
  }
  setRefreshToken(refreshToken: string) {
    this.#refreshToken = refreshToken;
  }
  async refreshTokens(axiosBing: AxiosInstance, err: AxiosError) {
    const res = await axiosBing.request({
      ...err.config,
      url: "http://localhost:3000/api/auth/refresh",
      headers: {
        ...err.config?.headers,
        Authorization: `Bearer ${this.getRefreshToken()}`,
      },
    });

    const { accessToken, refreshToken } = res.data;
    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken);
  }
}

class RetryCounter {
  #retryCount = 0;
  #maxRetryCount: number;

  constructor(maxRetryCount: number) {
    this.#maxRetryCount = maxRetryCount;
  }

  getRetryCount() {
    return this.#retryCount;
  }
  incrementRetryCount() {
    if (this.#retryCount >= this.#maxRetryCount) {
      throw new Error("Failed to refresh tokens after maximum retries.");
    }

    this.#retryCount++;
  }
  resetRetryCount() {
    this.#retryCount = 0;
  }
}

export const createBingAxios = () => {
  const axiosBing = axios.create({
    baseURL: "https://cn.bing.com",
    timeout: 1000 * 30,
  });

  const retryCounter = new RetryCounter(3);
  const authToken = new AuthToken(at, rt);

  const logout = async () => {
    await axiosBing.request({
      url: "http://localhost:3000/api/auth/logout",
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken.getRefreshToken()}`,
      },
    });
  };

  axiosBing.interceptors.request.use((config) => {
    config.headers.setAuthorization(
      `Bearer ${authToken.getAccessToken()}`,
      false,
    );

    return config;
  });
  axiosBing.interceptors.response.use(
    (res) => res,
    async (err) => {
      if (!axios.isAxiosError(err)) {
        throw err;
      }

      const status = err.response?.status;
      const message = err.response?.data?.message;
      const authorizationHeader = err.config?.headers?.Authorization;

      if (status !== 401) {
        throw err;
      }

      if (message !== "ACCESS_TOKEN_EXPIRED") {
        throw err;
      }

      /**
       * If Refresh Token is also expired,
       * then throw error to client,
       * and let client to handle it (e.g. redirect to login page).
       * Avoid infinite loop of refreshing tokens.
       */
      if (authorizationHeader === `Bearer ${authToken.getRefreshToken()}`) {
        await logout();
        throw err;
      }

      await authToken.refreshTokens(axiosBing, err);

      retryCounter.incrementRetryCount();
      const result = await axiosBing.request({
        ...err.config,
        headers: {
          ...err.config?.headers,
          Authorization: `Bearer ${authToken.getAccessToken()}`,
        },
      });
      retryCounter.resetRetryCount();

      return result;
    },
  );

  return axiosBing;
};
