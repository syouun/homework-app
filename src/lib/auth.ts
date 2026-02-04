import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    console.log("[DEBUG] Authorize called");
                    if (!credentials?.username || !credentials?.password) {
                        console.log("[DEBUG] Missing credentials");
                        return null;
                    }

                    console.log("[DEBUG] Finding user:", credentials.username);
                    const user = await prisma.user.findUnique({
                        where: { username: credentials.username }
                    });

                    if (!user) {
                        console.log("[DEBUG] User not found in DB");
                        return null;
                    }

                    console.log("[DEBUG] User found:", user.username, "Role:", user.role);
                    console.log("[DEBUG] Verifying password...");
                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                    console.log("[DEBUG] Password valid:", isPasswordValid);

                    if (!isPasswordValid) {
                        console.log("[DEBUG] Password invalid");
                        return null;
                    }

                    console.log("[DEBUG] Login successful");
                    return {
                        id: user.id,
                        name: user.name,
                        username: user.username,
                        role: user.role,
                    };
                } catch (error) {
                    console.error("[DEBUG] Authorize Error:", error);
                    return null;
                }
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as Role;
                session.user.username = token.username as string;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login",
    }
};
