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

                    console.log("User is: " + JSON.stringify(user));


                    if (res.ok && user) {

                        console.log("return user: " + user);
                        
                        return user;
                    }

                    return null;
                }
            })
        ],
        callbacks: {
            async jwt({ token, user }) {
                
                if (user && 'accessToken' in user) {
                    console.log("user in jwt: " + JSON.stringify(user));
                    
                    token.accessToken = user.accessToken;
                }

                return { token };
            },
            session({ session, token, user }) {

                session.user = token as any;

                console.log("session is:", session);
                
                return session
            }
        },
        pages: {
            signIn: '/login/page',
            // signOut: '/login/page',
            // error: '/auth/error',
            // verifyRequest: '/auth/verify-request', // (used for check email message)
            // newUser: '/auth/new-user'
        }
    })
}

export { handler as GET, handler as POST }

