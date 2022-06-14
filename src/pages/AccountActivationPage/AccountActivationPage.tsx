import { activate } from "../../core/api/apiCalls";
import { useEffect, useState } from "react";
import { Alert, Spinner } from "../../components";
import { useParams } from "react-router-dom";

export const AccountActivationPage = () => {
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

  let content = (
    <Alert type="secondary" center>
      <Spinner size="big" />
    </Alert>
  );

  if (result === "success") {
    content = <Alert>Account is activated</Alert>;
  } else if (result === "fail") {
    content = <Alert type="danger">Activation failure</Alert>;
  }

  return <div data-testid="activation-page">{content}</div>;
};
