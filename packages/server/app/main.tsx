import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Router from "./Router.tsx";

import "./tailwind.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

const queryClient = new QueryClient();
axios.defaults.baseURL = "/api";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Providers>
        <Router />
      </Providers>
    </QueryClientProvider>
  </StrictMode>
);

function Providers(props: { children: React.ReactNode }) {
  return <>{props.children}</>;
}
