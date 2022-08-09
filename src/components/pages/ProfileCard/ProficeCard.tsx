import React, { useContext } from "react";
import { AuthContext } from "../../../core/context/AuthContext";
import defaultProfileImage from "../../../assets/profile.png";
import { UserData } from "../UserList/UserList";

interface IProfileCard {
  user: UserData;
}

const ProfileCard: React.FC<IProfileCard> = ({ user }) => {
  const auth = useContext(AuthContext);

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
      {auth && user.id === Number(auth.id) && <button>Edit</button>}
    </div>
  );
};

export default ProfileCard;
