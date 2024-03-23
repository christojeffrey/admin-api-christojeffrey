import { Redis } from "@upstash/redis/cloudflare";
import { Env } from "../types";

import { validItems } from "../constants";

// get all the projects items
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const redis = Redis.fromEnv({
    UPSTASH_REDIS_REST_URL: context.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: context.env.UPSTASH_REDIS_REST_TOKEN,
  });
  const result: any = {};

  // read in parallel!
  await Promise.all(
    validItems.map(async (item) => {
      result[item] = await redis.json.get(item);
    })
  );

  return new Response(
    JSON.stringify({
      ...result,
    }),
    {
      headers: { "content-type": "application/json" },
    }
  );
};
