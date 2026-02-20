import { Falsey } from "@/types";

export function compact<TData>(list: Array<TData | Falsey>) {
  return list.filter(Boolean) as TData[];
}
