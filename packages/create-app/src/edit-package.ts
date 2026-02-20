// NodeJs Imports
import { readFile, writeFile } from "node:fs/promises";

export async function editPackage(params: EditPackageNameParams) {
  // ** Params
  const { jsonPath, ...restParams } = params;

  // Read Data From Previous JSON
  const prevJson = await readFile(jsonPath, { encoding: "utf-8" });
  const data = JSON.parse(prevJson);

  // Edit Data
  Object.assign(data, restParams);
  const nextJson = JSON.stringify(data, null, "\t");

  // Write Data To Next JSON
  await writeFile(jsonPath, nextJson, { encoding: "utf-8", flag: "w" });
}
interface EditPackageNameParams {
  jsonPath: string;
  name: string;
}
