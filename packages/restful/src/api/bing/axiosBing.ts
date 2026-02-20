import axios from "axios";
import type { AxiosError } from "axios";

export const axiosBing = axios.create({
  baseURL: "https://cn.bing.com",
  timeout: 1000 * 30,
});

axiosBing.interceptors.request.use((config) => config);
axiosBing.interceptors.response.use(
  (res) => {
    const { data } = res;
    return data;
  },
  (err: AxiosError) => {
    throw new Error(err.message);
  },
);
