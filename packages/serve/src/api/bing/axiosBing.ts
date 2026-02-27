import axios from "axios";

export const axiosBing = axios.create({
  baseURL: "https://cn.bing.com",
  timeout: 1000 * 30,
});

let at = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ4eHhAcXEuY29tIiwibmFtZSI6bnVsbCwiY3JlYXRlZEF0IjpudWxsLCJ1cGRhdGVkQXQiOiIyMDI2LTAyLTI3VDAzOjA2OjAzLjAwMFoiLCJpYXQiOjE3NzIxNjE1NjMsImV4cCI6MTc3MjE2MjQ2M30.BgcVtuBTv67yVGlyPuq-Uv9cj4L_0xL-cKg7QyXZVMo`;
let rt = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6bnVsbCwiZW1haWwiOiJ4eHhAcXEuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkZkprcjJFUmV0eGxGT2p6LzJuUTNydU9JV25IbHdhdzNZbDNFZ21kNUIvaUxGYWtYc0sxbjIiLCJjcmVhdGVkQXQiOm51bGwsInVwZGF0ZWRBdCI6IjIwMjYtMDItMjdUMDM6MDY6MDMuMDAwWiIsImlhdCI6MTc3MjE4MjU0MCwiZXhwIjoxNzcyNzg3MzQwfQ.41WP2k-VediulmsCTGYGoNcPxlOGb360CZc-H5w7ARY`;

axiosBing.interceptors.request.use((config) => {
  config.headers.setAuthorization(`Bearer ${at}`, false);

  return config;
});
axiosBing.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (!axios.isAxiosError(err)) {
      throw err;
    }

    const message = err.response?.data?.message;

    if (message !== "jwt expired") {
      throw err;
    }

    if (!err.config) {
      throw err;
    }

    const res = await axiosBing.post(
      "http://localhost:3000/api/auth/refresh",
      null,
      {
        ...err.config,
        headers: {
          ...err.config.headers,
          Authorization: `Bearer ${rt}`,
        },
      },
    );

    at = res.data.accessToken;
    rt = res.data.refreshToken;
    return axiosBing.request({
      ...err.config,
      headers: {
        ...err.config.headers,
        Authorization: `Bearer ${at}`,
      },
    });
  },
);
