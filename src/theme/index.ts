import { createSystem, defaultConfig } from "@chakra-ui/react";

const fontStack = "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

export const system = createSystem(defaultConfig, {
  globalCss: {
    body: {
      bg: "gray.50",
      color: "gray.800",
    },
    a: {
      textDecoration: "none",
    },
  },
  theme: {
    tokens: {
      fonts: {
        heading: { value: fontStack },
        body: { value: fontStack },
      },
      radii: {
        xl: { value: "1rem" },
        "2xl": { value: "1.25rem" },
      },
    },
  },
});
