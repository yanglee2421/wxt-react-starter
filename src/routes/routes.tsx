import { Navigate, RouteObject } from "react-router-dom";
import { BeforeEach } from "./BeforeEach";
import { toLazy } from "@/utils";

export const routes: RouteObject[] = [
  {
    path: "",
    element: <BeforeEach />,
    children: [
      { path: "*", element: <Navigate to="/404" replace /> },
      {
        id: "404",
        path: "404",
        element: toLazy(() => import("@/pages/404")),
        handle: { title: "404，NotFound" },
      },
      {
        path: "",
        id: "index",
        element: toLazy(() => import("@/pages/home")),
        handle: { title: "首页" },
      },
      {
        id: "login",
        path: "login",
        element: toLazy(() => import("@/pages/login")),
        handle: { title: "登录" },
      },
      {
        path: "particle",
        element: toLazy(() => import("@/pages/particle")),
        handle: { title: "粒子" },
      },
      {
        path: "snow",
        element: toLazy(() => import("@/pages/snow")),
        handle: { title: "雪飘" },
      },
      {
        path: "form",
        element: toLazy(() => import("@/pages/form")),
        handle: { title: "表单" },
      },
      {
        path: "bottle",
        element: toLazy(() => import("@/pages/bottle")),
        handle: { title: "水罐" },
      },
      {
        path: "magnifier",
        element: toLazy(() => import("@/pages/magnifier")),
        handle: { title: "放大镜" },
      },
      {
        path: "threejs",
        element: toLazy(() => import("@/pages/threejs")),
        handle: { title: "threejs" },
      },
      {
        path: "preformance",
        element: toLazy(() => import("@/pages/preformance")),
        handle: { title: "性能测试" },
      },
    ],
  },
];
