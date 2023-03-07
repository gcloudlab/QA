export default (props: { info: string }) => (
  <p class="text-pink-6 my-5">
    🚨 {props.info}, please try again later, or{" "}
    <a
      href="https://github.com/yesmore/QA/issues"
      class=" underline hover:text-black">
      report issue
    </a>
    .{" "}
  </p>
);
