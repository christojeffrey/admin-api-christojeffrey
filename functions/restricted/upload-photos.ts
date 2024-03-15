import { readRequestBody } from "../../utils";

export const onRequestPost: PagesFunction = async (context) => {
  // validate the request body

  const photosItem: any[] = await readRequestBody(context.request);

  if (!Array.isArray(photosItem)) {
    return new Response(
      JSON.stringify({
        error: "Invalid request body. must be an array",
      }),
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }

  // return a response
  return new Response(JSON.stringify({}), {
    headers: { "content-type": "application/json" },
  });
};
