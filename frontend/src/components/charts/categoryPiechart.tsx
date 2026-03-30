import React from "react";
import { PieChart, Pie, Cell } from "recharts";

const CategoryPieChart = ({ data }: any) => {

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

  return (
    <PieChart width={400} height={300}>
      <Pie data={data} dataKey="value" outerRadius={100}>
        {data.map((entry: any, index: number) => (
          <Cell key={index} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
  );
};

export default CategoryPieChart;