import { signIn } from "@/auth";

export default function AdminSignInPage() {
  return (
    <main className="adminPage">
      <section className="panel">
        <span className="pill">🔐 Secure Admin Login</span>
        <h1>Global AI Assistance</h1>
        <p>Admin access is restricted to the configured administrator account.</p>
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/admin" });
          }}
        >
          <button className="primary" type="submit">Continue with Google</button>
        </form>
        <p className="adminNote">
          আপনার Google account-এর verified email server-side-এ অনুমোদিত Admin email-এর সঙ্গে মিললেই access দেওয়া হবে।
        </p>
      </section>
    </main>
  );
}
