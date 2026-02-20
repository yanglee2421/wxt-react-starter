/**
 * 1.unicode属性类：汉字类
 * 2.utf8中的汉字的编码
 * 3.unicode属性类：表意字符（包括汉字）
 * 4.unicode属性类：希腊字母类
 */
const regHan = /\p{sc=Han}/u;
const chinese = /\u4e00-\u9fa5/;
const reg3 = /\p{Unified_Ideograph}/u;
const regGreek = /\p{Script=Greek}/u;
const str = "π";
regGreek.test(str);
// return true
