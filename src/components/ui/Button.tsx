import type React from "react";
import { Button as ChakraButton, type ButtonProps as ChakraButtonProps } from "@chakra-ui/react";

type AppButtonVariant = "primary" | "secondary" | "danger" | "ghost";

type ButtonProps = Omit<ChakraButtonProps, "variant"> & {
  variant?: AppButtonVariant;
  children: React.ReactNode;
};

function getVariantProps(variant: AppButtonVariant): Partial<ChakraButtonProps> {
  switch (variant) {
    case "secondary":
      return { colorScheme: "blue", variant: "subtle" };
    case "danger":
      return { colorScheme: "red", variant: "solid" };
    case "ghost":
      return { colorScheme: "gray", variant: "ghost" };
    case "primary":
    default:
      return { colorScheme: "blue", variant: "solid" };
  }
}

export default function Button({ children, variant = "primary", ...props }: ButtonProps) {
  return (
    <ChakraButton size="md" {...getVariantProps(variant)} {...props}>
      {children}
    </ChakraButton>
  );
}
