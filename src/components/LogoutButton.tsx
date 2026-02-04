"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg border-2 border-white shadow-md transition-all active:scale-95"
    >
      <LogOut className="w-4 h-4" />
      <span>ログアウト</span>
    </button>
  );
}
