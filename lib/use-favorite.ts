"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Per-locale favorite, persisted in localStorage (PRD a3-detail-panel). WMM has
 * no auth and no public writes, so favorites are local-only. Read via
 * useSyncExternalStore so it stays SSR-safe and updates same-tab (listeners) and
 * cross-tab (the storage event).
 */

const KEY = "wmm:favorites";
const listeners = new Set<() => void>();

function readFavorites(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function writeFavorites(set: Set<string>): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify([...set]));
  } catch {
    // Storage unavailable (private mode / quota); favorites just don't persist.
  }
  for (const listener of listeners) listener();
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", callback);
  }
  return () => {
    listeners.delete(callback);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", callback);
    }
  };
}

export function useFavorite(slug: string): [boolean, () => void] {
  const favorite = useSyncExternalStore(
    subscribe,
    () => readFavorites().has(slug),
    () => false,
  );

  const toggle = useCallback(() => {
    const set = readFavorites();
    if (set.has(slug)) set.delete(slug);
    else set.add(slug);
    writeFavorites(set);
  }, [slug]);

  return [favorite, toggle];
}
