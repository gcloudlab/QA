import { PRO_URL } from "@/contants";

export default (props: { info: string }) => (
<p class="text-pink-6 my-5">🚨 {props.info}，请稍后再试，或者去看看 <a href={PRO_URL} target="_blank">QAchat Pro -></a> </p>
);
