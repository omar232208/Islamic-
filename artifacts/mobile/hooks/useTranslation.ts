import { useApp } from '@/context/AppContext';
import { translations, TranslationKey } from '@/constants/i18n';

export function useTranslation() {
  const { language } = useApp();
  const t = (key: TranslationKey): string => translations[language]?.[key] ?? String(key);
  const isRTL = language === 'ar';
  return { t, language, isRTL };
}
