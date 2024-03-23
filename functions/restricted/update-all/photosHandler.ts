import { Redis } from "@upstash/redis/cloudflare";
import { Env, Photo } from "../../../types";
import { readRequestBody } from "../../../utils";

export async function updatePhotosHandler(context: EventContext<Env, any, Record<string, unknown>>) {
  const photos: Photo[] = await readRequestBody(context.request);

  if (!Array.isArray(photos)) {
    return new Response(
      JSON.stringify({
        error: "Invalid request body. must be an array",
      }),
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }

  photos.forEach((photoItem) => {
    if (!validatePhoto(photoItem)) {
      return new Response(
        JSON.stringify({
          error: "Invalid request body",
          body: photoItem,
        }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }
  });
  const redis = Redis.fromEnv({
    UPSTASH_REDIS_REST_URL: context.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: context.env.UPSTASH_REDIS_REST_TOKEN,
  });
  await redis.json.set("photos", "$", JSON.stringify(photos));

  // return a response
  return new Response(JSON.stringify({ photos }), {
    headers: { "content-type": "application/json" },
  });
}

// TODO: validate photos
function validatePhoto(project: Photo) {
  return true;
}
