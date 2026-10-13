import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";

import "./style.css";
import "./i18n";
import { router } from "./routes";
import { queryClient } from "./lib/query-client";
import { captureAttribution } from "./utils/attribution";

// Initialize and capture visitor attribution (Snap, Instagram, Facebook, TikTok, UTMs)
captureAttribution();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);