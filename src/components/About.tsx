import { DAO } from "@/contants";

export default () => (
  <div text-sm text-slate-4 pt-2 ml-1 border-t border-dashed border-slate>
    <p>
      <span text-lg text-slate-5>
        App下载
      </span>{" "}
      由于OpenAI官方对API请求限速 3次/分钟，所以当长时间无回复时时，请点击暂停按钮，并重新尝试发送，或稍等几秒后再发送。{" "}
    </p>
    <p>
      <span text-lg text-slate-5>
        注意
      </span>{" "}
      本站严禁用户输入/输出任何违反法律法规、道德规范、社会公德的内容，包括但不限于涉及黄色、色情、淫秽、赌博、毒品等违禁内容，侵犯他人知识产权、隐私权等合法权益的内容等。
    </p>
    <p>
      <span text-lg text-slate-5>
        关于
      </span>
      {"  "}
      本站基于问答 Ai，如果你想和它聊天，
      <strong>
        请先准备好{" "}
        <a
          border-b
          border-slate
          border-none
          hover:border-dashed
          href="https://platform.openai.com/account/api-keys"
          target="_blank">
          API Key (密钥)
        </a>{" "}
        并填写 (用户密钥均保存在用户本地，不涉及任何上传功能)。
      </strong>
      你也可以选中"免费体验密钥"功能 (默认已开启)，即可使用站长提供的
      <strong>免费密钥且无需填写自己的密钥</strong>
      体验 (若填写则优先使用你的密钥)。
    </p>
    <p>
      <span text-lg text-slate-5>
        域名
      </span>{" "}
      由于域名频繁被qiang，备用域名按照 a、b、c、d 准备，例如 a.mydog.buzz,
      b.mydog.buzz。鉴于前几次域名被墙导致有小伙伴迷路，建了个{" "}
      <strong>公众号</strong> 随时更新最新域名及授权码，欢迎扫码关注。
    </p>
    <p>
      <span text-lg text-slate-5>
        打赏
      </span>{" "}
      免费体验功能不保证稳定提供
      (使用人数较多响应较慢，或密钥额度已用完但是没来得及手动更新，以及更新后需要用户刷新网页)。
      白嫖不易，你的打赏就是我的动力
      (站长会根据当日打赏情况决定未来几天的免费额度)～
    </p>
    <p>
      <span text-lg text-slate-5>
        交流
      </span>{" "}
      Q群634323049
      {" · "}
      <a
        border-b
        border-slate
        border-none
        hover:border-dashed
        href="https://t.me/yesmore_cc"
        target="_blank">
        Telegram群组 (集成ChatGPT喵娘机器人)
      </a>
      {" · "}
      <a
        border-b
        border-slate
        border-none
        hover:border-dashed
        href="https://openaizh.cc"
        target="_blank">
        OpenAI中文网
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
