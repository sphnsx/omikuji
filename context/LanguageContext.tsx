import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Language } from '../types';
import { getLanguage, setLanguage as persistLanguage } from '../i18n';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getLanguage);

  const setLanguage = useCallback((lang: Language) => {
    persistLanguage(lang);
    setLanguageState(lang);
  }, []);

  useEffect(() => {
    persistLanguage(language);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
