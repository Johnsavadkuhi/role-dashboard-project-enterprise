import type React from "react";
import { Button as ChakraButton, type ButtonProps as ChakraButtonProps } from "@chakra-ui/react";

type AppButtonVariant = "primary" | "secondary" | "danger" | "ghost";

type ButtonProps = Omit<ChakraButtonProps, "variant" | "loading"> & {
  variant?: AppButtonVariant;
  isLoading?: boolean;
  children: React.ReactNode;
};

function getVariantProps(variant: AppButtonVariant): Partial<ChakraButtonProps> {
  switch (variant) {
    case "secondary":
      return { colorPalette: "blue", variant: "subtle" };
    case "danger":
      return { colorPalette: "red", variant: "solid" };
    case "ghost":
      return { colorPalette: "gray", variant: "ghost" };
    case "primary":
    default:
      return { colorPalette: "blue", variant: "solid" };
  }
}

export default function Button({ children, variant = "primary", isLoading, ...props }: ButtonProps) {
  return (
    <ChakraButton size="md" loading={isLoading} {...getVariantProps(variant)} {...props}>
      {children}
    </ChakraButton>
  );
}
