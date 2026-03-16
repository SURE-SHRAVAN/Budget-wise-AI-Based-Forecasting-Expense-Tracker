import React from "react";
import { LogOut, Wallet } from "lucide-react";

interface User {
  name: string;
  email: string;
}

interface Props {
  children: React.ReactNode;
  onLogout: () => void;
}

const Layout: React.FC<Props> = ({ children, onLogout }) => {
  const storedUser = localStorage.getItem("user");
  const user: User | null = storedUser ? JSON.parse(storedUser) : null;

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Wallet size={20} />
          <span className="font-bold">FinForecaster</span>
        </div>

        {user && (
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="font-semibold">{user.name}</div>
              <div className="text-xs text-zinc-400">{user.email}</div>
            </div>

            <button
              onClick={onLogout}
              className="bg-zinc-100 px-4 py-2 rounded-xl hover:bg-red-100"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </nav>

      <main className="p-6">{children}</main>
    </div>
  );
};

export default Layout;