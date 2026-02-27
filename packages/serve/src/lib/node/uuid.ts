#! pnpm tsx
import { randomUUID } from "node:crypto";

export function uuid() {
  return randomUUID();
}
