import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-56 bg-gray-100 min-h-screen p-4 space-y-4">

      <Link to="/home" className="block">Home</Link>

      <Link to="/dashboard" className="block">Dashboard</Link>

      <Link to="/finance" className="block">Finance</Link>

      <Link to="/forecast" className="block">Forecast</Link>

      <Link to="/profile" className="block">Profile</Link>

    </div>
  );
};

export default Sidebar;