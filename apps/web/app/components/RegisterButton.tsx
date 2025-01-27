'use client'

import { useRouter } from "next/navigation"

export default function RegisterButton () {

    const router = useRouter();

    const handleRegister = () => {
        router.push('http://localhost:3000/auth/register')
    }

    return(
      <button onClick={handleRegister}> register here </button>
    )
}