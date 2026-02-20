import { builtinModules } from "node:module";

export function checkPackageName(pkgName: string) {
  if (typeof pkgName !== "string") {
    console.log("name must be a string");
    return false;
  }

  if (!pkgName.length) {
    console.log("name length must be greater than zero");
    return false;
  }

  if (pkgName.match(/^\./)) {
    console.log("name cannot start with a period");
    return false;
  }

  if (pkgName.match(/^_/)) {
    console.log("name cannot start with an underscore");
    return false;
  }

  if (pkgName.trim() !== pkgName) {
    console.log("name cannot contain leading or trailing spaces");
    return false;
  }

  if (blacklist.includes(pkgName.toLowerCase())) {
    console.log(pkgName.toLowerCase() + " is a blacklisted name");
    return false;
  }

  if (builtinModules.includes(pkgName.toLowerCase())) {
    console.log(pkgName + " is a core module name");
    return false;
  }

  if (pkgName.length > 214) {
    console.log("name can no longer contain more than 214 characters");
    return false;
  }

  if (pkgName.toLowerCase() !== pkgName) {
    console.log("name can no longer contain capital letters");
    return false;
  }

  if (/[~'!()*]/.test(pkgName.split("/").slice(-1)[0])) {
    console.log('name can no longer contain special characters ("~\'!()*")');
    return false;
  }

  if (encodeURIComponent(pkgName) === pkgName) {
    return true;
  }

  const nameMatch = pkgName.match(scopedPackagePattern);

  if (nameMatch) {
    const user = nameMatch[1];
    const pkg = nameMatch[2];
    if (encodeURIComponent(user) === user && encodeURIComponent(pkg) === pkg) {
      return false;
    }
  }

  return true;
}

const blacklist = ["node_modules", "favicon.ico"];
const scopedPackagePattern = new RegExp("^(?:@([^/]+?)[/])?([^/]+?)$");
