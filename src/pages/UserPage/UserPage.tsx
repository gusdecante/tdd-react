import { useEffect, useState } from "react";
import { getUsersById } from "../../core/api/apiCalls";
import { useParams } from "react-router-dom";
import { UserData } from "../../components/pages/UserList/UserList";
import { ProfileCard } from "../../components/pages/ProfileCard";

export const UserPage = () => {
  const [user, setUser] = useState<UserData>();
  const { id } = useParams();

  useEffect(() => {
    const handleGetUserById = async () => {
      try {
        const response = await getUsersById(Number(id));
        setUser(response.data);
      } catch (error) {}
    };
    handleGetUserById();
  }, []);

  return (
    <div data-testid="user-page">{user && <ProfileCard user={user} />}</div>
  );
};
