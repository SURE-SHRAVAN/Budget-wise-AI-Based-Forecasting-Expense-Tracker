import React from "react";
import Navbar from "./navbar";
import Sidebar from "./sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>

      <Navbar />

      <div className="flex">

        <Sidebar />

        <main className="flex-1 p-6 bg-gray-50">
          {children}
        </main>

      </div>

    </div>
  );
};

export default Layout;