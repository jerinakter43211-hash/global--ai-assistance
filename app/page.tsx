"use client";
import { useState } from "react";

const features = [
  ["💬","সমস্যার সমাধান","দৈনন্দিন সমস্যায় AI-এর ধাপে ধাপে নির্দেশনা"],
  ["🚨","High Alert","দেশভিত্তিক জরুরি সেবা ও নিরাপত্তা নির্দেশনা"],
  ["🎓","Student Hub","ছবি তুলে প্রশ্ন করুন, বুঝে শিখুন, অনুশীলন করুন"],
  ["💼","Jobs & Career","CV, interview, skills ও ক্যারিয়ার প্রস্তুতি"],
  ["🧠","Skills Learning","ফ্রিল্যান্সিং, ডিজিটাল মার্কেটিং, ওয়েব ও অন্যান্য স্কিল"],
  ["🔒","Private Share","আপনার ব্যক্তিগত সমস্যা পাবলিক হবে না"],
  ["🌍","Global","দেশ ও ভাষা অনুযায়ী সহায়তা"],
  ["📅","Daily Advice","AI তৈরি করবে, অ্যাডমিন অনুমোদনের পর প্রকাশ হবে"]
];

export default function Home() {
 const [tab,setTab]=useState("home"); const [msg,setMsg]=useState("");
 return <main>
  <header><div className="brand">🌍 <span>Global AI Assistance</span></div><nav><button onClick={()=>setTab("home")}>হোম</button><button onClick={()=>setTab("help")}>সহায়তা</button><button onClick={()=>setTab("student")}>শিক্ষার্থী</button><button onClick={()=>setTab("skills")}>স্কিল</button></nav><button className="outline">🌐 বাংলা</button></header>
  <section className="hero"><div><span className="pill">সবার জন্য • বিনামূল্যে • Privacy-first</span><h1>আপনার সমস্যা বলুন।<br/><em>সমাধানের পথ খুঁজে নিন।</em></h1><p>দৈনন্দিন জীবন, শিক্ষা, দক্ষতা, ক্যারিয়ার এবং জরুরি সহায়তার জন্য এক জায়গায় সহজ AI সহায়তা।</p><div className="actions"><button className="primary" onClick={()=>setTab("help")}>✨ সাহায্য চাই</button><button className="danger" onClick={()=>setTab("alert")}>🚨 জরুরি সহায়তা</button><button className="secondary" onClick={()=>setTab("private")}>🔒 শুধু নিজের কথা বলুন</button></div></div><div className="heroCard"><div className="orb">✦</div><b>AI Assistance</b><span>আপনার ভাষায়, আপনার প্রয়োজন অনুযায়ী</span><div className="mini">🔐 ব্যক্তিগত তথ্য সুরক্ষিত</div></div></section>
  {tab==="alert" ? <section className="panel alert"><h2>🚨 High Alert / জরুরি সহায়তা</h2><p>জরুরি অবস্থায় প্রথমে স্থানীয় সরকারি জরুরি সেবায় যোগাযোগ করুন। লোকেশন ব্যবহার হবে কেবল আপনার অনুমতি থাকলে।</p><div className="country"><b>🇧🇩 বাংলাদেশ</b><strong>999</strong><span>পুলিশ • ফায়ার • অ্যাম্বুলেন্স</span></div><button className="primary" onClick={()=>navigator.geolocation?.getCurrentPosition(()=>alert("লোকেশন অনুমতি পাওয়া গেছে। বাস্তব কর্তৃপক্ষকে স্বয়ংক্রিয়ভাবে বার্তা পাঠানো হয়নি।"),()=>alert("লোকেশন অনুমতি দেওয়া হয়নি।"))}>📍 লোকেশন শেয়ার করতে চাই</button></section> : tab==="private" ? <section className="panel"><h2>🔒 শুধু নিজের কথা বলুন</h2><p>আপনার লেখা পাবলিক ফিডে প্রকাশ হবে না।</p><textarea value={msg} onChange={e=>setMsg(e.target.value)} placeholder="আপনি কী বলতে চান লিখুন..."/><button className="primary" onClick={()=>{setMsg("");alert("ডেমোতে ব্যক্তিগতভাবে সংরক্ষণের ফ্লো প্রস্তুত।")}}>ব্যক্তিগতভাবে পাঠান</button></section> : <section className="features"><div className="sectionHead"><span>এক প্ল্যাটফর্মে</span><h2>মানুষের প্রয়োজনের গুরুত্বপূর্ণ জায়গাগুলো</h2></div><div className="grid">{features.map(([i,t,d])=><article key={t} onClick={()=>setTab(t==="Student Hub"?"student":t==="Skills Learning"?"skills":t==="High Alert"?"alert":"help")}><div className="icon">{i}</div><h3>{t}</h3><p>{d}</p><span>→</span></article>)}</div></section>}
  <section className="trust"><div><b>Privacy-first</b><span>ব্যক্তিগত সমস্যা পাবলিক নয়</span></div><div><b>Global-ready</b><span>দেশ ও ভাষাভিত্তিক সেবা</span></div><div><b>Human-centered</b><span>AI সহায়তা, বাস্তব সেবার পথ</span></div><div><b>Admin control</b><span>Daily Advice প্রকাশের আগে অনুমোদন</span></div></section>
  <footer>© 2026 Global AI Assistance · নিরাপদে সহায়তা, সহজে শেখা, সবার জন্য।</footer>
 </main>
}
