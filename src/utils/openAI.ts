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
    model: "gpt-3.5-turbo",
    messages,
    temperature: 0.6,
    stream: true,
  }),
});

export const generateProxyPayload = (messages: ChatMessage[]): RequestInit => ({
  headers: {
    "Content-Type": "application/json",
    "App-Key": "1",
    "App-Secret": "RTX4090",
  },
  method: "POST",
  body: JSON.stringify({
    model: "gpt-3.5-turbo",
    messages,
    temperature: 0.6,
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
    const formatDate = (d: Date) =>
      `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d
        .getDate()
        .toString()
        .padStart(2, "0")}`;
    const ONE_DAY = 24 * 60 * 60 * 1000;
    const now = new Date(Date.now() + ONE_DAY);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startDate = formatDate(startOfMonth);
    const endDate = formatDate(now);
    const res = await fetch(
      `${baseUrl}/dashboard/billing/usage?start_date=${startDate}&end_date=${endDate}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey.trim()}`,
        },
        method: "GET",
      }
    );
    if (res.status === 200) {
      const resJson = await res.json();
      const used = resJson.total_usage / 100;
      return `$${used?.toFixed(2)}`;
    }
    return "出错了";
  } catch (error) {
    return `代理错误`;
  }
};
