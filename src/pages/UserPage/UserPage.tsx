import { useEffect, useState } from "react";
import { getUsersById } from "../../core/api/apiCalls";
import { useParams } from "react-router-dom";
import { UserData } from "../../components/pages/UserList/UserList";
import { ProfileCard } from "../../components/pages/ProfileCard";
import { Alert, Spinner } from "../../components";

export const UserPage = () => {
  const [user, setUser] = useState<UserData>();
  const [pendingApiCall, setPendingApiCall] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const handleGetUserById = async () => {
      setPendingApiCall(true);
      try {
        const response = await getUsersById(Number(id));
        setUser(response.data);
      } catch (error) {}
      setPendingApiCall(false);
    };
    handleGetUserById();
  }, []);

  return (
    <div data-testid="user-page">
      {!pendingApiCall && user && <ProfileCard user={user} />}
      {pendingApiCall && (
        <Alert type="secondary" center>
          <Spinner size="big" />
        </Alert>
      )}
    </div>
  );
};
