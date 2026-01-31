export default function cn(...args: Array<string | false | null | undefined>) {
  return args.filter(Boolean).join(' ');
}
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}