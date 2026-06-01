import { Heading, Text, VStack } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "@/features/ui/uiSlice";
import type { RootState } from "@/app/store";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function Settings() {
  const dispatch = useDispatch();
  const { theme } = useSelector((state: RootState) => state.ui);

  return (
    <VStack align="stretch" spacing={5}>
      <Heading>Settings</Heading>
      <Card title="Theme State Example">
        <VStack align="start" spacing={3}>
          <Text>Current theme: {theme}</Text>
          <Button variant="secondary" onClick={() => dispatch(setTheme(theme === "light" ? "dark" : "light"))}>Toggle Theme</Button>
        </VStack>
      </Card>
    </VStack>
  );
}
