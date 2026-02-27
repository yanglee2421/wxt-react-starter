import * as cva from "@yanglee2421/create-app";
import path from "node:path";
import url from "node:url";

const main = async () => {
  const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

  cva.copyDir(
    path.resolve(__dirname, "../src"),
    path.resolve(__dirname, "../dist"),
  );
};

main();
