"use client";

import { useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "ahlgrens-cookie-consent";
const CHANGE_EVENT = "cookie-consent-change";
const OPEN_EVENT = "cookie-consent-open";

function subscribe(callback) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

// null = not hydrated yet, "" = hydrated but no choice made
function getServerSnapshot() {
  return null;
}

export function useCookieConsent() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const consent = useMemo(() => {
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, [raw]);

  return { ready: raw !== null, consent };
}

export function saveConsent({ maps }) {
  const record = {
    functional: true,
    maps: Boolean(maps),
    savedAt: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Storage blocked: the banner will simply ask again next visit
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export const COOKIE_OPEN_EVENT = OPEN_EVENT;