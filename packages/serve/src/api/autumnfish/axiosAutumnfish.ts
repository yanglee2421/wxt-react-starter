import axios from "axios";
import type { AxiosError } from "axios";

export const axiosAutumnfish = axios.create({
  baseURL: "https://autumnfish.cn",
  timeout: 1000 * 30,
});

axiosAutumnfish.interceptors.request.use((config) => config);
axiosAutumnfish.interceptors.response.use(
  (res) => res.data,
  (error: AxiosError) => {
    throw new Error(error.message);
  },
);
