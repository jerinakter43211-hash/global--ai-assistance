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
  ["📈", "Trading Signals", "Forex ও Crypto-র জন্য safety-first market setup", "trading"],
];

function TradingPanel() {
  const [mode, setMode] = useState("expert");
  const [market, setMarket] = useState("crypto");
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [interval, setInterval] = useState("5m");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const symbols = market === "crypto" ? ["BTCUSDT","ETHUSDT","BNBUSDT","SOLUSDT"] : ["EURUSD","GBPUSD","USDJPY","XAUUSD"];
  async function loadSignal() {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/trading/signal?market="+market+"&symbol="+symbol+"&interval="+interval+"&mode="+mode, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Signal পাওয়া যায়নি");
      setData(json);
    } catch (e) { setError(e instanceof Error ? e.message : "অনুরোধ ব্যর্থ হয়েছে"); }
    finally { setLoading(false); }
  }
  return <section className="panel tradingPanel">
    <span className="pill">🎯 ExpertOption Signal Mode</span>
    <h2>ExpertOption-এর জন্য CALL / PUT Signal</h2>
    <p>সিগন্যালটি বাজারের public candle data বিশ্লেষণ করে। ExpertOption-এর নিজস্ব quote/OTC feed আলাদা হলে ফল ভিন্ন হতে পারে। কোনো signal-ই নিশ্চিত লাভ বা zero-loss নিশ্চিত করে না।</p>
    <div className="signalControls">
      <select value={market} onChange={e => {setMarket(e.target.value); setSymbol(e.target.value === "crypto" ? "BTCUSDT" : "EURUSD"); setData(null);}}>
        <option value="crypto">Crypto</option><option value="forex">Forex</option>
      </select>
      <select value={symbol} onChange={e => setSymbol(e.target.value)}>{symbols.map(s => <option key={s}>{s}</option>)}</select>
      <select value={interval} onChange={e => {setInterval(e.target.value); setData(null);}}>
        <option value="1m">1 মিনিট</option><option value="5m">5 মিনিট</option><option value="15m">15 মিনিট</option>
      </select>
      <button className="primary" onClick={loadSignal} disabled={loading}>{loading ? "বিশ্লেষণ হচ্ছে..." : "Signal দেখুন"}</button>
    </div>
    {error && <p className="errorText">{error}</p>}
    {data && <div className="signalCard">
      <div className={"signalAction "+(data.action === "CALL" ? "callAction" : data.action === "PUT" ? "putAction" : "noTradeAction")}>{data.action}</div>
      <div className="signalGrid">
        <div><span>Asset</span><b>{data.symbol}</b></div>
        <div><span>Current price</span><b>{data.price ?? "—"}</b></div>
        <div><span>Setup score</span><b>{data.setupScore != null ? data.setupScore+"/100" : "—"}</b></div>
        <div><span>Chart</span><b>{data.timeframe ?? interval}</b></div>
        <div><span>Suggested expiry</span><b>{data.expiry ?? "—"}</b></div>
        <div><span>RSI</span><b>{data.rsi ?? "—"}</b></div>
      </div>
      <p><b>কারণ:</b> {data.reason}</p>
      <div className="safetyBox">⚠️ Signal পাওয়ার পরও নিজে chart মিলিয়ে নিন। একবারে অল্প অর্থ ব্যবহার করুন, ধারাবাহিক loss হলে থামুন এবং signal পরিষ্কার না হলে NO TRADE নিন।</div>
    </div>}
  </section>;
}


  const [market, setMarket] = useState("crypto");
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const symbols = market === "crypto" ? ["BTCUSDT","ETHUSDT","BNBUSDT","SOLUSDT"] : ["EURUSD","GBPUSD","USDJPY","XAUUSD"];
  async function loadSignal() {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/trading/signal?market="+market+"&symbol="+symbol, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Signal পাওয়া যায়নি");
      setData(json);
    } catch (e) { setError(e instanceof Error ? e.message : "অনুরোধ ব্যর্থ হয়েছে"); }
    finally { setLoading(false); }
  }
  return <section className="panel tradingPanel"><span className="pill">📈 Safety-first Trading</span><h2>Forex + Crypto Signal</h2><p>এটি শিক্ষামূলক market setup। কোনো সিগন্যালই লাভ বা loss-free trading নিশ্চিত করতে পারে না।</p><div className="signalControls"><select value={market} onChange={e => {setMarket(e.target.value); setSymbol(e.target.value === "crypto" ? "BTCUSDT" : "EURUSD"); setData(null);}}><option value="crypto">Crypto</option><option value="forex">Forex</option></select><select value={symbol} onChange={e => setSymbol(e.target.value)}>{symbols.map(s => <option key={s}>{s}</option>)}</select><button className="primary" onClick={loadSignal} disabled={loading}>{loading ? "বিশ্লেষণ হচ্ছে..." : "Signal দেখুন"}</button></div>{error && <p className="errorText">{error}</p>}{data && <div className="signalCard"><div className="signalAction">{data.action}</div><div className="signalGrid"><div><span>Market</span><b>{data.market} / {data.symbol}</b></div><div><span>Price</span><b>{data.price ?? "—"}</b></div><div><span>Stop Loss</span><b>{data.stopLoss ?? "—"}</b></div><div><span>Take Profit</span><b>{data.takeProfit ?? "—"}</b></div><div><span>Setup score</span><b>{data.setupScore != null ? data.setupScore+"/100" : "—"}</b></div><div><span>Timeframe</span><b>{data.timeframe ?? "1H"}</b></div></div><p>{data.reason}</p><div className="safetyBox">⚠️ প্রতি ট্রেডে ছোট ঝুঁকি রাখুন, stop-loss ছাড়া trade করবেন না, leverage/martingale এড়িয়ে চলুন।</div></div>}</section>;
}

