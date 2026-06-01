import React from "react";
import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Code, HStack, VStack } from "@chakra-ui/react";
import Button from "@/components/ui/Button";

type ErrorBoundaryState = {
  hasError: boolean;
  error?: Error;
};

type ErrorBoundaryProps = {
  children: React.ReactNode;
  fallbackTitle?: string;
};

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("React ErrorBoundary caught an error", error, info);
  }

  reset = () => this.setState({ hasError: false, error: undefined });

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <Box maxW="720px" mx="auto" mt={20} p={6}>
        <Alert status="error" borderRadius="2xl" alignItems="flex-start" boxShadow="lg">
          <AlertIcon />
          <VStack align="stretch" spacing={4} w="full">
            <Box>
              <AlertTitle fontSize="xl">{this.props.fallbackTitle || "Something went wrong"}</AlertTitle>
              <AlertDescription>The page crashed safely instead of breaking the whole app.</AlertDescription>
            </Box>
            {this.state.error?.message && <Code p={3} borderRadius="xl" whiteSpace="pre-wrap">{this.state.error.message}</Code>}
            <HStack flexWrap="wrap">
              <Button onClick={this.reset}>Try again</Button>
              <Button variant="secondary" onClick={() => window.location.assign("/login")}>Go to login</Button>
            </HStack>
          </VStack>
        </Alert>
      </Box>
    );
  }
}
