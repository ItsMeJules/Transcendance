import React from 'react';

interface InputFieldProps {
  id: string;
  placeholder: string;
  value: string;
  maxLength?: number;
  className?: string;
  onChange: (value: string) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  placeholder,
  value,
  maxLength,
  className,
  onChange,
}) => {
  return (
    <input
      type="text"
      autoComplete="off"
      placeholder={placeholder}
      id={id}
      value={value}
      className={`border ${className || ''}`}
      onChange={(e) => onChange(e.target.value)}
      maxLength={maxLength}
    />
  );
};

export default InputField;