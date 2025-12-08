import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "hb_bookmarks_v1";

const readStorage = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
};

const writeStorage = (ids: string[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(new Set(ids))));
  } catch {}
};

export default function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    setBookmarks(readStorage());
  }, []);

  const isBookmarked = useCallback(
    (id?: string | null) => {
      if (!id) return false;
      return bookmarks.includes(String(id));
    },
    [bookmarks]
  );

  const toggleBookmark = useCallback((id?: string | null) => {
    if (!id) return;
    setBookmarks((prev) => {
      const has = prev.includes(String(id));
      const next = has ? prev.filter((x) => x !== String(id)) : [...prev, String(id)];
      writeStorage(next);
      return next;
    });
  }, []);

  return { bookmarks, isBookmarked, toggleBookmark };
}