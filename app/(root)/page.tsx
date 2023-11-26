'use client'

import { useSession } from "next-auth/react"
import { Breadcrumb, message, theme } from "antd";
import { useEffect, useState } from "react";


export default function Home() {
    const { data: session, status } = useSession()

    const username = session?.user?.name

    useEffect(() => {
        if (status === 'authenticated') {
            message.success(`Hi ${username}. Welcome back!`);

        }

        return () => {
            message.destroy();
        };
    }, [status, username]);

    const { token: { colorBgContainer }, } = theme.useToken();

    return (

        <>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Overview</Breadcrumb.Item>
                <Breadcrumb.Item>Statistic</Breadcrumb.Item>
            </Breadcrumb>
            <main style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
                Thong ke

            </main>
        </>
    )
}
