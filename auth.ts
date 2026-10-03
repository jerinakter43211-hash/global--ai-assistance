import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { isConfiguredAdmin } from "@/lib/admin";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  pages: {
    signIn: "/admin/sign-in",
  },
  callbacks: {
    async signIn({ user }) {
      return isConfiguredAdmin(user.email);
    },
    async authorized({ auth, request }) {
      if (!request.nextUrl.pathname.startsWith("/admin")) return true;
      if (request.nextUrl.pathname === "/admin/sign-in") return true;
      return isConfiguredAdmin(auth?.user?.email);
    },
  },
  trustHost: true,
});
