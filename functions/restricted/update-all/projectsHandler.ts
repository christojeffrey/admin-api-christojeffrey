import { Redis } from "@upstash/redis/cloudflare";
import { Env, Project } from "../../../types";
import { readRequestBody } from "../../../utils";

export async function updateProjectsHandler(context: EventContext<Env, any, Record<string, unknown>>) {
  const projects: Project[] = await readRequestBody(context.request);

  if (!Array.isArray(projects)) {
    return new Response(
      JSON.stringify({
        error: "Invalid request body. must be an array",
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
}

function validateProject(project: Project) {
  if (!project.title || !project.description || !project.youtubeLink) {
    return false;
  }
  return true;
}
