interface IAlert {
  type?: "danger" | "success";
  text: string;
}

const Alert = ({ type = "success", text }: IAlert) => {
  let classForAlert = `alert alert-${type}`;
  return <div className={classForAlert}>{text}</div>;
};

export default Alert;
