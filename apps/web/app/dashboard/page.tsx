'use client'

import { signOut } from "next-auth/react"

export default function dashboard() {
    return (
        <div>
            hello, this is a dashboard page
            <br />
            <button onClick={() => { signOut({ callbackUrl: 'http://localhost:3000' }) }}> logout </button>
        </div>
    )
}