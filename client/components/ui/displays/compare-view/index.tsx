import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatCompareWeatherData, getMonthName } from "../../../utils";
import { CompareWeatherData } from "../../../utils/types";

interface CompareView {
  compareList: CompareWeatherData[];
}
export const CompareView = ({ compareList }: CompareView) => {
  // Prepare data for the chart
  const chartData = formatCompareWeatherData(compareList);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis unit="°F" />
        <Tooltip />
        <Legend />
        {compareList.map((data, index) => {
          const monthName = getMonthName(data.month);
          const year = data.year;
          const key = `${monthName}${year}`;
          return (
            <Bar
              key={data.id}
              dataKey={`${key}Avg`}
              name={`${monthName} ${year}`}
              fill={`hsl(${index * 60}, 70%, 50%)`}
            />
          );
        })}
      </BarChart>
    </ResponsiveContainer>
  );
};
