// interface Env {
//   KV: KVNamespace;
// }

export const onRequest: PagesFunction = async (context) => {
  //   const value = await context.env.KV.get("example");
  //   return new Response(value);
  return new Response("Hello, world!");
};
