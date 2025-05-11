import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "next-themes";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AppProvider } from "./context/app-context";

// Use the fixed AppProvider that won't throw errors
createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class">
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <App />
        <Toaster />
      </AppProvider>
    </QueryClientProvider>
  </ThemeProvider>
);