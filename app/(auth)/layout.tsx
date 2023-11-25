'use client'
import Link from 'next/link'
import { ConfigProvider } from 'antd'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react';



import '@/app/globals.css'

import theme from '@/theme/themeConfig'
import StyledComponentsRegistry from '@/lib/AntdRegistry'


export default function SessionLayout({
    children, session
}: {
    children: React.ReactNode,  session: Session | null,
}) {
    return (
        <html lang="en">
            <body className=''>
                <SessionProvider session={session}>
                    <StyledComponentsRegistry >
                        <ConfigProvider theme={{
                            ...theme,
                            components: {
                                Input: {
                                    colorPrimary: '#fce7ef',
                                    algorithm: true,
                                },
                            },
                        }}>
                            <div className='flex flex-row items-stretch h-screen bg-white'>
                                <section className='w-2/6'>
                                    <div className='flex flex-col h-full text-white'>
                                        <Link href="/" prefetch className='absolute z-10 top-10 left-10'>
                                            <span className="self-center text-2xl font-dancing-script font-bold whitespace-nowrap tracking-wide">Dandelion</span>
                                        </Link>
                                        <video playsInline className="flex w-full h-full object-cover" autoPlay poster='/thumbnail1.png' loop muted src="/signin.mp4">
                                        </video>

                                        <a className="absolute bottom-10 left-10 z-10" href="https://www.facebook.com/pugongying999">
                                            @xiaojiu
                                        </a>
                                    </div>
                                </section>
                                <section className='flex-1'>
                                    <main className="flex items-center justify-center relative h-full w-full m-0 p-0 bg-white">
                                        {children}
                                    </main>
                                </section>
                            </div>
                        </ConfigProvider>
                    </StyledComponentsRegistry>
                </SessionProvider>
            </body>
        </html>
    )
}
