import type { APIRoute } from "astro";

const accessCheckApi = import.meta.env.ACCESS_CHECK_URL;

export const post: APIRoute = async (context) => {
  const body = await context.request.json();
  const { code } = body;

  if (!code) {
    return new Response(JSON.stringify({ code: 401, msg: "" }));
  }

  const response = (await fetch(`${accessCheckApi}?code=${code}`, {
    method: "GET",
  })) as Response;

  return new Response(response.body);
};
