import React, { ChangeEvent } from "react";

type InputProps = {
  id: string;
  label: string;
  onChange(event: ChangeEvent<HTMLInputElement>): void;
  help?: string;
};

const Input: React.FC<InputProps> = ({ id, label, onChange, help }) => {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <input id={id} onChange={onChange} className="form-control" />
      <span>{help}</span>
    </div>
  );
};

export default Input;
