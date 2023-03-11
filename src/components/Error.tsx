export default (props: { info: string }) => (
  <p class="text-pink-6 my-5">
    🚨 {props.info}，请稍后再试，或者
    <a
      href="https://github.com/yesmore/QA/issues"
      target="_blank"
      class=" underline hover:text-black">
      上报问题
    </a>
    。
  </p>
);
