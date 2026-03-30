import React from "react";

interface Props {
  title: string;
  value: number;
}

const StatCard: React.FC<Props> = ({ title, value }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold">${value}</h2>
    </div>
  );
};

export default StatCard;