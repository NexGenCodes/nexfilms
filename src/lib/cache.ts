import { OTP_EXPIRATION } from "@/constants";
import NodeCache from "node-cache";


class CacheSingleton {
  private static instance: CacheSingleton;
  private cache: NodeCache;

  private constructor() {
    this.cache = new NodeCache({
      stdTTL: OTP_EXPIRATION,
      checkperiod: 240,
    });
  }

  public static getInstance(): CacheSingleton {
    if (!CacheSingleton.instance) {
      CacheSingleton.instance = new CacheSingleton();
    }
    return CacheSingleton.instance;
  }

  public get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  public set<T>(key: string, value: T, ttl?: number): boolean {
    return ttl ? this.cache.set(key, value, ttl) : this.cache.set(key, value);
  }

  public del(key: string): void {
    this.cache.del(key);
  }

  public flushAll(): void {
    this.cache.flushAll();
  }
}

const cacheInstance = CacheSingleton.getInstance();

export function getFromCache<T>(key: string): T | undefined {
  return cacheInstance.get<T>(key);
}

export function setToCache<T>(key: string, value: T, ttl?: number): boolean {
  return cacheInstance.set<T>(key, value, ttl);
}

export function deleteFromCache(key: string): void {
  cacheInstance.del(key);
}

export function clearCache(): void {
  cacheInstance.flushAll();
}

export default cacheInstance;