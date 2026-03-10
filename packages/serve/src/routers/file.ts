import { Router } from "express";
import path from "node:path";
import url from "node:url";

const toPublicFile = (fileName: string) => {
  const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
  return path.resolve(__dirname, `../../public/${fileName}`);
};

export const file = Router();

file.get("/pdf/:way", (req, res) => {
  const { way } = req.params;
  const filePath = toPublicFile("demo.pdf");

  switch (way) {
    case "download":
      return res.download(filePath);
    case "view":
      res.setHeader("Content-Type", "application/pdf");
      return res.sendFile(filePath);
    default:
      return res.status(500).send("Invalid Way");
  }
});

file.get("/image/:way", (req, res) => {
  const { way } = req.params;
  const filePath = toPublicFile("/img/bg.jpg");

  switch (way) {
    case "download":
      return res.download(filePath);
    case "view":
      res.setHeader("Content-Type", "image/jpeg");
      return res.sendFile(filePath);
    default:
      return res.status(500).send("Invalid Way");
  }
});
