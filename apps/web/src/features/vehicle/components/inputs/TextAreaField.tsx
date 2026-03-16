import React from "react";

interface TextAreaFieldProps {
  label?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  placeholder?: string;
  required?: boolean;
}

export function TextAreaField({
  label,
  name,
  value,
  onChange,
  rows = 5,
  placeholder,
  required = false,
}: TextAreaFieldProps) {
  return (
    <div>
      {label && (
        <label className="block text-sm text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        required={required}
        className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:border-[#00a8e8] resize-none"
      />
    </div>
  );
}
