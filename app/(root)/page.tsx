'use client'

import { useSession } from "next-auth/react"
import { message } from "antd";
import { useEffect, useState } from "react";


export default function Home() {
    const { data: session, status } = useSession()

    const username = session?.user?.name
    

    useEffect(() => {
        if (status === 'authenticated') {
            message.success(`Hi ${username}. Welcome back!`);
        }
    }, [status]);


    return (
        <main >
            Thong ke

        </main>
    )
}
