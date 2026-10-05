import { NextResponse } from "next/server";

type Candle = [number,string,string,string,string,string];

function ema(values:number[], period:number) {
  const k=2/(period+1); let e=values[0];
  for(let i=1;i<values.length;i++) e=values[i]*k+e*(1-k);
  return e;
}
function rsi(values:number[], period=14) {
  if(values.length<=period) return 50;
  let gain=0,loss=0;
  for(let i=1;i<=period;i++){const d=values[i]-values[i-1]; if(d>=0) gain+=d; else loss-=d;}
  gain/=period; loss/=period;
  for(let i=period+1;i<values.length;i++){const d=values[i]-values[i-1]; gain=(gain*(period-1)+Math.max(d,0))/period; loss=(loss*(period-1)+Math.max(-d,0))/period;}
  return loss===0?100:100-100/(1+gain/loss);
}
export async function GET(req:Request){
  const {searchParams}=new URL(req.url);
  const market=searchParams.get("market")||"crypto";
  const symbol=searchParams.get("symbol")||"BTCUSDT";
  const interval=searchParams.get("interval")||"5m";
  if(!["1m","5m","15m"].includes(interval)) return NextResponse.json({error:"Invalid timeframe"},{status:400});
  if(market!=="crypto") return NextResponse.json({market,symbol,action:"NO TRADE",reason:"লাইভ Forex candle provider এখনো সংযুক্ত নয়। ডেটা ছাড়া CALL/PUT অনুমান করে দেওয়া হবে না।",timeframe:interval,expiry:"—"});
  if(!/^[A-Z0-9]{5,12}$/.test(symbol)) return NextResponse.json({error:"Invalid symbol"},{status:400});
  try{
    const url="https://data-api.binance.vision/api/v3/klines?symbol="+encodeURIComponent(symbol)+"&interval="+interval+"&limit=120";
    const r=await fetch(url,{cache:"no-store"});
    if(!r.ok) throw new Error("Market data unavailable");
    const candles=(await r.json()) as Candle[];
    const closes=candles.map(c=>Number(c[4])).filter(Number.isFinite);
    if(closes.length<60) throw new Error("Not enough market data");
    const price=closes[closes.length-1];
    const fast=ema(closes.slice(-60),9), slow=ema(closes.slice(-80),21), rv=rsi(closes,14);
    const last=closes[closes.length-1], prev=closes[closes.length-2];
    const momentum=last>prev ? 1 : last<prev ? -1 : 0;
    const bullish=fast>slow && rv>=52 && rv<=68 && momentum>0;
    const bearish=fast<slow && rv>=32 && rv<=48 && momentum<0;
    const action=bullish?"CALL":bearish?"PUT":"NO TRADE";
    const alignment=action==="NO TRADE"?0:Math.min(3,(fast>slow)==(action==="CALL")?1:0)+((rv>=52&&action==="CALL")||(rv<=48&&action==="PUT")?1:0)+(momentum===(action==="CALL"?1:-1)?1:0);
    const setupScore=action==="NO TRADE"?Math.round(50+Math.min(15,Math.abs(rv-50))):Math.round(65+alignment*7);
    const expiry=interval==="1m"?"1–2 মিনিট":interval==="5m"?"5–10 মিনিট":"15–30 মিনিট";
    const reason=action==="CALL"?"9 EMA > 21 EMA, RSI bullish zone এবং শেষ candle momentum ঊর্ধ্বমুখী।":action==="PUT"?"9 EMA < 21 EMA, RSI bearish zone এবং শেষ candle momentum নিম্নমুখী।":"EMA, RSI ও momentum একই দিকে নিশ্চিত নয়—তাই NO TRADE।";
    return NextResponse.json({market,symbol,action,price:Number(price.toFixed(6)),setupScore,timeframe:interval,expiry,rsi:Number(rv.toFixed(2)),reason});
  }catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Market data unavailable"},{status:503});}
}
