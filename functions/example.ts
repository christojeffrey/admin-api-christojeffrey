import { getJwks, useKVStore, verify, KVNamespaceOrKeyValueStore } from "verify-rsa-jwt-cloudflare-worker";
interface Env {
  JWKS_URI: string;
  JWKS_CACHE: KVNamespaceOrKeyValueStore;
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
}

import { Redis } from "@upstash/redis/cloudflare";

export const onRequest: PagesFunction<Env> = async (context) => {
  const token = context.request.headers.get("Authorization")?.replace(/Bearer\s+/i, "") || "";
  try {
    const jwks = await getJwks(context.env.JWKS_URI, useKVStore(context.env.JWKS_CACHE));
    const { payload } = await verify(token, jwks);
    // TODO: validate the payload
    const redis = Redis.fromEnv({
      UPSTASH_REDIS_REST_URL: context.env.UPSTASH_REDIS_REST_URL,
      UPSTASH_REDIS_REST_TOKEN: context.env.UPSTASH_REDIS_REST_TOKEN,
    });

    await redis.set("foo", "bar");
    const foo = await redis.get("foo");

    // return a response
    return new Response(JSON.stringify({ payload, foo: foo }), {
      headers: { "content-type": "application/json" },
    });
  } catch (error: any) {
    return new Response((error as Error).message, { status: 401 });
  }
};
