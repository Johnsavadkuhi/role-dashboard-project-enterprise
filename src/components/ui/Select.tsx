import React from "react";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select as ChakraSelect,
  type SelectProps as ChakraSelectProps,
} from "@chakra-ui/react";

type SelectProps = ChakraSelectProps & {
  label?: string;
  error?: React.ReactNode;
  children: React.ReactNode;
};

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ label, error, children, name, id, ...props }, ref) => {
  const selectId = id || String(name || label || "select");
  return (
    <FormControl isInvalid={Boolean(error)}>
      {label && <FormLabel htmlFor={selectId}>{label}</FormLabel>}
      <ChakraSelect id={selectId} name={name} ref={ref} borderRadius="xl" bg="white" {...props}>
        {children}
      </ChakraSelect>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
});

Select.displayName = "Select";
export default Select;
