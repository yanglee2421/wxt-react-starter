// ** Basic
import "./esm-export";
import defaultExport from "./esm-export";
import { Export1 } from "./esm-export";
import * as name from "./esm-export";

// ** Alias
import { export2 as alias2 } from "./esm-export";

// ** Composition
import defaultExport2, { alias3 } from "./esm-export";
import defaultExport3, * as name2 from "./esm-export";

// ** Dynamic
const module = await import("./esm-export");

// ** Meta
void import.meta.url;

// ** Forward
export { default } from "./esm-export";
export { Export1 } from "./esm-export";
export * from "./esm-export";
export { export2 as alias2 } from "./esm-export";

void defaultExport;
void Export1;
void name;
void alias2;
void defaultExport2;
void alias3;
void defaultExport3;
void name2;
void module;
