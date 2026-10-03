import Link from "next/link";

export default function NotFound() {
  return (
    <main className="panel">
      <h1>Page not found</h1>
      <p>The page you requested does not exist.</p>
      <Link className="primary linkButton" href="/">Back to home</Link>
    </main>
  );
}
