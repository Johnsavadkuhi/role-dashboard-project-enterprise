import { Center, HStack, Spinner, Text } from "@chakra-ui/react";

export default function LoadingScreen({ text = "Loading..." }) {
  return (
    <Center bg="white" border="1px solid" borderColor="gray.200" borderRadius="2xl" p={8} boxShadow="sm">
      <HStack>
        <Spinner />
        <Text fontWeight="700">{text}</Text>
      </HStack>
    </Center>
  );
}
