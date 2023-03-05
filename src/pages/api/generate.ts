import type { APIRoute } from "astro";
import { generatePayload, parseOpenAIStream } from "@/utils/openAI";
// #vercel-disable-blocks
import { fetch, ProxyAgent } from "undici";
// #vercel-end

const apiKey = import.meta.env.OPENAI_API_KEY || "";
const https_proxy = import.meta.env.HTTPS_PROXY || "";

export const post: APIRoute = async (context) => {
  const body = await context.request.json();
  const messages = body.messages;
  const customKey = body.customKey;

  if (!messages) {
    return new Response("No input text");
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

// export const post: APIRoute = async (context) => {
//   const body = await context.request.json();
//   const messages = body.messages;
//   const customKey = body.customKey;
//   const encoder = new TextEncoder();
//   const decoder = new TextDecoder();

//   if (!messages) {
//     return new Response("No input text");
//   }

//   const completion = await fetch("https://api.openai.com/v1/chat/completions", {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${customKey != "" ? customKey : apiKey}`,
//     },
//     method: "POST",
//     body: JSON.stringify({
//       model: "gpt-3.5-turbo",
//       messages,
//       temperature: 0.6,
//       stream: true,
//     }),
//   });

//   const stream = new ReadableStream({
//     async start(controller) {
//       const streamParser = (event: ParsedEvent | ReconnectInterval) => {
//         if (event.type === "event") {
//           const data = event.data;
//           if (data === "[DONE]") {
//             controller.close();
//             return;
//           }
//           try {
//             // response = {
//             //   id: 'chatcmpl-6pULPSegWhFgi0XQ1DtgA3zTa1WR6',
//             //   object: 'chat.completion.chunk',
//             //   created: 1677729391,
//             //   model: 'gpt-3.5-turbo-0301',
//             //   choices: [
//             //     { delta: { content: '你' }, index: 0, finish_reason: null }
//             //   ],
//             // }
//             const json = JSON.parse(data);
//             const text = json.choices[0].delta?.content;
//             const queue = encoder.encode(text);
//             controller.enqueue(queue);
//           } catch (e) {
//             // controller.error(e);
//             console.log(e);
//           }
//         }
//       };

//       const parser = createParser(streamParser);
//       for await (const chunk of completion.body as any) {
//         parser.feed(decoder.decode(chunk));
//       }
//     },
//   });

//   return new Response(stream);
// };
