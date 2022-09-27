import { useEffect, useState } from "react";
import { getUsersById } from "../../core/api/apiCalls";
import { useParams } from "react-router-dom";
import { UserData } from "../../components/pages/UserList/UserList";
import { ProfileCard } from "../../components/pages/ProfileCard";
import { Alert, Spinner } from "../../components";

export const UserPage = () => {
  const [user, setUser] = useState<UserData>();
  const [pendingApiCall, setPendingApiCall] = useState(false);
  const [failResponse, setFailResponse] = useState<string>();
  const { id } = useParams();

  useEffect(() => {
    const handleGetUserById = async () => {
      setPendingApiCall(true);
      try {
        const response = await getUsersById(Number(id));
        setUser(response.data);
      } catch (error: any) {
        setFailResponse(error.response.data.message);
      }
      setPendingApiCall(false);
    };
    handleGetUserById();
  }, []);

  let content = (
    <Alert type="secondary" center>
      <Spinner size="big" />
    </Alert>
  );

  if (!pendingApiCall) {
    if (failResponse) {
      content = (
        <Alert type="danger" center>
          {failResponse}
        </Alert>
      );
    } else {
      if (user) content = <ProfileCard {...user} />;
    }
  }

  return <div data-testid="user-page">{content}</div>;
};
