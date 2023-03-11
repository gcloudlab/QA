export default () => (
  <p text-sm text-slate-4 pt-2 ml-1 border-t border-dashed border-slate>
    <span text-lg>关于</span>
    {"  "}
    本站基于{" "}
    <a
      border-b
      border-slate
      border-none
      hover:border-dashed
      href="https://platform.openai.com"
      target="_blank">
      OpenAI GPT-3.5 Turbo API
    </a>{" "}
    接口。如果你想和它聊天，
    <strong>
      请先准备好{" "}
      <a
        border-b
        border-slate
        border-none
        hover:border-dashed
        href="https://platform.openai.com/account/api-keys"
        target="_blank">
        OpenAI API Key
      </a>{" "}
      密钥并填写。
    </strong>
    你也可以选择不填，即可使用站长提供的<strong>免费密钥</strong>
    体验。注意，免费体验功能不能保证长久提供。
    <br />
    如果你需要一些灵感，你可以尝试“随机预设场景”，它会自动生成一段来自{" "}
    <a
      border-b
      border-slate
      border-none
      hover:border-dashed
      href="https://prompts.chat/"
      target="_blank">
      Awesome ChatGPT Prompts
    </a>{" "}
    的话题，让你的聊天更加有趣。
  </p>
);
