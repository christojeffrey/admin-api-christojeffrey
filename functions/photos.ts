import { Redis } from "@upstash/redis/cloudflare";
interface Env {
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
}

// get all the photos items
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const redis = Redis.fromEnv({
    UPSTASH_REDIS_REST_URL: context.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: context.env.UPSTASH_REDIS_REST_TOKEN,
  });
  const photos = await redis.json.get("photos");

  return new Response(
    JSON.stringify({
      photos: photos || "[]",
    }),
    {
      headers: { "content-type": "application/json" },
    }
  );
};
