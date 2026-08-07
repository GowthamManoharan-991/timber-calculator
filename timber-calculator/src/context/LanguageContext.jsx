import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { resolveTranslation, SUPPORTED_LANGUAGES } from '../i18n/translations';

const LanguageContext = createContext(null);

// Kept consistent with the "timbercalc_" prefix used by localStorageService,
// even though this context reads/writes localStorage directly (language
// preference is a client-only UI setting, not app data that will move to
// the backend).
const LANGUAGE_KEY = 'timbercalc_language';
const DEFAULT_LANGUAGE = 'en';

function getInitialLanguage() {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  const stored = window.localStorage.getItem(LANGUAGE_KEY);
  if (stored && SUPPORTED_LANGUAGES.some((l) => l.code === stored)) return stored;
  return DEFAULT_LANGUAGE;
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getInitialLanguage);

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_KEY, language);
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  const setLanguage = useCallback((code) => {
    if (!SUPPORTED_LANGUAGES.some((l) => l.code === code)) return;
    setLanguageState(code);
  }, []);

  // t('key') -> translated string in the current language.
  const t = useCallback((key) => resolveTranslation(key, language), [language]);

  const value = useMemo(
    () => ({ language, setLanguage, t, languages: SUPPORTED_LANGUAGES }),
    [language, setLanguage, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
