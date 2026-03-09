import axios from "axios";

const resolveBearerToken = (token: string) => `Bearer ${token}`;

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
}

class RetryCounter {
  #retryCount = 0;
  #maxRetryCount: number;

  constructor(maxRetryCount: number) {
    this.#maxRetryCount = maxRetryCount;
  }

  canRetry() {
    return this.#retryCount < this.#maxRetryCount;
  }
  increment() {
    if (this.#retryCount >= this.#maxRetryCount) {
      throw new Error("Failed to refresh tokens after maximum retries.");
    }

    this.#retryCount++;
  }
  reset() {
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
        return Promise.reject(err);
      }

      const status = err.status;
      const message = err.response?.data?.message;
      const authorizationHeader = err.config?.headers?.Authorization;
      const accessToken = authToken.getAccessToken();
      const refreshToken = authToken.getRefreshToken();
      const refreshTokenBearer = resolveBearerToken(refreshToken);

      if (status !== 401) {
        return Promise.reject(err);
      }

      if (message !== "ACCESS_TOKEN_EXPIRED") {
        return Promise.reject(err);
      }

      if (Object.is(authorizationHeader, refreshTokenBearer)) {
        authToken.setAccessToken("");
        authToken.setRefreshToken("");

        return Promise.reject(err);
      }

      if (!Object.is(authorizationHeader, resolveBearerToken(accessToken))) {
        return Promise.reject(err);
      }

      // To avoid infinite loop when refresh successfull but the new access token is also expired or invalid for some reason.
      if (!retryCounter.canRetry()) {
        retryCounter.reset();

        return Promise.reject(err);
      }

      retryCounter.increment();
      const res = await axiosBing.request({
        url: "http://localhost:3000/api/auth/refresh",
        method: "POST",
        headers: {
          Authorization: refreshTokenBearer,
        },
      });

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        res.data;
      authToken.setAccessToken(newAccessToken);
      authToken.setRefreshToken(newRefreshToken);

      return axiosBing
        .request({
          ...err.config,
          headers: {
            ...err.config?.headers,
            Authorization: resolveBearerToken(newAccessToken),
          },
        })
        .then((res) => {
          retryCounter.reset();

          return res;
        });
    },
  );

  return axiosBing;
};
