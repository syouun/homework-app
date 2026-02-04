import { DefaultSession } from "next-auth";
import { Role } from "@prisma/client";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            username: string;
            role: Role;
            name?: string | null;
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        username: string;
        role: Role;
        name?: string | null;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: Role;
        username: string;
    }
}
