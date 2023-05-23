// this file is a dulicate of /lib/utils.ts, but the name is different and need to hunt down where it is used originally
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
