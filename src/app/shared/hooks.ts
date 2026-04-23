import { useRef } from "react";

export function useScrollToRef<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);
  const scrollTo = () => ref.current?.scrollIntoView({ behavior: "smooth" });
  return [ref, scrollTo] as const;
}
