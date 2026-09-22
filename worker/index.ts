interface Env {
  Mind_KV: KVNamespace;
  ASSETS: Fetcher;
}

interface KVNamespace {
  get(
    key: string,
    options?: { type?: "text" | "json" | "arrayBuffer" | "stream" },
  ): Promise<any>;
  put(
    key: string,
    value: string | ArrayBuffer | ArrayBufferView | ReadableStream,
    options?: any,
  ): Promise<void>;
}

interface Fetcher {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS,
      });
    }

    // 1. POST /api/v2/post or /api/v2/post/ (Save Scene)
    if (
      request.method === "POST" &&
      (url.pathname === "/api/v2/post" || url.pathname === "/api/v2/post/")
    ) {
      try {
        const body = await request.arrayBuffer();
        if (!body || body.byteLength === 0) {
          return new Response(JSON.stringify({ error: "Empty request body" }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...CORS_HEADERS },
          });
        }

        // Limit maximum size to 25MB (Cloudflare KV limit)
        if (body.byteLength > 25 * 1024 * 1024) {
          return new Response(
            JSON.stringify({ error_class: "RequestTooLargeError" }),
            {
              status: 413,
              headers: { "Content-Type": "application/json", ...CORS_HEADERS },
            },
          );
        }

        // Generate unique 20-character alphanumeric ID
        const id = crypto.randomUUID().replace(/-/g, "").slice(0, 20);

        // Save to Cloudflare KV
        await env.Mind_KV.put(id, body);

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
    }

    // 2. GET /api/v2/:id (Load Scene)
    if (request.method === "GET" && url.pathname.startsWith("/api/v2/")) {
      const id = url.pathname.replace(/^\/api\/v2\//, "").replace(/\/$/, "");
      if (!id || id === "post") {
        return new Response(JSON.stringify({ error: "Invalid ID" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...CORS_HEADERS },
        });
      }

      try {
        const data = await env.Mind_KV.get(id, { type: "arrayBuffer" });
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
    }

    // Pass all other requests to static assets (Excalidraw SPA)
    return env.ASSETS.fetch(request);
  },
};
