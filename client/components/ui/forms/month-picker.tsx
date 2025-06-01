import React from "react";
import { months } from "../../utils";

type MonthPickerProps = {
  value: string | number;
  onChange: (value: string) => void;
};

export const MonthPicker: React.FC<MonthPickerProps> = ({
  value,
  onChange,
}) => {
  const stringValue =
    typeof value === "number" ? value.toString().padStart(2, "0") : value;

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="relative">
      <select
        value={stringValue}
        onChange={handleChange}
        className="h-9 items-center justify-between whitespace-nowrap border border-neutral-200 px-3 py-2 text-sm shadow-sm ring-offset-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 dark:border-neutral-800 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus:ring-neutral-300 w-full rounded bg-white"
      >
        <option value="" disabled>
          Enter Month
        </option>
        {months.map((month, index) => (
          <option key={index} value={(index + 1).toString().padStart(2, "0")}>
            {month}
          </option>
        ))}
      </select>
    </div>
  );
};
