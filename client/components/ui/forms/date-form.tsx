import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { MonthPicker } from "./month-picker";
import { YearInput } from "./year-input";
import { defaultMonth, defaultYear } from "../../utils";

const schema = yup.object().shape({
  month: yup
    .mixed()
    .test(
      "is-valid-month",
      'Month must be a number from 1 to 12 or a two-digit string from "01" to "12"',
      (value) => {
        if (typeof value === "string") {
          return /^(0[1-9]|1[0-2])$/.test(value);
        }
        if (typeof value === "number") {
          return value >= 1 && value <= 12;
        }
        return false;
      }
    )
    .required("Month is required"),
  year: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required("Year is required")
    .min(1850, "Year must be 1850 or later")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
});

type FormData = yup.InferType<typeof schema>;

interface DateForm {
  handleSearch: (query: string) => void;
}

export function DateForm({ handleSearch }: DateForm) {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      month: defaultMonth,
      year: defaultYear,
    },
  });

  const onSubmit = (data: FormData) => {
    const dateQuery = `${data.month as string}-${
      data.year.toString() as string
    }`;

    handleSearch(dateQuery);
  };

  return (
    <div className="w-full sm:w-3/4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col sm:flex-row items-center gap-4"
      >
        <div className="w-full sm:w-44">
          <MonthPicker
            value={month || defaultMonth}
            onChange={(value) => {
              setMonth(value);
              setValue("month", value, { shouldValidate: true });
            }}
          />
          {errors.month && (
            <p className="text-red-500 text-sm mt-1">{errors.month.message}</p>
          )}
        </div>
        <div className="w-full sm:w-32">
          <YearInput
            value={parseInt(year) || defaultYear}
            onChange={(value) => {
              setYear(value.toString());
              setValue("year", value, { shouldValidate: true });
            }}
            min={1940}
            max={new Date().getFullYear()}
          />
          {errors.year && (
            <p className="text-red-500 text-sm mt-1">{errors.year.message}</p>
          )}
        </div>
        <button className="underline">Search</button>
      </form>
    </div>
  );
}
