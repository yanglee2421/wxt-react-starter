#! deno run

const chinese = /\u4e00-\u9fa5/;
export const toIsChinese = chinese.test.bind(chinese);

const regHan = /\p{sc=Han}/u;
export const toIsHan = regHan.test.bind(regHan);

const regGreek = /\p{Script=Greek}/u;
export const toIsGreek = regGreek.test.bind(regGreek);

const regUI = /\p{Unified_Ideograph}/u;
export const toIsUnifiedIdeograph = regUI.test.bind(regUI);
