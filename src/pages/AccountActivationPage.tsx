import { activate } from "../core/api/apiCalls";
import { useEffect, useState } from "react";
import Alert from "../components/Alert";
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
    content = <Alert text="Account is activated" />;
  } else if (result === "fail") {
    content = <Alert type="danger" text="Activation failure" />;
  }

  return <div data-testid="activation-page">{content}</div>;
};

export default AccountActivationPage;
