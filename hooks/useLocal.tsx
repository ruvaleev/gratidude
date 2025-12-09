import i18n from "@/i18n";
import { useAppSelector } from "@/store/hooks";
import { useEffect } from "react";

function useLocale() {
  const savedLocale = useAppSelector((state) => state.locale?.locale);

  useEffect(() => {
    if (savedLocale) {
      i18n.changeLanguage(savedLocale);
    }
  }, [savedLocale]);
}

export default useLocale;
