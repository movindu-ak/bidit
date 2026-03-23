import React from "react";

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectGroup {
  label: string;
  options: SelectOption[];
}

interface SelectFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options?: SelectOption[];
  groups?: SelectGroup[];
  extraOption?: SelectOption;
  required?: boolean;
  placeholder?: string;
}

export function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  groups,
  extraOption,
  required = false,
  placeholder,
}: SelectFieldProps) {
  return (
    <div>
      <label className="block text-sm text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:border-[#00a8e8] bg-white"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {groups
          ? groups.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map((opt) => (
                  <option key={String(opt.value)} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </optgroup>
            ))
          : options?.map((opt) => (
              <option key={String(opt.value)} value={opt.value}>
                {opt.label}
              </option>
            ))}
        {extraOption && (
          <option value={extraOption.value}>{extraOption.label}</option>
        )}
      </select>
    </div>
  );
}
