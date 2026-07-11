import type { Context } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ success: false, error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  const apiKey = Netlify.env.get("IMGBB_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ success: false, error: "Server is not configured with an ImgBB API key yet." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let base64Image: string;
  try {
    const body = await req.json();
    base64Image = body.image;
    if (!base64Image || typeof base64Image !== "string") {
      throw new Error("Missing image");
    }
  } catch {
    return new Response(JSON.stringify({ success: false, error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const form = new URLSearchParams();
    form.set("image", base64Image);

    const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString()
    });

    const data = await imgbbRes.json();

    if (!imgbbRes.ok || !data?.data?.url) {
      return new Response(
        JSON.stringify({ success: false, error: data?.error?.message || "ImgBB upload failed" }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ success: true, url: data.data.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: "Upstream request failed" }), {
      status: 502,
      headers: { "Content-Type": "application/json" }
    });
  }
};
