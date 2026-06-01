import type React from "react";
import { describe, expect, it, vi } from "vitest";
import { screen, render } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { system } from "@/theme";

function BrokenComponent(): React.JSX.Element {
  throw new Error("Crash for test");
}

describe("ErrorBoundary", () => {
  it("renders fallback UI instead of crashing the whole app", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <ChakraProvider value={system}>
        <ErrorBoundary>
          <BrokenComponent />
        </ErrorBoundary>
      </ChakraProvider>
    );
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Crash for test")).toBeInTheDocument();
    spy.mockRestore();
  });
});
