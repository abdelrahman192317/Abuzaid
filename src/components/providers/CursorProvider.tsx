"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CustomCursor } from "@/components/cursor/CustomCursor";

export type CursorMode = "default" | "play" | "drag" | "view";

interface CursorContextValue {
  mode: CursorMode;
  setCursor: (mode: CursorMode) => void;
}

const CursorContext = createContext<CursorContextValue>({
  mode: "default",
  setCursor: () => {},
});

export function useCursor() {
  return useContext(CursorContext);
}

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<CursorMode>("default");
  const setCursor = useCallback((m: CursorMode) => setMode(m), []);
  const value = useMemo(() => ({ mode, setCursor }), [mode, setCursor]);

  return (
    <CursorContext.Provider value={value}>
      {children}
      <CustomCursor mode={mode} />
    </CursorContext.Provider>
  );
}
