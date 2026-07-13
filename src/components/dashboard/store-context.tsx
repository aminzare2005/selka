"use client";

import { createContext, useContext } from "react";

export type DashboardStore = {
  id: string;
  name: string;
  slug: string;
  themeId: string;
  settings: unknown;
  status: string;
  ownerId: string;
};

const StoreContext = createContext<DashboardStore | null>(null);

export function StoreProvider({
  store,
  children,
}: {
  store: DashboardStore | null;
  children: React.ReactNode;
}) {
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useDashboardStore() {
  return useContext(StoreContext);
}

export function useRequiredDashboardStore() {
  const store = useDashboardStore();
  if (!store) {
    throw new Error("Store is required for this page");
  }
  return store;
}
