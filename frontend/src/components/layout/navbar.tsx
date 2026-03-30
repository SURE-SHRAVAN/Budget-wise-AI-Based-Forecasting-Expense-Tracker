import React from "react";

const Navbar = () => {
  const logout = () => {
    localStorage.removeItem("access");
    window.location.href = "/login";
  };

  return (
    <div className="h-14 bg-white shadow flex items-center justify-between px-6">
      <h1 className="font-bold text-lg">FinForecaster</h1>

      <button
        onClick={logout}
        className="bg-red-500 text-white px-3 py-1 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;