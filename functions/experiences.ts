import { Redis } from "@upstash/redis/cloudflare";
interface Env {
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
}

// get all the experiences items
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const redis = Redis.fromEnv({
    UPSTASH_REDIS_REST_URL: context.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: context.env.UPSTASH_REDIS_REST_TOKEN,
  });
  const experiences = await redis.json.get("experiences");

  return new Response(
    JSON.stringify({
      experiences: experiences || "[]",
    }),
    {
      headers: { "content-type": "application/json" },
    }
  );
};
