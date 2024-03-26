interface Env {
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
}

import { validItems } from "../../../constants";
import { updateExperiencesHandler } from "./experienceHandler";
import { updatePhotosHandler } from "./photosHandler";
import { updateProjectsHandler } from "./projectsHandler";

// item could be projects, photos, experiences
export const onRequestPost: PagesFunction<Env> = async (context) => {
  // validate the request body
  const item: string = context.params.item as string;
  if (!validItems.includes(item)) {
    return new Response(
      JSON.stringify({
        error: "Invalid item",
      }),
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }
  if (item === "projects") {
    return updateProjectsHandler(context);
  } else if (item === "photos") {
    return updatePhotosHandler(context);
  } else if (item === "experiences") {
    return updateExperiencesHandler(context);
  }
};
