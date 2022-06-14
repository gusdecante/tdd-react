import React, { ReactNode } from "react";

interface IAlert {
  type?: "danger" | "success" | "secondary";
  children: ReactNode;
  center?: boolean;
}

export const Alert: React.FC<IAlert> = ({
  type = "success",
  children,
  center,
}) => {
  let classForAlert = `alert alert-${type}`;
  if (center) {
    classForAlert += " text-center";
  }
  return <div className={classForAlert}>{children}</div>;
};
