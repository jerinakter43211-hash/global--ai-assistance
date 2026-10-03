import { ADMIN_EMAIL } from "@/lib/admin";

export default function AdminPage() {
  return (
    <main className="adminPage">
      <section className="panel">
        <span className="pill">🔐 Admin Area</span>
        <h1>Global AI Assistance — Admin Dashboard</h1>
        <p>Admin identity is configured for:</p>
        <div className="country"><b>{ADMIN_EMAIL}</b><span>Primary administrator</span></div>
        <h2>Admin controls</h2>
        <div className="grid">
          <article><div className="icon">🚨</div><h3>High Alert</h3><p>Private emergency submissions and safety cases.</p></article>
          <article><div className="icon">🔒</div><h3>Private Share</h3><p>Review only when the user has explicitly permitted it.</p></article>
          <article><div className="icon">📅</div><h3>Daily Advice</h3><p>Create, review and publish admin-approved advice.</p></article>
          <article><div className="icon">👥</div><h3>Users</h3><p>Moderation, abuse prevention and account controls.</p></article>
        </div>
        <p className="adminNote">Security note: this page is the admin dashboard foundation. Production access must be protected by server-side authentication and MFA; the admin email must remain a server environment variable.</p>
      </section>
    </main>
  );
}
