import { Client } from "basic-ftp";
import path from "node:path";
import url from "node:url";

const main = async () => {
  const client = new Client();
  try {
    await client.access({
      host: "127.0.0.1",
      port: 21,
      user: "admin",
      password: "secret",
      secure: false,
    });

    console.log(await client.list());
    const __filename = url.fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const sourcePath = path.resolve(__dirname, "../package.json");
    await client.ensureDir("/test/123/");
    await client.uploadFrom(sourcePath, "/test/package.json");
  } catch (error) {
    console.error(error);
  } finally {
    client.close();
  }
};

main();
