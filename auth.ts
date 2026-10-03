import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { isConfiguredAdmin } from "@/lib/admin";

const buildSecret =
  process.env.AUTH_SECRET ||
  (process.env.NEXT_PHASE === "phase-production-build"
    ? "global-ai-assistance-build-placeholder-only"
    : undefined);

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: buildSecret,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || "build-placeholder",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "build-placeholder",
    }),
  ],
  pages: {
    signIn: "/admin/sign-in",
  },
  callbacks: {
    async signIn({ user }) {
      return isConfiguredAdmin(user.email);
    },
  },
  trustHost: true,
});
