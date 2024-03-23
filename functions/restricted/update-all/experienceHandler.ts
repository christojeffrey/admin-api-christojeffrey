import { Redis } from "@upstash/redis/cloudflare";
import { Env, Experience, Photo } from "../../../types";
import { readRequestBody } from "../../../utils";

export async function updateExperiencesHandler(context: EventContext<Env, any, Record<string, unknown>>) {
  const experiences: Experience[] = await readRequestBody(context.request);

  if (!Array.isArray(experiences)) {
    return new Response(
      JSON.stringify({
        error: "Invalid request body. must be an array",
      }),
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }

  experiences.forEach((experienceItem) => {
    if (!validateExperience(experienceItem)) {
      return new Response(
        JSON.stringify({
          error: "Invalid request body",
          body: experienceItem,
        }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }
  });
  const redis = Redis.fromEnv({
    UPSTASH_REDIS_REST_URL: context.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: context.env.UPSTASH_REDIS_REST_TOKEN,
  });
  await redis.json.set("photos", "$", JSON.stringify(experiences));

  // return a response
  return new Response(JSON.stringify({ experiences }), {
    headers: { "content-type": "application/json" },
  });
}

// TODO: validate experiences
function validateExperience(experience: Experience) {
  return true;
}
