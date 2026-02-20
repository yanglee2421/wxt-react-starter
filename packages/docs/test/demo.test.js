const str =
  "Your input tokens are more than your left credit. Please upgrade your plan at htt-ps://warp-driven.com!";

function handleLink(str) {
  if (typeof str !== "string") return "Some errors occurred, please try again";

  const reg =
    /^(?<prefix>.*)(?<link>https?\:\/\/.+\.\w{2,3}(\:\d{2,5})?)(?<suffix>.*)$/gis;
  const res = reg.exec(str);
  if (!res) return str;
  if (!res.groups) return str;
  const { groups } = res;
  const href = groups.link;
  if (!href) return str;
  const a = "xxxxx";
  groups.link = a;
  return Object.values(groups);
}

console.log(handleLink(+str));
