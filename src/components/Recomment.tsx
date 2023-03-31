import { OFFICIAL_ACCOUNT_LINK } from "@/contants";

export default () => (
  <div class="z-1 flex flex-col items-center">
    <img class=" rounded-md" src={OFFICIAL_ACCOUNT_LINK} h-24 />
    <p text-pink-7 text-sm mt-2 font-700>
      关注公众号防走失
      <br /> 定期更新最新域名
    </p>
  </div>
);
