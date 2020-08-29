import React, { FC, FormEvent } from 'react';

interface InputProps {
  type: string;
  placeholder: string;
  name: string;
  value: string;
  onChange: (e: FormEvent<HTMLInputElement>) => void,
  error: string;
}

const Input: FC<InputProps> = ({ type = 'text', placeholder, name, value, onChange, error }) => {
  return(
    <div className="mb-5">
      <input
        className={error ? "input is-danger" : "input"} 
        type={type} 
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        autoComplete="off"
      />
      {error && <div className="has-text-danger-dark">{error}</div>}
    </div>
  );
}

export default Input;