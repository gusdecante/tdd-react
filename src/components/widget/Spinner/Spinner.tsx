interface ISpinner {
  size?: "big";
}

export const Spinner = ({ size }: ISpinner) => {
  let spanClass = "spinner-border";
  if (size !== "big") {
    spanClass += " spinner-border-sm";
  }
  return <span className={spanClass} role="status" />;
};
