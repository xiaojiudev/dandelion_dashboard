'use client'

import { useSession } from "next-auth/react"
import { message } from "antd";
import { useEffect, useState } from "react";


export default function Home() {
    const { status } = useSession()

    useEffect(() => {
        if (status === 'authenticated') {
            message.success('Login successful');
        }
    }, [status]);


    return (
        <main >
            Thong ke

        </main>
    )
}
