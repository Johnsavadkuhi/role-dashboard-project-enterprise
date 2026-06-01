import React from "react";
import { Field, Input as ChakraInput, type InputProps as ChakraInputProps } from "@chakra-ui/react";

type InputProps = ChakraInputProps & {
  label?: string;
  error?: React.ReactNode;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, error, name, id, ...props }, ref) => {
  const inputId = id || String(name || label || "input");
  return (
    <Field.Root invalid={Boolean(error)}>
      {label && <Field.Label htmlFor={inputId}>{label}</Field.Label>}
      <ChakraInput id={inputId} name={name} ref={ref} borderRadius="xl" bg="white" {...props} />
      {error && <Field.ErrorText>{error}</Field.ErrorText>}
    </Field.Root>
  );
});

Input.displayName = "Input";
export default Input;
