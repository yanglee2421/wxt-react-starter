import fs from "node:fs/promises";
import path from "node:path";
const filePath = path.resolve(__dirname, "../README.md");
const neoPath = path.resolve(__dirname, "./l.txt");

fs.appendFile(filePath, "");
fs.readFile(filePath);
fs.rm(filePath);
fs.copyFile(filePath, neoPath);
fs.rename(filePath, neoPath);
fs.mkdir(filePath);
