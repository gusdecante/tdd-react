import { activate } from "../core/api/apiCalls";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AccountActivationPage = () => {
  const [result, setResult] = useState<string>();
  const { token } = useParams();
  useEffect(() => {
    setResult(undefined);
    activate(token as string)
      .then(() => {
        setResult("success");
      })
      .catch(() => {
        setResult("fail");
      });
  }, [token]);

  let content = <span className="spinner-border" role="status" />;

  if (result === "success") {
    content = (
      <div className="alert alert-success mt-3">Account is activated</div>
    );
  } else if (result === "fail") {
    content = <div className="alert alert-danger mt-3">Activation failure</div>;
  }

  return <div data-testid="activation-page">{content}</div>;
};

export default AccountActivationPage;
