export default () => (
  <p text-sm text-slate-4 pt-2 ml-1 border-t border-dashed border-slate>
    <span text-lg text-slate-6>
      About
    </span>
    {"  "}
    The core of this site is based on
    <a
      border-b
      border-slate
      border-none
      hover:border-dashed
      href="https://platform.openai.com"
      target="_blank">
      OpenAI GPT-3.5 Turbo API.{" "}
    </a>
    If you want to chat with it , please prepare the{" "}
    <a
      border-b
      border-slate
      border-none
      hover:border-dashed
      href="https://platform.openai.com/account/api-keys"
      target="_blank">
      OpenAI API Key
    </a>{" "}
    and fill in first. <br />
    You can try "Random prompt", click it to automatically generate a prompt
    from{" "}
    <a
      border-b
      border-slate
      border-none
      hover:border-dashed
      href="https://prompts.chat/"
      target="_blank">
      Awesome ChatGPT Prompts
    </a>
    .
  </p>
);
