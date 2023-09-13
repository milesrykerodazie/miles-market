import { UserType } from "@prisma/client";
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      role: UserType;
    } & DefaultSession;
  }

  interface User extends DefaultUser {
    role: UserType;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: UserType;
  }
}
