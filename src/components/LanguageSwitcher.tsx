import { NativeSelect } from "@chakra-ui/react";
import { useLanguage, type Language } from "@/i18n";

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <NativeSelect.Root maxW="132px" size="sm">
      <NativeSelect.Field
        aria-label={t("common.language")}
        value={language}
        onChange={(event) => setLanguage(event.target.value as Language)}
        bg="white"
        borderRadius="lg"
      >
        <option value="en">{t("languages.en")}</option>
        <option value="fa">{t("languages.fa")}</option>
      </NativeSelect.Field>
      <NativeSelect.Indicator />
    </NativeSelect.Root>
  );
}
