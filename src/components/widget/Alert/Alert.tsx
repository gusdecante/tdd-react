interface IAlert {
  type?: "danger" | "success";
  text: string;
}

export const Alert = ({ type = "success", text }: IAlert) => {
  let classForAlert = `alert alert-${type}`;
  return <div className={classForAlert}>{text}</div>;
};
