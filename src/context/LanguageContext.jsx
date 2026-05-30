"use client";

import React, { createContext, useContext, useCallback } from "react";

// Import English translations only
import en from "@/locales/en.json";

const translations = { en };

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Always English - no language switching
  const language = "en";

  // Translation function with nested key support (e.g., "navbar.home")
  const t = useCallback(
    (key, fallback = "") => {
      const keys = key.split(".");
      let result = translations.en;

      for (const k of keys) {
        if (result && typeof result === "object" && k in result) {
          result = result[k];
        } else {
          return fallback || key;
        }
      }

      return (typeof result === "string" || Array.isArray(result) || (result && typeof result === "object")) ? result : fallback || key;
    },
    []
  );

  const value = {
    language,
    setLanguage: () => {}, // no-op, English only
    t,
    toggleLanguage: () => {}, // no-op, English only
    isLoaded: true,
    isBengali: false,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export default LanguageContext;
