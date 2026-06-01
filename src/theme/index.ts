import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

export const theme = extendTheme({
  config,
  styles: {
    global: {
      body: {
        bg: "gray.50",
        color: "gray.800",
      },
      a: {
        textDecoration: "none",
      },
    },
  },
  fonts: {
    heading: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    body: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  radii: {
    xl: "1rem",
    "2xl": "1.25rem",
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 700,
        borderRadius: "xl",
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: "2xl",
          boxShadow: "0 18px 50px rgba(17, 24, 39, .08)",
        },
      },
    },
  },
});
