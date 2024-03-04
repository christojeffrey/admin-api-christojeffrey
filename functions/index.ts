import { getJwks, useKVStore, verify, KVNamespaceOrKeyValueStore } from "verify-rsa-jwt-cloudflare-worker";
interface Env {
  JWKS_URI: string;
  JWKS_CACHE: KVNamespaceOrKeyValueStore;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const token = context.request.headers.get("Authorization")?.replace(/Bearer\s+/i, "") || "";
  try {
    const jwks = await getJwks(context.env.JWKS_URI, useKVStore(context.env.JWKS_CACHE));
    const { payload } = await verify(token, jwks);
    // TODO: validate the payload
    // return a response
    return new Response(JSON.stringify({ payload }), {
      headers: { "content-type": "application/json" },
    });
  } catch (error: any) {
    return new Response((error as Error).message, { status: 401 });
  }
};
