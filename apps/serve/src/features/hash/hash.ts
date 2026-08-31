import bcrypt from "bcrypt";
import type { AppCradle } from "../types";

export class HashService {
  #rounds: number;

  constructor({ rounds }: AppCradle) {
    this.#rounds = rounds;
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.#rounds);
    const result = await bcrypt.hash(password, salt);
    return result;
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    const result = await bcrypt.compare(password, hash);
    return result;
  }
}
