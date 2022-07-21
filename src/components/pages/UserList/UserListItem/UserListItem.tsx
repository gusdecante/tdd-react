import { UserData } from "../UserList";
import { Link } from "react-router-dom";
import defaultProfileImage from "../../../../assets/profile.png";

type UserListProps = {
  user: UserData;
};

export const UserListItem = ({ user }: UserListProps) => {
  return (
    <li
      className="list-group-item list-group-item-action"
      style={{
        cursor: "pointer",
      }}
    >
      <img
        src={defaultProfileImage}
        alt="profile"
        width="30"
        className="rounded-circle shadow-sm"
      />
      <Link to={`/user/${user.id}`}>{user.username}</Link>
    </li>
  );
};
