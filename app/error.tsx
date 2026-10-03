"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="panel">
      <h1>Something went wrong</h1>
      <p>We could not complete that request. Please try again.</p>
      <button className="primary" onClick={() => reset()}>Try again</button>
    </main>
  );
}