export default function Home() {
  const [tab, setTab] = useState("home");
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function submitPrivate(kind: "private_share" | "high_alert") {
    if (!message.trim() || loading) return;
    setLoading(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/private", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, text: message, countryCode: "BD" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Submission failed");
      setMessage("");
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "সংরক্ষণ করা যায়নি।");
    } finally {
      setLoading(false);
    }
  }

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

      {tab === "trading" ? <TradingPanel /> : tab === "alert" ? (
        <section className="panel alert">
          <span className="pill">🚨 High Alert</span>
          <h2>জরুরি সহায়তা</h2>
          <p>তাৎক্ষণিক বিপদে আগে স্থানীয় সরকারি জরুরি সেবায় যোগাযোগ করুন। এই ডেমো নিজে থেকে পুলিশ, ফায়ার, অ্যাম্বুলেন্স বা অন্য কর্তৃপক্ষকে যোগাযোগ করে না।</p>
          <div className="country"><b>🇧🇩 বাংলাদেশ</b><strong>999</strong><span>পুলিশ • ফায়ার • অ্যাম্বুলেন্স</span></div>
          <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="যদি নিরাপদ হয়, কী ঘটছে সংক্ষেপে লিখুন..." />
          <button className="danger" onClick={() => submitPrivate("high_alert")} disabled={loading || !message.trim()}>
            {loading ? "পাঠানো হচ্ছে..." : "🔒 Admin-এর জন্য private alert পাঠান"}
          </button>
          {saved && <p className="successText">High Alert submission private channel-এ পাঠানো হয়েছে।</p>}
          {error && <p className="errorText">{error}</p>}
          <p className="adminNote">ভবিষ্যতে verified country directory যুক্ত হলে দেশ অনুযায়ী সেবা দেখানো হবে। লোকেশন শেয়ারিং আলাদা সম্মতি নিয়ে যুক্ত করা হবে।</p>
        </section>
      ) : tab === "private" ? (
        <section className="panel">
          <span className="pill">🔒 Private Share</span>
          <h2>শুধু নিজের কথা বলুন</h2>
          <p>এই জায়গার লেখা পাবলিক ফিডে প্রকাশ করা হবে না। Production database ও encryption key চালু থাকলে এটি encrypted private storage-এ সংরক্ষিত হবে।</p>
          <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="আপনি কী বলতে চান লিখুন..." />
          <button className="primary" onClick={() => submitPrivate("private_share")} disabled={loading || !message.trim()}>
            {loading ? "সংরক্ষণ হচ্ছে..." : "ব্যক্তিগতভাবে পাঠান"}
          </button>
          <button className="secondary" onClick={() => setMessage("")}>মুছে ফেলুন</button>
          {saved && <p className="successText">ব্যক্তিগতভাবে গ্রহণ করা হয়েছে।</p>}
          {error && <p className="errorText">{error}</p>}
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
        <div><b>Privacy-aware</b><span>Private data encrypted storage-এর জন্য প্রস্তুত</span></div>
        <div><b>Admin control</b><span>Admin area server-side authentication ব্যবহার করে</span></div>
      </section>
      <footer>© 2026 Global AI Assistance · <a href="/privacy">Privacy & Safety</a></footer>
    </main>
  );
}
