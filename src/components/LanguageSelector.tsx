import { useTranslation } from "react-i18next";

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  return (
    <>
      <img
        src="https://countryflagsapi.com/svg/br"
        alt="Brazil flag"
        title="Portuguese"
        height="32px"
        onClick={() => i18n.changeLanguage("pt")}
      />
      <img
        src="https://countryflagsapi.com/svg/gb"
        alt="The United States Of America flag"
        height="32px"
        title="English"
        onClick={() => i18n.changeLanguage("en")}
      />
    </>
  );
};

export default LanguageSelector;
