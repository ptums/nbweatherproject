"use client";
import React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NBWeatherProjectApp } from "../components/NBWeatherProjectApp";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const queryClient = new QueryClient();
const convex = new ConvexReactClient("http://127.0.0.1:3210");

export default function Page() {
  return (
    <ConvexProvider client={convex}>
      <QueryClientProvider client={queryClient}>
        <NBWeatherProjectApp />
      </QueryClientProvider>
    </ConvexProvider>
  );
}
