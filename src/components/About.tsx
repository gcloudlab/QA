export default () => (
  <div text-sm text-slate-4 pt-2 ml-1 border-t border-dashed border-slate>
    <p>
      <span text-lg text-slate-5>
        关于
      </span>
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
        密钥并填写 (用户密钥均保存在用户本地，不涉及任何上传功能)。
      </strong>
      你也可以选中"免费体验密钥"功能 (默认已开启)，即可使用站长提供的
      <strong>免费密钥且无需填写自己的密钥</strong>
      体验 (若填写则优先使用你的密钥)。
    </p>
    <p>
      <span text-lg text-slate-5>
        注意
      </span>{" "}
      免费体验功能不保证稳定提供（使用人数较多响应较慢，或密钥额度已用完但是没来得及手动更新，以及更新后需要用户刷新网页），可以戳一下QQ{" "}
      <strong>3224266014</strong>{" "}
      更新密钥。或点击上方链接购买私有密钥或ChatGPT账号。白嫖不易
      ($50/天)，你的打赏就是我的动力 (最下方打赏按钮直达)～
    </p>
    <p>
      <span text-lg text-slate-5>
        域名
      </span>{" "}
      <a
        border-b
        border-slate
        border-none
        hover:border-dashed
        href="https://qachat.cn"
        target="_blank">
        https://qachat.cn
      </a>{" "}
      (国内)；
      <a
        border-b
        border-slate
        border-none
        hover:border-dashed
        href="https://qachat.vercel.app"
        target="_blank">
        https://qachat.vercel.app
      </a>{" "}
      (国外)。
    </p>
    <p>
      <span text-lg text-slate-5>
        交流
      </span>{" "}
      QQ群982545311 或{" "}
      <a
        border-b
        border-slate
        border-none
        hover:border-dashed
        href="https://t.me/yesmore_cc"
        target="_blank">
        Telegram (集成ChatGPT喵娘机器人)
      </a>
    </p>
    <details mt-1>
      <summary class="-ml-8">免责声明</summary>
      <p>
        本站使用 GPT-3.5 API
        生成信息，不保证信息的准确性、完整性、及时性或适用性。本站不对因使用或无法使用本站而导致的任何损失或损害承担任何责任。本站不对
        GPT-3.5 API
        所提供的信息的准确性、完整性、及时性或适用性承担任何责任。本站不对第三方链接和内容的准确性、完整性、及时性或适用性承担任何责任。本站保留更改或暂停本站或
        GPT-3.5 API 的权利，而无需提前通知。使用本站和 GPT-3.5 API
        意味着您同意本免责声明的所有条款和条件。
      </p>
    </details>
  </div>
);
