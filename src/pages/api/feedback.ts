import type { APIRoute } from "astro";
import { verifySignature } from "@/utils/auth";

const feedbackApi = import.meta.env.FEEDBACK_URL;

export const post: APIRoute = async (context) => {
  const body = await context.request.json();
  const { sign, time, messages, code } = body;

  if (!code) {
    return new Response("Invalid signature");
  }
  if (!messages) {
    return new Response("No input text");
  }

  if (
    import.meta.env.PROD &&
    !(await verifySignature(
      { t: time, m: messages?.[messages.length - 1]?.content || "" },
      sign
    ))
  ) {
    return new Response("Invalid signature");
  }

  const content = messages[messages.length - 1]?.content;
  if (!content) {
    return new Response("No input text");
  }
  const response = (await fetch(
    `${feedbackApi}?code=${code}&content=${content}`,
    {
      method: "GET",
    }
  )) as Response;

  return new Response(response.body);
};
