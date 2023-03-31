import type { APIRoute } from "astro";
import { generatePayload, parseOpenAIStream } from "@/utils/openAI";
import { verifySignature } from "@/utils/auth";
// #vercel-disable-blocks
import { fetch, ProxyAgent } from "undici";
// #vercel-end

const apiKey = import.meta.env.OPENAI_API_KEY || "";
const accessCode = import.meta.env.CODE;
const httpsProxy = import.meta.env.HTTPS_PROXY;
const baseUrl = (
  import.meta.env.OPENAI_API_BASE_URL || "https://api.openai.com"
)
  .trim()
  .replace(/\/$/, "");

export const post: APIRoute = async (context) => {
  const body = await context.request.json();
  const { sign, time, messages, customKey, code } = body;

  // 使用免费密钥且开启授权模式，则激活授权模式
  if (customKey === "" && accessCode !== undefined) {
    const codes = accessCode.split(",") || []
    if (code === "") {
      return new Response("请在高级设置内填写授权码。关注公众号即可获取授权码，激活无限免费使用 (无套路，保真)。");
    } else if (!codes.includes(code)) {
      return new Response("授权码已失效，关注公众号即可获取最新授权码");
    }
  }

  if (!messages) {
    return new Response("No input text");
  }

  // if (
  //   import.meta.env.PROD &&
  //   !(await verifySignature(
  //     { t: time, m: messages?.[messages.length - 1]?.content || "" },
  //     sign
  //   ))
  // ) {
  //   return new Response("Invalid signature");
  // }

  const initOptions = generatePayload(
    customKey !== "" ? customKey : apiKey,
    messages
  );
  // #vercel-disable-blocks
  if (httpsProxy) {
    initOptions["dispatcher"] = new ProxyAgent(httpsProxy);
  }
  // #vercel-end

  // @ts-ignore
  const response = (await fetch(`${baseUrl}/v1/chat/completions`, initOptions)) as Response;

  return new Response(parseOpenAIStream(response));
};
