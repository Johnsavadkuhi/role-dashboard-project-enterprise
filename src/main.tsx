import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ChakraProvider } from "@chakra-ui/react";
import App from "@/App";
import { store } from "@/app/store";
import ErrorBoundary from "@/components/ErrorBoundary";
import { startMockWorker } from "@/mocks/startMockWorker";
import { system } from "@/theme";
import "@/styles.css";

async function bootstrap() {
  await startMockWorker();

  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <ChakraProvider value={system}>
        <ErrorBoundary fallbackTitle="Application error">
          <Provider store={store}>
            <BrowserRouter>
              <App />
              <Toaster position="top-right" />
            </BrowserRouter>
          </Provider>
        </ErrorBoundary>
      </ChakraProvider>
    </React.StrictMode>
  );
}

bootstrap();
