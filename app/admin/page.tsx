import { auth, signOut } from "@/auth";
import { isConfiguredAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth();

  if (!isConfiguredAdmin(session?.user?.email)) {
    redirect("/admin/sign-in");
  }

  return (
    <main className="adminPage">
      <section className="panel">
        <span className="pill">🔐 Admin Area</span>
        <h1>Global AI Assistance — Admin Dashboard</h1>
        <p>Authenticated administrator:</p>
        <div className="country">
          <b>{session.user?.email}</b>
          <span>Primary administrator</span>
        </div>

        <h2>Admin controls</h2>
        <div className="grid">
          <article><div className="icon">🚨</div><h3>High Alert</h3><p>Private emergency submissions and safety cases.</p></article>
          <article><div className="icon">🔒</div><h3>Private Share</h3><p>Review only when the user has explicitly permitted it.</p></article>
          <article><div className="icon">📅</div><h3>Daily Advice</h3><p>Create, review and publish admin-approved advice.</p></article>
          <article><div className="icon">👥</div><h3>Users</h3><p>Moderation, abuse prevention and account controls.</p></article>
        </div>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button className="secondary" type="submit">Sign out</button>
        </form>

        <p className="adminNote">
          Admin authorization is checked on the server. Keep AUTH_SECRET, Google OAuth credentials, and ADMIN_EMAIL only in your hosting provider's environment variables.
        </p>
      </section>
    </main>
  );
}
