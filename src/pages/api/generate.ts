import type { APIRoute } from "astro";
import { generatePayload, parseOpenAIStream } from "@/utils/openAI";
import { verifySignature } from "@/utils/auth";
// #vercel-disable-blocks
import { fetch, ProxyAgent } from "undici";
// #vercel-end

const apiKey = import.meta.env.OPENAI_API_KEY || "";
const accessCode = import.meta.env.CODE;
const accessCheckApi = import.meta.env.ACCESS_CHECK_URL;
const httpsProxy = import.meta.env.HTTPS_PROXY;
const baseUrl = (
  import.meta.env.OPENAI_API_BASE_URL || "https://api.openai.com"
)
  .trim()
  .replace(/\/$/, "");

export const post: APIRoute = async (context) => {
  const body = await context.request.json();
  const { messages, customKey, code, continuous } = body;

  if (!messages) {
    return new Response("No input text");
  }

  let apiKeyFromPool = ""
  const access_check = await requestAccessCheck(code)

  // 开启连续对话且对话长度大于5，使用免费密钥且开启授权模式，则激活授权模式
  if (continuous && messages.length > 5 && customKey === "" && accessCode !== undefined) {
    if (code === "") {
      return new Response("Hi~ 使用免费版连续对话需要在**高级设置**内填写**授权码**，且连续对话不限速。扫码(右上方二维码)关注公众号即可获取授权码，激活免费使用 (为保障免费服务稳定提供，授权码有效期为**5小时**，过期后重新获取即可)。");
    }
  }

  if (code === "") {
    apiKeyFromPool = apiKey
  }
  if (code !== "" && access_check?.code !== 200) {
    return new Response(access_check?.msg)
  }
  if (code !== "" && access_check?.code === 200) {
    apiKeyFromPool = access_check?.data;
  }

  console.log("[apiKeyFromPool]", apiKeyFromPool);

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
    customKey !== "" ? customKey : apiKeyFromPool,
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

const requestAccessCheck = async (code: string) => {
  // @ts-ignore
  const response = (await fetch(`${accessCheckApi}?code=${code}`, {
    method: "GET",
  })) as Response;
  const data = response.body;
  const reader = data.getReader();
  const decoder = new TextDecoder("utf-8");

  const { value, done: readerDone } = await reader?.read();
  let char = decoder.decode(value);
  let parse = JSON.parse(char) || {};

  return parse;
};
