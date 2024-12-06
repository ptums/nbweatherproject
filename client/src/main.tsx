import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NBWeatherProjectApp } from "./NBWeatherProjectApp";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <NBWeatherProjectApp />
    </QueryClientProvider>
  </StrictMode>
);
