import type { APIRoute } from "astro";

const vercelToken = import.meta.env.VERCEL_TOKEN || "";
const vercelPrjId = import.meta.env.VERCEL_PROJECT_ID || "";

export const get: APIRoute = async () => {
  try {
    const now = new Date();
    const isoDate = now.toISOString();
    const res = await fetch(
      `https://api.vercel.com/v4/usage/top?from=2023-02-16T16%3A00%3A00.000Z&to=${isoDate}&limit=5&sortKey=requests&pathType=request_path&projectId=${vercelPrjId}`,
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
      const totalRequests = resJson.data.find(
        (item) => item.target_path === "/api/generate"
      );
      return new Response(`${totalRequests.requests} 请求`);
    }
    return new Response("请求繁忙");
  } catch (error) {
    return new Response("请求难蚌");
  }
};
