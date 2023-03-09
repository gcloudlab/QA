import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";
import type { ChatMessage } from "@/types";

const baseUrl = (
  import.meta.env.OPENAI_API_BASE_URL || "https://api.openai.com"
)
  .trim()
  .replace(/\/$/, "");

export const generatePayload = (
  apiKey: string,
  messages: ChatMessage[]
): RequestInit => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  },
  method: "POST",
  body: JSON.stringify({
    model: "gpt-3.5-turbo-0301",
    messages,
    temperature: 0.6,
    stream: true,
  }),
});

export const parseOpenAIStream = (rawResponse: Response) => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      const streamParser = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === "event") {
          const data = event.data;
          if (data === "[DONE]") {
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta?.content || "";
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      };

      const parser = createParser(streamParser);
      for await (const chunk of rawResponse.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return stream;
};

export const getCreditGrants = async (apiKey: string) => {
  try {
    const res = await fetch(`${baseUrl}/dashboard/billing/credit_grants`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey.trim()}`,
      },
      method: "GET",
    });
    if (res.status === 200) {
      const resJson = await res.json();
      return `$${resJson.total_used.toFixed(2)} / $${resJson.total_granted}`;
    }
    return "无效密钥";
  } catch (error) {
    return `寄了`;
  }
};
