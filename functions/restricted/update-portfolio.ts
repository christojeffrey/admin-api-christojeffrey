interface Env {
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
}

import { Redis } from "@upstash/redis/cloudflare";
import { readRequestBody } from "../../utils";
// add a portfolio item
export const onRequestPost: PagesFunction<Env> = async (context) => {
  // validate the request body

  const portfolioItems: Portfolio[] = await readRequestBody(context.request);

  if (!Array.isArray(portfolioItems)) {
    return new Response(
      JSON.stringify({
        error: "Invalid request body. must be an array",
        body: portfolioItems,
      }),
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }

  portfolioItems.forEach((portfolioItem) => {
    if (!validatePortfolioItem(portfolioItem)) {
      return new Response(
        JSON.stringify({
          error: "Invalid request body",
          body: portfolioItem,
        }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }
  });
  const redis = Redis.fromEnv({
    UPSTASH_REDIS_REST_URL: context.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: context.env.UPSTASH_REDIS_REST_TOKEN,
  });
  await redis.json.set("portfolio", "$", JSON.stringify(portfolioItems));

  // return a response
  return new Response(JSON.stringify({ portfolioItems }), {
    headers: { "content-type": "application/json" },
  });
};

interface Portfolio {
  title: string;
  description: string;
  youtubeLink: string;
}

function validatePortfolioItem(portfolioItem: Portfolio) {
  if (!portfolioItem.title || !portfolioItem.description || !portfolioItem.youtubeLink) {
    return false;
  }
  return true;
}
