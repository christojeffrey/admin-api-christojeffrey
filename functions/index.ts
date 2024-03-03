import { getJwks, useKVStore, verify, VerifyRsaJwtEnv, KVNamespaceOrKeyValueStore, GeneralKeyValueStore } from "verify-rsa-jwt-cloudflare-worker";
interface Env {
  JWKS_URI: string;
  VERIFY_RSA_JWT: GeneralKeyValueStore;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  //   const value = await context.env.KV.get("example");
  //   return new Response(value);
  const token = context.request.headers.get("Authorization")?.replace(/Bearer\s+/i, "") || "";
  try {
    const jwks = await getJwks(context.env.JWKS_URI, useKVStore(context.env.VERIFY_RSA_JWT));
    const { payload } = await verify(token, jwks);
    // Then, you could validate the payload and return a response
    return new Response(JSON.stringify({ payload }), {
      headers: { "content-type": "application/json" },
    });
  } catch (error: any) {
    return new Response((error as Error).message, { status: 401 });
  }
};
