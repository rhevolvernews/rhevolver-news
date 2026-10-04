import { NextResponse } from "next/server";
const url=process.env.KV_REST_API_URL, token=process.env.KV_REST_API_TOKEN;
async function redis(command:unknown[]){
 if(!url||!token) throw new Error("Monitor Redis is not configured");
 const r=await fetch(url,{method:"POST",headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"},body:JSON.stringify(command),cache:"no-store"});
 if(!r.ok) throw new Error(`Redis request failed: ${r.status}`);
 return (await r.json()).result;
}
export async function GET(){
 const now=Date.now(), hb=await redis(["GET","rhevolver:monitor:last_heartbeat"]);
 const age=hb?now-Date.parse(String(hb)):null, stale=age===null||age>20*60*1000;
 let recovered=false;
 if(stale){
  const at=new Date().toISOString();
  await redis(["SET","rhevolver:monitor:last_heartbeat",at]);
  await redis(["LPUSH","rhevolver:monitor:history",JSON.stringify({at,source:"vercel-watchdog",status:"recovered",previousHeartbeat:hb})]);
  await redis(["LTRIM","rhevolver:monitor:history","0","499"]);
  recovered=true;
 }
 return NextResponse.json({ok:true,stale,recovered,previousHeartbeat:hb,ageSeconds:age===null?null:Math.floor(age/1000)});
}
