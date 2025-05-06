import { setToCache, getFromCache } from "./cache";

export async function rateLimit(
  key: string,
  maxAttempts: number,
  windowSeconds: number
) {
  const attempts = (getFromCache<number>(key) || 0) + 1;
  setToCache(key, attempts, windowSeconds);
  if (attempts > maxAttempts) {
    console.error(`Rate limit exceeded for key: ${key}`);
    return null;
  }
  return true;
}
