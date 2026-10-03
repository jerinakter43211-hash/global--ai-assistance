"use client";

import { useState } from "react";

const features = [
  ["💬", "সমস্যার সমাধান", "দৈনন্দিন সমস্যায় AI-এর ধাপে ধাপে নির্দেশনা", "help"],
  ["🚨", "High Alert", "জরুরি অবস্থায় নিরাপদ পরবর্তী পদক্ষেপ ও স্থানীয় সেবার পথ", "alert"],
  ["🎓", "Student Hub", "প্রশ্ন লিখে বা পরে ছবি-ভিত্তিক সহায়তার জন্য প্রস্তুত", "student"],
  ["💼", "Jobs & Career", "CV, interview ও ক্যারিয়ার প্রস্তুতি", "help"],
  ["🧠", "Skills Learning", "ফ্রিল্যান্সিং, ডিজিটাল মার্কেটিং ও অন্যান্য স্কিল", "skills"],
  ["🔒", "Private Share", "ব্যক্তিগত লেখা পাবলিক ফিডে প্রকাশ না করার ফ্লো", "private"],
  ["🌍", "Global", "দেশ ও ভাষাভিত্তিক সহায়তার ভিত্তি", "help"],
  ["📅", "Daily Advice", "অ্যাডমিন অনুমোদনের পর প্রকাশযোগ্য পরামর্শ", "help"],
];

export default function Home() {
  const [tab, setTab] = useState("home");
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function askAI() {
    if (!message.trim() || loading) return;
    setLoading(true);
    setError("");
    setAnswer("");
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, language: "bn", category: "general" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "AI request failed");
      setAnswer(data.answer);
    } catch (e) {
      setError(e instanceof Error ? e.message : "অনুরোধটি সম্পন্ন হয়নি।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <header>
        <button className="brand brandButton" onClick={() => setTab("home")}>🌍 <span>Global AI Assistance</span></button>
        <nav>
          <button onClick={() => setTab("home")}>হোম</button>
          <button onClick={() => setTab("help")}>সহায়তা</button>
          <button onClick={() => setTab("student")}>শিক্ষার্থী</button>
          <button onClick={() => setTab("skills")}>স্কিল</button>
        </nav>
        <a className="outline" href="/privacy">🔒 Privacy</a>
      </header>

      {tab === "alert" ? (
        <section className="panel alert">
          <span className="pill">🚨 High Alert</span>
          <h2>জরুরি সহায়তা</h2>
          <p>তাৎক্ষণিক বিপদে আগে স্থানীয় সরকারি জরুরি সেবায় যোগাযোগ করুন। এই ডেমো নিজে থেকে পুলিশ, ফায়ার, অ্যাম্বুলেন্স বা অন্য কর্তৃপক্ষকে যোগাযোগ করে না।</p>
          <div className="country"><b>🇧🇩 বাংলাদেশ</b><strong>999</strong><span>পুলিশ • ফায়ার • অ্যাম্বুলেন্স</span></div>
          <p className="adminNote">ভবিষ্যতে verified country directory যুক্ত হলে দেশ অনুযায়ী সেবা দেখানো হবে। লোকেশন শেয়ারিং আলাদা সম্মতি নিয়ে যুক্ত করা হবে।</p>
        </section>
      ) : tab === "private" ? (
        <section className="panel">
          <span className="pill">🔒 Private Share</span>
          <h2>শুধু নিজের কথা বলুন</h2>
          <p>এই জায়গার লেখা পাবলিক ফিডে প্রকাশ করা হবে না। তবে persistent private storage এখনো production database-এর সঙ্গে সংযুক্ত হয়নি—তাই এই সংস্করণে লেখা সংরক্ষণের ভান করা হচ্ছে না।</p>
          <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="আপনি কী বলতে চান লিখুন..." />
          <button className="secondary" onClick={() => setMessage("")}>মুছে ফেলুন</button>
        </section>
      ) : (
        <>
          <section className="hero">
            <div>
              <span className="pill">সবার জন্য • AI সহায়তা • Global-ready foundation</span>
              <h1>আপনার সমস্যা বলুন।<br /><em>সমাধানের পথ খুঁজে নিন।</em></h1>
              <p>দৈনন্দিন জীবন, শিক্ষা, দক্ষতা, ক্যারিয়ার এবং জরুরি সহায়তার জন্য এক জায়গায় সহজ AI সহায়তা।</p>
              <div className="actions">
                <button className="primary" onClick={() => setTab("help")}>✨ সাহায্য চাই</button>
                <button className="danger" onClick={() => setTab("alert")}>🚨 জরুরি সহায়তা</button>
                <button className="secondary" onClick={() => setTab("private")}>🔒 শুধু নিজের কথা বলুন</button>
              </div>
            </div>
            <div className="heroCard">
              <div className="orb">✦</div>
              <b>AI Assistance</b>
              <span>সার্ভার-side API দিয়ে AI উত্তর</span>
              <div className="mini">🔐 Secret key browser-এ পাঠানো হয় না</div>
            </div>
          </section>

          <section className="panel aiPanel">
            <span className="pill">✨ AI Help</span>
            <h2>আপনার সমস্যা লিখুন</h2>
            <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="যেমন: আমি একটি CV বানাতে চাই, কোথা থেকে শুরু করব?" />
            <button className="primary" onClick={askAI} disabled={loading || !message.trim()}>
              {loading ? "AI উত্তর তৈরি করছে..." : "AI-এর কাছে জিজ্ঞেস করুন"}
            </button>
            {error && <p className="errorText">{error}</p>}
            {answer && <div className="answer"><h3>AI উত্তর</h3><p>{answer}</p></div>}
          </section>

          <section className="features">
            <div className="sectionHead"><span>এক প্ল্যাটফর্মে</span><h2>মানুষের প্রয়োজনের গুরুত্বপূর্ণ জায়গাগুলো</h2></div>
            <div className="grid">
              {features.map(([icon, title, desc, target]) => (
                <article key={title} onClick={() => setTab(target)}>
                  <div className="icon">{icon}</div><h3>{title}</h3><p>{desc}</p><span>→</span>
                </article>
              ))}
            </div>
          </section>
        </>
      )}

      <section className="trust">
        <div><b>Server-side AI</b><span>API key browser-এ প্রকাশ করা হয় না</span></div>
        <div><b>Safety-first</b><span>জরুরি অবস্থায় বাস্তব সেবার পথ দেখানো হবে</span></div>
        <div><b>Privacy-aware</b><span>অসম্পূর্ণ storage flow-কে সম্পূর্ণ বলে দেখানো হয় না</span></div>
        <div><b>Admin control</b><span>Admin area server-side authentication ব্যবহার করে</span></div>
      </section>
      <footer>© 2026 Global AI Assistance · <a href="/privacy">Privacy & Safety</a></footer>
    </main>
  );
}
