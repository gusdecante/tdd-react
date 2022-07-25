import defaultProfileImage from "../../../assets/profile.png";
import { UserListProps } from "../UserList/UserListItem/UserListItem";

const ProfileCard = ({ user }: UserListProps) => {
  return (
    <div className="card text-center">
      <div className="card-header">
        <img
          src={defaultProfileImage}
          alt="profile"
          width="200"
          height="200"
          className="rounded-circle shadow"
        />
      </div>
      <div className="card-body">
        <h3>{user.username}</h3>
      </div>
    </div>
  );
};

export default ProfileCard;
