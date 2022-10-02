import React, { ChangeEvent } from "react";

type InputProps = {
  id?: string;
  label?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  help?: string;
  type?: string;
  initialValue?: string;
};

export const Input: React.FC<InputProps> = ({
  id,
  label,
  onChange,
  help,
  type = "text",
  initialValue,
}) => {
  let inputClass = "form-control";
  if (help) {
    inputClass += " is-invalid";
  }

  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <input
        id={id}
        onChange={onChange}
        className={inputClass}
        type={type}
        defaultValue={initialValue}
      />
      <span data-testid="help-message" className="invalid-feedback">
        {help}
      </span>
    </div>
  );
};
