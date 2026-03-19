"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { QueryProvider } from "./query-provider";
import { store } from "@/lib/store";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <QueryProvider>{children}</QueryProvider>
    </Provider>
  );
}
