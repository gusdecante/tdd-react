import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../core/redux/store";
import defaultProfileImage from "../../../assets/profile.png";
import { Input } from "../../widget";

export interface IProfileCard {
  username: string;
  id: number;
}

const ProfileCard: React.FC<IProfileCard> = ({ username, id }) => {
  const [isEditMode, setIsEditMode] = useState(false);

  const auth = useSelector((store: RootState) => store);

  const isCurrentUser = id === Number(auth.id);

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
        <h3>{username}</h3>
        {isCurrentUser && (
          <button
            className="btn btn-outline-success"
            onClick={() => setIsEditMode(true)}
          >
            Edit
          </button>
        )}
        {isEditMode && (
          <>
            <Input label="Change your username" id="username" />
            <button className="btn btn-primary">Save</button>
            <button className="btn btn-outline-secondary">Cancel</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
