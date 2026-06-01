import type React from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { setupStore } from "@/app/store";
import { theme } from "@/theme";

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState,
    route = "/",
    store = setupStore(preloadedState),
  }: { preloadedState?: any; route?: string; store?: ReturnType<typeof setupStore> } = {}
) {
  return {
    store,
    ...render(
      <ChakraProvider theme={theme}>
        <Provider store={store}>
          <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
        </Provider>
      </ChakraProvider>
    ),
  };
}
