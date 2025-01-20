'use client'

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleRegister = () => {
    return router.push("http://localhost:3000/auth/register")
  }

  return (
    <div>
      <button onClick={async () => await signIn(undefined, { callbackUrl: 'http://localhost:3000/dashboard' })}> login here </button>
      <button onClick={handleRegister}> register here </button>
    </div>
  );
}
