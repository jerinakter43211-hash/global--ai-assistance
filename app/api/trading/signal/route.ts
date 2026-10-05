import { NextResponse } from "next/server";

type Candle = [number,string,string,string,string,string];

function ema(values:number[], period:number) {
  const k=2/(period+1); let e=values[0];
  for(let i=1;i<values.length;i++) e=values[i]*k+e*(1-k);
  return e;
}
function rsi(values:number[], period=14) {
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
  if(market!=="crypto") return NextResponse.json({market,symbol,action:"NO TRADE",reason:"লাইভ Forex data provider এখনো সংযুক্ত নয়। ডেটা ছাড়া অনুমান করে signal দেওয়া হবে না।",timeframe:"1H"});
  if(!/^[A-Z0-9]{5,12}$/.test(symbol)) return NextResponse.json({error:"Invalid symbol"},{status:400});
  try{
    const url="https://data-api.binance.vision/api/v3/klines?symbol="+encodeURIComponent(symbol)+"&interval=1h&limit=120";
    const r=await fetch(url,{cache:"no-store"});
    if(!r.ok) throw new Error("Market data unavailable");
    const candles=(await r.json()) as Candle[];
    const closes=candles.map(c=>Number(c[4])).filter(Number.isFinite);
    if(closes.length<60) throw new Error("Not enough market data");
    const price=closes[closes.length-1], fast=ema(closes.slice(-80),20), slow=ema(closes.slice(-100),50), rv=rsi(closes,14);
    const action=fast>slow && rv>=52 && rv<=70 ? "BUY" : fast<slow && rv>=30 && rv<=48 ? "SELL" : "NO TRADE";
    const recentHigh=Math.max(...closes.slice(-14)), recentLow=Math.min(...closes.slice(-14));
    const distance=Math.max(price*0.008,(recentHigh-recentLow)*0.35);
    const stopLoss=action==="BUY"?price-distance:action==="SELL"?price+distance:null;
    const takeProfit=action==="BUY"?price+distance*3:action==="SELL"?price-distance*3:null;
    const score=action==="NO TRADE"?Math.round(Math.min(65,50+Math.abs(rv-50))):Math.round(Math.min(85,60+Math.abs(rv-50)*1.2));
    return NextResponse.json({market,symbol,action,price:Number(price.toFixed(6)),stopLoss:stopLoss?Number(stopLoss.toFixed(6)):null,takeProfit:takeProfit?Number(takeProfit.toFixed(6)):null,setupScore:score,timeframe:"1H",reason:action==="BUY"?"20 EMA > 50 EMA এবং RSI momentum BUY-এর পক্ষে।":action==="SELL"?"20 EMA < 50 EMA এবং RSI momentum SELL-এর পক্ষে।":"EMA/RSI confirmation পরিষ্কার নয়—capital protection-এর জন্য NO TRADE।"});
  }catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Market data unavailable"},{status:503});}
}
