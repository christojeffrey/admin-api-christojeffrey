// get all the projects items
// 404
export const onRequest: PagesFunction = async (context) => {
  return new Response(
    JSON.stringify({
      error: "Not found",
    }),
    {
      status: 404,
      headers: { "content-type": "application/json" },
    }
  );
};
