# QAGPT

Chat with Ai, based on ChatGPT [OpenAI GPT-3.5 Turbo API](https://platform.openai.com/docs/guides/chat), so fast~

![web](./web.png)

## Feature

- Really fast
- Support custom key
- Random conversation scene prompts
- Pre settings

## Environment variables

> Make sure to rename the file `.env.example` to `.env`, and fill in the `OPENAI_API_KEY` value via [OpenAI](https://platform.openai.com/account/api-keys).
> 
> If you want to test locally, make sure fill in the `HTTPS_PROXY` value. 


| Name                  | Description                    | Example                        |
| --------------------- | ------------------------------ | ------------------------------ |
| `OPENAI_API_BASE_URL` | Custom base url for OpenAI API | `https://api.openai.com`       |
| `OPENAI_API_KEY`      | Custom OpenAI API Key          | `sk-eawsgfwegwaqeqtq234516512` |
| `HTTPS_PROXY`         | Provide proxy for OpenAI API   | `http://127.0.0.1:7890`        |
| `SECRET_KEY`          | Secret string for the project  | `123456`                       |


## Setup

```bash
git clone https://github.com/yesmore/QA.git

pnpm i
# make sure your Node.js version is 18.+
pnpm dev
```

## Deploy With Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyesmore%2FQA&env=OPENAI_API_KEY&envDescription=OpenAI%20API%20Key&envLink=https%3A%2F%2Fplatform.openai.com%2Faccount%2Fapi-keys)

## License

[GPL](./LICENSE)

## Thanks

- [chatgpt-demo](https://github.com/ddiu8081/chatgpt-demo)
- [Awesome ChatGPT Prompts](https://prompts.chat/)

<a href="https://www.buymeacoffee.com/yesmore" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>