import React from "react";

type YearInputProps = {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
};

export const YearInput: React.FC<YearInputProps> = ({
  value,
  onChange,
  min,
  max,
}) => {
  return (
    <input
      type="number"
      value={value.toString() === "" ? "" : value}
      onChange={(e: { target: { value: string } }) => {
        const newValue =
          e.target.value === "" ? "" : parseInt(e.target.value, 10);
        onChange(newValue as number);
      }}
      min={min}
      max={max}
      placeholder="Enter Year"
      className="basic-inputs"
      onBlur={() => {
        if (value.toString() === "") {
          onChange(min);
        } else if (typeof value === "number" && value < min) {
          onChange(min);
        } else if (typeof value === "number" && value > max) {
          onChange(max);
        }
      }}
    />
  );
};
