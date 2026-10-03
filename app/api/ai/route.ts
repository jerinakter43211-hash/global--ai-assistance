import { NextResponse } from "next/server";

const MAX_INPUT = 6000;

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "AI service is not configured yet." },
        { status: 503 },
      );
    }

    const body = await request.json();
    const message = typeof body?.message === "string" ? body.message.trim() : "";
    const language = typeof body?.language === "string" ? body.language : "auto";
    const category = typeof body?.category === "string" ? body.category : "general";

    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }
    if (message.length > MAX_INPUT) {
      return NextResponse.json({ error: "Message is too long." }, { status: 400 });
    }

    const safety = category === "health"
      ? "Do not diagnose. Give general information, red flags, and appropriate professional-care guidance."
      : category === "emergency"
        ? "Treat this as potentially urgent. Encourage immediate contact with verified local emergency services when danger is present. Never claim to have contacted authorities."
        : "Give practical, step-by-step guidance and clearly state uncertainty when information is incomplete.";

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-6-luna",
        instructions: `You are Global AI Assistance, a multilingual everyday-help assistant. Respond in the user's language when possible. Be concise, kind, practical, and safety-aware. ${safety}`,
        input: `Category: ${category}\nPreferred language: ${language}\nUser problem:\n${message}`,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("OpenAI API error:", detail.slice(0, 1000));
      return NextResponse.json({ error: "AI service request failed." }, { status: 502 });
    }

    const data = await response.json();
    const answer = typeof data?.output_text === "string" ? data.output_text.trim() : "";

    if (!answer) {
      return NextResponse.json({ error: "AI returned no answer." }, { status: 502 });
    }

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("AI route error:", error);
    return NextResponse.json({ error: "Unable to process the request." }, { status: 500 });
  }
}
