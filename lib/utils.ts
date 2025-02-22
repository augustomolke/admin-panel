import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function arrayToObjects(data) {
  if (!Array.isArray(data) || data.length < 2) {
    throw new Error(
      "Invalid input: Must be an array of arrays with at least two rows"
    );
  }

  const keys = data[0];
  return data.slice(1).map((row) => {
    return keys.reduce((obj, key, index) => {
      obj[key.toLowerCase()] = row[index];
      return obj;
    }, {});
  });
}
