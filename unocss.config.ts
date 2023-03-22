import {
  defineConfig,
  presetAttributify,
  presetTypography,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetTypography({
      // cssExtend: {
      //   "ul,ol": {
      //     "padding-left": "2.25em",
      //     position: "relative",
      //   },
      // },
    }),
  ],
  transformers: [transformerVariantGroup(), transformerDirectives()],
  shortcuts: [{}],
});
