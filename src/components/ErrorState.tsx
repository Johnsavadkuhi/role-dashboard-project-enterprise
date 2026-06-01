import { Alert, AlertDescription, AlertIcon, AlertTitle, Box } from "@chakra-ui/react";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

export default function ErrorState({ error, title = "Request failed" }) {
  return (
    <Alert status="error" borderRadius="2xl" alignItems="flex-start">
      <AlertIcon />
      <Box>
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{getApiErrorMessage(error)}</AlertDescription>
      </Box>
    </Alert>
  );
}
