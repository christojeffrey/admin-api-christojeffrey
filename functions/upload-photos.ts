import { readRequestBody } from "../utils";

export const onRequestPost: PagesFunction = async (context) => {
  // validate the request body

  const photosItem: any = await readRequestBody(context.request);
  console.log(photosItem);

  // return a response
  return new Response(JSON.stringify({}), {
    headers: { "content-type": "application/json" },
  });
};
