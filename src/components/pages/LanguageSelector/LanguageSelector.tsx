import { useTranslation } from "react-i18next";
import withHover from "../../layout/withHover";

const LangSelector = (props: any) => {
  const { i18n } = useTranslation();

  let size = 24;
  if (props.on) {
    size = 48;
  }
  return (
    <>
      <img
        src="https://countryflagsapi.com/svg/br"
        alt="Brazil flag"
        title="Portuguese"
        height={`${size}px`}
        onClick={() => i18n.changeLanguage("pt")}
      />
      <img
        src="https://countryflagsapi.com/svg/gb"
        alt="The United States Of America flag"
        height={`${size}px`}
        title="English"
        onClick={() => i18n.changeLanguage("en")}
      />
    </>
  );
};

export default withHover(LangSelector);
