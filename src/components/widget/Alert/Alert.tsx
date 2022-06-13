import React, { ReactNode } from "react";

interface IAlert {
  type?: "danger" | "success" | "secondary";
  children: ReactNode;
}

export const Alert: React.FC<IAlert> = ({ type = "success", children }) => {
  let classForAlert = `alert alert-${type}`;
  return <div className={classForAlert}>{children}</div>;
};
