import { Redis } from "@upstash/redis/cloudflare";
interface Env {
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
}

// get all the portfolio items
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const redis = Redis.fromEnv({
    UPSTASH_REDIS_REST_URL: context.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: context.env.UPSTASH_REDIS_REST_TOKEN,
  });

  const portfolio = await redis.json.get("portfolio");
  return new Response(
    JSON.stringify({
      portfolio: portfolio || "[]",
    }),
    {
      headers: { "content-type": "application/json" },
    }
  );
};
