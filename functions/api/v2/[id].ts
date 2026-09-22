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

export const onRequestGet = async (context: {
  request: Request;
  params: { id: string };
  env: Env;
}) => {
  const { params, env } = context;
  const id = params.id;

  if (!id || id === "post") {
    return new Response(JSON.stringify({ error: "Invalid ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });
  }

  try {
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

    const data = await kv.get(id, { type: "arrayBuffer" });
    if (!data) {
      return new Response(JSON.stringify({ error: "Scene not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      });
    }

    return new Response(data, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
        ...CORS_HEADERS,
      },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || "Failed to retrieve scene" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      },
    );
  }
};
