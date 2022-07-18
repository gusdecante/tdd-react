import { useRef } from "react";
import { useTranslation } from "react-i18next";
import withHover from "../../layout/withHover";
import useHover from "../../../core/hooks/useHover";

const LangSelector = (props: any) => {
  const { i18n } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const on = useHover(ref.current);

  let size = 24;
  if (on) {
    size = 48;
  }
  return (
    <div ref={ref}>
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
    </div>
  );
};

export default withHover(LangSelector);
