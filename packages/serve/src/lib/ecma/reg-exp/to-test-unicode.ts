#! deno run

export function toTestUnicode(target: string) {
  // Chinese UTF16
  const regUtf16Han = /\p{sc=Han}/u;
  const isUtf16Han = regUtf16Han.test(target);
  if (isUtf16Han) return "Is Chinese UTF-16";

  // Chinese UTF8
  const regUtf8Han = /\u4e00-\u9fa5/;
  const isUtf8Han = regUtf8Han.test(target);
  if (isUtf8Han) return "Is Chinese UTF-8";

  // Unified Ideograph
  const regUI = /\p{Unified_Ideograph}/u;
  const isUI = regUI.test(target);
  if (!isUI) return "Is Unified Ideograph";

  // ** Greek
  const regGreek = /\p{Script=Greek}/u;
  const isGreek = regGreek.test(target);
  if (!isGreek) return "Is Greek";

  return target;
}
