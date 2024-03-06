interface Env {
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
}

import { Redis } from "@upstash/redis/cloudflare";

// add a portfolio item
export const onRequestPost: PagesFunction<Env> = async (context) => {
  // validate the request body

  const portfolioItem: Portfolio = await readRequestBody(context.request);

  if (!validatePortfolioItem(portfolioItem)) {
    return new Response(
      JSON.stringify({
        error: "Invalid request body",
        body: portfolioItem,
      }),
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }
  const redis = Redis.fromEnv({
    UPSTASH_REDIS_REST_URL: context.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: context.env.UPSTASH_REDIS_REST_TOKEN,
  });
  // get the count of portfolio items
  await redis.json.arrappend("portfolio", "$", portfolioItem);

  // return a response
  return new Response(JSON.stringify({ foo: portfolioItem }), {
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

async function readRequestBody(request) {
  try {
    const contentType = request.headers.get("content-type");
    if (contentType.includes("application/json")) {
      return await request.json();
    } else if (contentType.includes("application/text")) {
      return request.text();
    } else if (contentType.includes("text/html")) {
      return request.text();
    } else if (contentType.includes("form")) {
      const formData = await request.formData();
      const body = {};
      for (const entry of formData.entries()) {
        body[entry[0]] = entry[1];
      }
      return JSON.stringify(body);
    } else {
      // Perhaps some other type of data was submitted in the form
      // like an image, or some other binary data.
      return "a file";
    }
  } catch (e) {
    console.error(e);
    return e.message;
  }
}
