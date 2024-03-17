interface Env {
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
}

import { Redis } from "@upstash/redis/cloudflare";
import { readRequestBody } from "../../utils";
// add a project item
export const onRequestPost: PagesFunction<Env> = async (context) => {
  // validate the request body

  const projects: Project[] = await readRequestBody(context.request);

  if (!Array.isArray(projects)) {
    return new Response(
      JSON.stringify({
        error: "Invalid request body. must be an array",
        body: projects,
      }),
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }

  projects.forEach((projectItem) => {
    if (!validateProject(projectItem)) {
      return new Response(
        JSON.stringify({
          error: "Invalid request body",
          body: projectItem,
        }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }
  });
  const redis = Redis.fromEnv({
    UPSTASH_REDIS_REST_URL: context.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: context.env.UPSTASH_REDIS_REST_TOKEN,
  });
  await redis.json.set("project", "$", JSON.stringify(projects));

  // return a response
  return new Response(JSON.stringify({ projects }), {
    headers: { "content-type": "application/json" },
  });
};

interface Project {
  title: string;
  description: string;
  youtubeLink: string;
}

function validateProject(project: Project) {
  if (!project.title || !project.description || !project.youtubeLink) {
    return false;
  }
  return true;
}
