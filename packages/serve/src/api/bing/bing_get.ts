import { axiosBing } from "./axiosBing";
import type { AxiosRequestConfig } from "axios";

export function bing_get(req: Req) {
  return axiosBing<unknown, Res>({
    url: "/HPImageArchive.aspx",
    ...req,
  });
}

export interface Req extends AxiosRequestConfig {
  params: Params;
}

export interface Params {
  format: "js";
  idx: number;
  n: number;
}

export interface Res {
  images: Image[];
  tooltips: {
    loading: "正在加载...";
    previous: "上一个图像";
    next: "下一个图像";
    walle: "此图片不能下载用作壁纸。";
    walls: "下载今日美图。仅限用作桌面壁纸。";
  };
}

export interface Image {
  startdate: "20230818";
  fullstartdate: "202308180700";
  enddate: "20230819";
  url: "/th?id=OHR.AvatarMountain_ROW2965228117_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp";
  urlbase: "/th?id=OHR.AvatarMountain_ROW2965228117";
  copyright: "'Avatar Mountains', Zhangjiajie National Forest Park, China (© Amazing Aerial Premium/Shutterstock)";
  copyrightlink: "https://www.bing.com/search?q=Zhangjiajie+National+Forest+Park&form=hpcapt";
  title: "Info";
  quiz: "/search?q=Bing+homepage+quiz&filters=WQOskey:%22HPQuiz_20230818_AvatarMountain%22&FORM=HPQUIZ";
  wp: true;
  hsh: "ff51270acba6a1bfc79c370d46f3dc94";
  drk: 1;
  top: 1;
  bot: 1;
  hs: [];
}
