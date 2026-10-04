import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";

const url=process.env.KV_REST_API_URL, token=process.env.KV_REST_API_TOKEN;
async function redis(command: unknown[]) {
 if(!url||!token) throw new Error("Monitor Redis is not configured");
 const r=await fetch(url,{method:"POST",headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"},body:JSON.stringify(command),cache:"no-store"});
 if(!r.ok) throw new Error(`Redis request failed: ${r.status}`);
 return (await r.json()).result;
}
const hash=(v:string)=>createHash("sha256").update(v).digest("hex");
export async function POST(req:NextRequest){
 const started=Date.now(), at=new Date(started).toISOString();
 try{
  const body=await req.json().catch(()=>({}));
  const items=Array.isArray(body.items)?body.items:[];
  const accepted=[];
  for(const item of items){
   const canonical=String(item?.url||item?.id||"").trim();
   if(!canonical) continue;
   const key=`rhevolver:monitor:seen:${hash(canonical)}`;
   const fresh=await redis(["SET",key,at,"NX","EX","2592000"]);
   if(fresh==="OK") accepted.push(item);
  }
  const finished=new Date().toISOString(), durationMs=Date.now()-started;
  const record={at,finished,durationMs,status:"ok",received:items.length,newItems:accepted.length};
  await redis(["SET","rhevolver:monitor:last_heartbeat",finished]);
  await redis(["SET","rhevolver:monitor:last_success",finished]);
  await redis(["LPUSH","rhevolver:monitor:history",JSON.stringify(record)]);
  await redis(["LTRIM","rhevolver:monitor:history","0","499"]);
  return NextResponse.json({ok:true,...record,items:accepted});
 }catch(e){
  const record={at,finished:new Date().toISOString(),durationMs:Date.now()-started,status:"error",error:e instanceof Error?e.message:"unknown"};
  try{await redis(["LPUSH","rhevolver:monitor:history",JSON.stringify(record)]);await redis(["LTRIM","rhevolver:monitor:history","0","499"]);}catch{}
  return NextResponse.json({ok:false,...record},{status:500});
 }
}
