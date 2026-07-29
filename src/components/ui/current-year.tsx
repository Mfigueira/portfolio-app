"use client";

import { useSyncExternalStore } from "react";

// The value never changes within a session, so there is nothing to subscribe to.
const subscribe = () => () => {};
const getCurrentYear = () => new Date().getFullYear();

/**
 * The page is statically prerendered, so a year computed on the server freezes
 * at build time and goes stale each January until the next deploy.
 *
 * `useSyncExternalStore` is the right tool here rather than an effect: it is
 * built for values that legitimately differ between server and client. The
 * build-time year is used for the server render and for hydration — so the
 * markup is never empty and there is no mismatch — and React swaps in the real
 * year once hydration completes.
 */
export function CurrentYear({ fallback }: { fallback: number }) {
  return useSyncExternalStore(subscribe, getCurrentYear, () => fallback);
}
