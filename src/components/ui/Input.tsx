import React from "react";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input as ChakraInput,
  type InputProps as ChakraInputProps,
} from "@chakra-ui/react";

type InputProps = ChakraInputProps & {
  label?: string;
  error?: React.ReactNode;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, error, name, id, ...props }, ref) => {
  const inputId = id || String(name || label || "input");
  return (
    <FormControl isInvalid={Boolean(error)}>
      {label && <FormLabel htmlFor={inputId}>{label}</FormLabel>}
      <ChakraInput id={inputId} name={name} ref={ref} borderRadius="xl" bg="white" {...props} />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
});

Input.displayName = "Input";
export default Input;
