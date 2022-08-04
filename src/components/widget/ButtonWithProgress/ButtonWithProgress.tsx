import React, { FormEvent, ReactNode } from "react";
import { Spinner } from "../Spinner";

type ButtonWithProgressProps = {
  disabled?: boolean;
  onClick: (event: FormEvent) => Promise<void>;
  apiProgress: boolean;
  children: ReactNode;
};

export const ButtonWithProgress: React.FC<ButtonWithProgressProps> = ({
  disabled,
  onClick,
  apiProgress,
  children,
}) => {
  return (
    <button
      className="btn btn-primary"
      disabled={disabled || apiProgress}
      onClick={onClick}
    >
      {apiProgress && <Spinner />}
      {children}
    </button>
  );
};
