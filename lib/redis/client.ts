type CacheValue = { value: string; expiresAt: number }

type RedisLike = {
  get: (key: string) => Promise<string | null>
  set: (key: string, value: string, mode: "EX", ttlSeconds: number) => Promise<unknown>
}

const memoryCache = new Map<string, CacheValue>()

async function loadIoRedis(): Promise<{ default: new (url: string) => RedisLike } | null> {
  try {
    const dynamicImport = new Function("m", "return import(m)") as (
      moduleName: string,
    ) => Promise<{ default: new (url: string) => RedisLike }>

    return await dynamicImport("ioredis")
  } catch {
    return null
  }
}

async function createRedisClient(): Promise<RedisLike | null> {
  const redisModule = await loadIoRedis()
  if (!redisModule) {
    return null
  }

  const redisUrl = process.env.REDIS_URL
  if (!redisUrl) {
    return null
  }

  const Redis = redisModule.default
  return new Redis(redisUrl)
}

let clientPromise: Promise<RedisLike | null> | null = null

export async function getRedisClient() {
  if (!clientPromise) {
    clientPromise = createRedisClient()
  }
  return clientPromise
}

export async function cacheGet(key: string): Promise<string | null> {
  const redis = await getRedisClient()
  if (redis) {
    return redis.get(key)
  }

  const item = memoryCache.get(key)
  if (!item || Date.now() > item.expiresAt) {
    memoryCache.delete(key)
    return null
  }
  return item.value
}

export async function cacheSet(key: string, value: string, ttlSeconds: number): Promise<void> {
  const redis = await getRedisClient()
  if (redis) {
    await redis.set(key, value, "EX", ttlSeconds)
    return
  }

  memoryCache.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 })
}
