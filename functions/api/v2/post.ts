interface Env {
  Mind_KV: any;
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const onRequestOptions = async () => {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
};

export const onRequestPost = async (context: {
  request: Request;
  env: Env;
}) => {
  const { request, env } = context;

  try {
    const body = await request.arrayBuffer();
    if (!body || body.byteLength === 0) {
      return new Response(JSON.stringify({ error: "Empty request body" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      });
    }

    if (body.byteLength > 25 * 1024 * 1024) {
      return new Response(
        JSON.stringify({ error_class: "RequestTooLargeError" }),
        {
          status: 413,
          headers: { "Content-Type": "application/json", ...CORS_HEADERS },
        },
      );
    }

    const id = crypto.randomUUID().replace(/-/g, "").slice(0, 20);

    const kv = env.Mind_KV;
    if (!kv) {
      return new Response(
        JSON.stringify({
          error:
            "KV namespace Mind_KV is not bound. Please bind Mind_KV in Cloudflare Settings -> Functions -> KV namespace bindings.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...CORS_HEADERS },
        },
      );
    }

    await kv.put(id, body);

    return new Response(JSON.stringify({ id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...CORS_HEADERS,
      },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || "Failed to save scene" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      },
    );
  }
};
