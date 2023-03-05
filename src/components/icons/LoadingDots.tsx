import "@/styles/loading-dots.css";

const LoadingDots = ({
  color = "000",
  style = "small",
}: {
  color?: string;
  style?: string;
}) => {
  return (
    <span class={style == "small" ? "loading2" : "loading"}>
      <span class="bg-black" />
      <span class="bg-black" />
      <span class="bg-black" />
    </span>
  );
};

export default LoadingDots;

LoadingDots.defaultProps = {
  style: "small",
};
