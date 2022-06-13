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
    <Alert type="secondary">
      <Spinner size="big" />
    </Alert>
  );

  // if (result === "success") {
  //   content = <Alert text="Account is activated" />;
  // } else if (result === "fail") {
  //   content = <Alert type="danger" text="Activation failure" />;
  // }

  return <div data-testid="activation-page">{content}</div>;
};
