import type { APIRoute } from "astro";

const vercelToken = import.meta.env.VERCEL_TOKEN || "";
const vercelTeamId = import.meta.env.VERCEL_TEAM_ID || "";

export const get: APIRoute = async () => {
  try {
    const res = await fetch(
      `https://api.vercel.com/v6/web/insights/realtime?teamId=${vercelTeamId}&projectId=qachat`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: vercelToken,
        },
        method: "GET",
      }
    );
    if (res.status === 200) {
      const resJson = await res.json();
      return new Response(resJson.devices);
    }
    return new Response("1000");
  } catch (error) {
    return new Response("1001");
  }
};
