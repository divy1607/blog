'use client'

import { useRouter } from "next/navigation"

export default function DashboardPage () {
    const router = useRouter();

    return(
        <button onClick={() => {router.push('/blog')}}> See All Blogs </button>
    );
}