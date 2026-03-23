import { useTranslation } from "react-i18next";

const STORAGE_KEY = "i18nextLng";

type LanguageCode = "en" | "si";

export function LanguageToggle() {
  const { i18n, t } = useTranslation();

  const currentLanguage = (i18n.resolvedLanguage || i18n.language || "en").split("-")[0] as LanguageCode;

  const changeLanguage = async (language: LanguageCode) => {
    await i18n.changeLanguage(language);
    localStorage.setItem(STORAGE_KEY, language);
  };

  return (
    <div className="inline-flex items-center rounded-full border border-white/40 bg-white/10 p-1 text-xs">
      <button
        type="button"
        onClick={() => void changeLanguage("en")}
        className={`px-3 py-1 rounded-full transition-colors ${
          currentLanguage === "en"
            ? "bg-white text-[#00a8e8] font-semibold"
            : "text-white hover:bg-white/20"
        }`}
        aria-pressed={currentLanguage === "en"}
      >
        {t("language.en")}
      </button>
      <button
        type="button"
        onClick={() => void changeLanguage("si")}
        className={`px-3 py-1 rounded-full transition-colors ${
          currentLanguage === "si"
            ? "bg-white text-[#00a8e8] font-semibold"
            : "text-white hover:bg-white/20"
        }`}
        aria-pressed={currentLanguage === "si"}
      >
        {t("language.si")}
      </button>
    </div>
  );
}
