#! deno run

/**
 * At least one lowercase & one uppercase character
 * At least one number
 * At least one underline or dollar sign
 */
const regPwd = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$_])[$_\dA-z]+$/;
export const toIsPwd = regPwd.test.bind(regPwd);
