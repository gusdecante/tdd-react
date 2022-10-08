import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { onLoginSuccess, RootState } from "../../../core/redux/store";
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

  const dispatch = useDispatch();

  const auth = useSelector((store: RootState) => ({
    id: store.id,
    header: store.header,
    username: store.username,
    ...store,
  }));

  const isCurrentUser = props.id === Number(auth.id);

  const onClickSave = async () => {
    setApiProgress(true);
    try {
      await updateUser(
        props.id,
        { username: newUsername },
        auth.header as string
      );
      setIsEditMode(false);
      dispatch(
        onLoginSuccess({
          ...auth,
          username: newUsername,
        })
      );
    } catch (error) {}
    setApiProgress(false);
  };

  const onClickCancel = () => {
    setIsEditMode(false);
    setNewUsername(auth.username as string);
  };

  let content;

  if (isEditMode) {
    content = (
      <>
        <Input
          label="Change your username"
          id="username"
          initialValue={newUsername}
          onChange={(event) => setNewUsername(event.target.value)}
        />
        <ButtonWithProgress apiProgress={apiProgress} onClick={onClickSave}>
          Save
        </ButtonWithProgress>
        <button className="btn btn-outline-secondary" onClick={onClickCancel}>
          Cancel
        </button>
      </>
    );
  } else {
    content = (
      <>
        <h3>{newUsername}</h3>
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
