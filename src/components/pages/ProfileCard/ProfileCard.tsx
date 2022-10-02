import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../core/redux/store";
import defaultProfileImage from "../../../assets/profile.png";
import { Input } from "../../widget";

export interface IProfileCard {
  username: string;
  id: number;
  initialValue?: string;
}

const ProfileCard: React.FC<IProfileCard> = ({
  username,
  id,
  initialValue,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);

  const auth = useSelector((store: RootState) => store);

  const isCurrentUser = id === Number(auth.id);

  let content;

  if (isEditMode) {
    content = (
      <>
        <Input
          label="Change your username"
          id="username"
          initialValue={username}
        />
        <button className="btn btn-primary">Save</button>
        <button className="btn btn-outline-secondary">Cancel</button>
      </>
    );
  } else {
    content = (
      <>
        <h3>{username}</h3>
        {isCurrentUser && !isEditMode && (
          <button
            className="btn btn-outline-success"
            onClick={() => setIsEditMode(true)}
          >
            Edit
          </button>
        )}
      </>
    );
  }

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
      <div className="card-body">{content}</div>
    </div>
  );
};

export default ProfileCard;
