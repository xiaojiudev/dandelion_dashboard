import type { NextApiRequest, NextApiResponse } from "next"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

const handler = async function auth(req: NextApiRequest, res: NextApiResponse) {

    return await NextAuth(req, res, {
        session: {
            strategy: "jwt",
        },
        providers: [
            CredentialsProvider({
                name: "Credentials",
                credentials: {
                    email: { label: "Email", type: "email", placeholder: "admin" },
                    password: { label: "Password", type: "password" }
                },
                async authorize(credentials, req) {
                    const res = await fetch("http://localhost:8080/api/v1/auth/login", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(
                            {
                                email: credentials?.email,
                                password: credentials?.password,
                            }),
                    })

                    const user = await res.json();

                    if (res.ok && user) {
                        return user;
                    }

                    return null;
                }
            })
        ],
        callbacks: {
            async jwt({ token, user, account }) {
                console.log("account", account);

                if (user && 'accessToken' in user) {
                    token.accessToken = user.accessToken;
                }

                return token;
            },
            session({ session, token, user }) {
                session.accessToken = token.accessToken as string;
                console.log("Session", session);
                return session
            },

        },
        pages: {
            signIn: '/login',
            signOut: '/login',
            // error: '/auth/error',
            // verifyRequest: '/auth/verify-request', // (used for check email message)
            // newUser: '/auth/new-user'
        },
        secret: process.env.NEXTAUTH_SECRET
    })
}

export { handler as GET, handler as POST }

