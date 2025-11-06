import React from "react";
interface inputProps {
   label: string;
   type?: string;
   placeholder: string;
   value?: string | number;
   onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
   required?: boolean;
}

const InputBox = ({ label, type = "text", placeholder, value, onChange, required = false } : inputProps) => {
  return (
    <div className="mb-3">
      <label className="form-label">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <input
        type={type}
        className="form-control"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};

export default InputBox;
