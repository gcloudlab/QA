import type { APIRoute } from "astro";
import { generatePayload, parseOpenAIStream } from "@/utils/openAI";
// #vercel-disable-blocks
import { fetch, ProxyAgent } from "undici";
// #vercel-end

const apiKey = import.meta.env.OPENAI_API_KEY || "";
const https_proxy = import.meta.env.HTTPS_PROXY || "";
const THRESHOLD = 1;
const rateLimit = {
  count: 0,
  lastAccessTime: Date.now(),
};

export const post: APIRoute = async (context) => {
  const body = await context.request.json();
  const messages = body.messages;
  const customKey = body.customKey;

  if (!messages) {
    return new Response("No input text");
  }
  const now = Date.now();

  if (now - rateLimit.lastAccessTime < 4000) {
    // 1000毫秒=1秒
    if (rateLimit.count >= THRESHOLD) {
      return new Response("⚠ Request is too fast, please wait a second~");
    }
    rateLimit.count++;
  } else {
    rateLimit.count = 1;
    rateLimit.lastAccessTime = now;
  }

  const initOptions = generatePayload(
    customKey !== "" ? customKey : apiKey,
    messages
  );
  // #vercel-disable-blocks
  if (https_proxy) {
    initOptions["dispatcher"] = new ProxyAgent(https_proxy);
  }
  // #vercel-end

  // @ts-ignore
  const response = (await fetch(
    "https://api.openai.com/v1/chat/completions",
    initOptions as any
  )) as Response;

  return new Response(parseOpenAIStream(response));
};
