import React from "react";

interface InputFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: "text" | "number" | "email";
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
}

export function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  min,
  max,
}: InputFieldProps) {
  return (
    <div>
      <label className="block text-sm text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        min={min}
        max={max}
        className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:border-[#00a8e8]"
      />
    </div>
  );
}
