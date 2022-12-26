import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
const bingApi = createApi({
  reducerPath: "bingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    timeout: 20000,
    prepareHeaders: (headers) => {
      headers.set("Authorization", `Bearer ${localStorage.getItem("token")}`);
      return headers;
    },
  }),
  tagTypes: ["bing"],
  endpoints(build) {
    return {
      getBing: build.query<string[], void>({
        query() {
          return "/bing";
        },
        transformResponse(baseQueryReturnValue: any) {
          return baseQueryReturnValue?.[0];
        },
        keepUnusedDataFor: 60,
        providesTags: (res, err, arg) => [{ type: "bing", id: "all" }],
      }),
      addStu: build.mutation({
        query() {
          return {
            url: "/bing",
            method: "post",
            body: {},
          };
        },
        invalidatesTags: (res, err, arg) => ["bing"],
      }),
    };
  },
});
export const { useGetBingQuery } = bingApi;
export default bingApi;
