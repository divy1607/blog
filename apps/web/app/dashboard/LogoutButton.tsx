"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ 
        callbackUrl: 'http://localhost:3000' 
      })}
      className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
    >
      Logout
    </button>
  );
}