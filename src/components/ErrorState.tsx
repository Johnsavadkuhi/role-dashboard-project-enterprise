import { Alert, Box } from "@chakra-ui/react";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

export default function ErrorState({ error, title = "Request failed" }) {
  return (
    <Alert.Root status="error" borderRadius="2xl" alignItems="flex-start">
      <Alert.Indicator />
      <Alert.Content>
        <Box>
          <Alert.Title>{title}</Alert.Title>
          <Alert.Description>{getApiErrorMessage(error)}</Alert.Description>
        </Box>
      </Alert.Content>
    </Alert.Root>
  );
}
