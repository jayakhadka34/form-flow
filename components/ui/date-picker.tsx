'use client'

import * as React from "react";

interface DatePickerProps {
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, placeholder }) => {
  return (
    <input
      type="date"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange?.(e.target.value)}
      className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
    />
  );
};
