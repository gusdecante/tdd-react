import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../core/redux/store";
import defaultProfileImage from "../../../assets/profile.png";
import { ButtonWithProgress, Input } from "../../widget";
import { updateUser } from "../../../core/api/apiCalls";

export interface IProfileCard {
  username: string;
  id: number;
}

const ProfileCard: React.FC<IProfileCard> = (props) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [apiProgress, setApiProgress] = useState(false);
  const [newUsername, setNewUsername] = useState<string>(props.username);

  const { id, header } = useSelector((store: RootState) => ({
    id: store.id,
    header: store.header,
  }));

  const isCurrentUser = props.id === Number(id);

  const onClickSave = async () => {
    setApiProgress(true);
    try {
      await updateUser(props.id, { username: newUsername }, header as string);
    } catch (error) {}
    setApiProgress(false);
  };

  let content;

  if (isEditMode) {
    content = (
      <>
        <Input
          label="Change your username"
          id="username"
          initialValue={props.username}
          onChange={(event) => setNewUsername(event.target.value)}
        />
        <ButtonWithProgress apiProgress={apiProgress} onClick={onClickSave}>
          Save
        </ButtonWithProgress>
        <button className="btn btn-outline-secondary">Cancel</button>
      </>
    );
  } else {
    content = (
      <>
        <h3>{props.username}</h3>
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
