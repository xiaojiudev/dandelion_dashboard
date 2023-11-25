'use client'

import { useSession } from "next-auth/react"
import { message } from "antd";
import { useEffect, useState } from "react";


export default function Home() {
    const { data: session, status } = useSession()

    const [isSuccessMessageShown, setIsSuccessMessageShown] = useState(false);

    useEffect(() => {
        if (session && status === 'authenticated' && !isSuccessMessageShown) {
            message.success('Login successful');
            setIsSuccessMessageShown(true);
        }
    }, [session, status, isSuccessMessageShown]);



    return (
        <main >
            Thong ke

        </main>
    )
}
