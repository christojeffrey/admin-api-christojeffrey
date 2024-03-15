import { getJwks, useKVStore, verify, KVNamespaceOrKeyValueStore } from "verify-rsa-jwt-cloudflare-worker";
interface Env {
  JWKS_URI: string;
  ADMIN_API_CHRISTOJEFFREY_CACHE: KVNamespaceOrKeyValueStore;
}

async function validateAccessToken(jwkUri, jwksCacheKV, token): Promise<{ error: boolean }> {
  let payload;
  try {
    const jwks = await getJwks(jwkUri, useKVStore(jwksCacheKV));
    const temp = await verify(token, jwks);
    payload = temp.payload;
  } catch (error: any) {
    // return new Response((error as Error).message, { status: 401 });
    return { error: true };
  }
  //   TODO: validate the payload
  console.log(payload);
  if (payload.iss !== "https://christojeffrey.kinde.com") {
    return { error: true };
  }
  return { error: false };
}

const middlewareAuthenticate: PagesFunction<Env> = async (context) => {
  const token = context.request.headers.get("Authorization")?.replace(/Bearer\s+/i, "") || "";
  const { error } = await validateAccessToken(context.env.JWKS_URI, context.env.ADMIN_API_CHRISTOJEFFREY_CACHE, token);
  if (error) {
    return new Response("Unauthorized", { status: 403 });
  }

  return context.next();
};

export const onRequest = [middlewareAuthenticate];
