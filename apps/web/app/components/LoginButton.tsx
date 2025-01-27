'use client'

import { signIn } from "next-auth/react"

export default function LoginButton() {
    return (
        <button onClick={async () => await signIn(undefined, { callbackUrl: 'http://localhost:3000/dashboard' })}> login here </button>
    )
}
