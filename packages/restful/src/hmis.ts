import { Router } from "express";
import { URL } from "node:url";

export const hmisRouter = Router();
export const PORT = 8080;

type KhGetBody = {
  mesureId: "A23051641563052";
};

// 康华 安康
hmisRouter.post("/api/lzdx_csbtsj_get/get", (req, res) => {
  const url = new URL(req.url, `http://${req.hostname}:${PORT}`);
  const data = req.body as KhGetBody;
  console.log(url.href, data, req.headers["content-type"]);

  res.json({
    data: {
      mesureId: "dh" + data.mesureId,
      zh: data.mesureId,
      zx: "RE2B",
      clbjLeft: "HEZD Ⅱ 18264",
      clbjRight: "HEZD Ⅱ 32744",
      czzzrq: "2003-01-16",
      czzzdw: "673",
      ldszrq: "2014-06-22",
      ldszdw: "673",
      ldmzrq: "2018-04-13",
      ldmzdw: "623",
    },
    code: 200,
    msg: "success",
  });
});
hmisRouter.post("/api/lzdx_csbtsj_tsjg/save", (req, res) => {
  const url = new URL(req.url, `http://${req.hostname}:${PORT}`);
  console.log(url.href, req.body, req.headers["content-type"]);

  res.json({
    code: 200,
    msg: "success",
  });
});
hmisRouter.post("/api/lzdx_csbtsj_whzy_tsjgqx/save", (req, res) => {
  const url = new URL(req.url, `http://${req.hostname}:${PORT}`);
  console.log(url.href, req.body, req.headers["content-type"]);

  res.json({
    code: 200,
    msg: "success",
  });
});

// JTV 统型
hmisRouter.get("/api/getData", (req, res) => {
  // ?type=csbts&param=91022070168
  const url = new URL(req.url, `http://${req.hostname}:${PORT}`);
  console.log(url.href);
  const type = url.searchParams.get("type");
  if (type !== "csbts") throw new Error("type field error");
  const param = url.searchParams.get("param");
  if (!param) throw new Error("param is falsy");
  const [barCode, unitCode] = param.split(",");
  if (!barCode) throw new Error("barCode is falsy");
  if (!unitCode) throw new Error("unitCode is falsy");

  res.json({
    code: "200",
    msg: "数据读取成功",
    data: [
      {
        CZZZDW: "048",
        CZZZRQ: "2009-10",
        MCZZDW: "131",
        MCZZRQ: "2018-07-09 00:00:00",
        SCZZDW: "131",
        SCZZRQ: "2018-07-09 00:00:00",

        DH: "dh" + barCode,
        ZH: barCode,
        ZX: "RE2B",
        SRYY: "厂修",
        SRDW: "588",
      },
    ],
  });
});

hmisRouter.post("/api/saveData", (req, res) => {
  // ?type=csbts
  const url = new URL(req.url, `http://${req.hostname}:${PORT}`);
  console.log(url.href, req.body, req.headers["content-type"]);
  const type = url.searchParams.get("type");
  if (type !== "csbts") throw new Error("type field is not csbts");

  res.json({
    code: "200",
    msg: "数据上传成功",
  });
});

// 华兴致远 成都北
hmisRouter.get("/lzjx/dx/csbts/device_api/csbts/api/getDate", (req, res) => {
  // ?type=csbts&param=91022070168
  const url = new URL(req.url, `http://${req.hostname}:${PORT}`);
  console.log(url.href);
  const type = url.searchParams.get("type");
  if (type !== "csbts") throw new Error("type field error");
  const param = url.searchParams.get("param");
  if (!param) throw new Error("param is falsy");

  res.json({
    code: "200",
    msg: "数据读取成功",
    data: [
      {
        CZZZDW: "048",
        CZZZRQ: "2009-10",
        MCZZDW: "131",
        MCZZRQ: "2018-07-09 00:00:00",
        SCZZDW: "131",
        SCZZRQ: "2018-07-09 00:00:00",

        DH: "dh" + param,
        ZH: param,
        ZX: "RE2B",
        SRYY: "厂修",
        SRDW: "588",
      },
    ],
  });
});

hmisRouter.post("/lzjx/dx/csbts/device_api/csbts/api/saveData", (req, res) => {
  const url = new URL(req.url, `http://${req.hostname}:${PORT}`);
  console.log(url.href, req.body, req.headers["content-type"]);
  const type = url.searchParams.get("type");
  if (type !== "csbts") throw new Error("type field is not csbts");

  res.json({
    code: "200",
    msg: "数据上传成功",
  });
});

// JTV 徐州北
hmisRouter.get("/pmss/vjkxx.do", (req, res) => {
  const url = new URL(req.url, `http://${req.hostname}:${PORT}`);
  console.log(url.href);
  const param = url.searchParams.get("param");

  res.json([
    {
      DH: "dh" + param,
      CZZZRQ: "2013-07-01 00:00:00",
      MCZZRQ: "2022-12-05 00:00:00",
      ZH: param,
      SCZZRQ: "2013-08-30 00:00:00",
      SRDW: "667",
      MCZZDW: "111",
      SRRQ: "2025-03-27 00:00:00",
      SRYY: "01",
      CZZZDW: "043",
      YTX: null,
      ZX: "RE2B",
      SCZZDW: "155",
      ZTX: null,
      COUNT: "1",
    },
  ]);
});

hmisRouter.post("/pmss/example.do", (req, res) => {
  const url = new URL(req.url, `http://${req.hostname}:${PORT}`);
  console.log(url.href, req.body, req.headers["content-type"]);
  res.json(true);
});
