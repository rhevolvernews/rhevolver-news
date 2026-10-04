import { NextResponse } from "next/server";
import { createHash } from "crypto";
const url=process.env.KV_REST_API_URL, token=process.env.KV_REST_API_TOKEN;
async function redis(command:unknown[]){
 if(!url||!token) throw new Error("Monitor Redis is not configured");
 const r=await fetch(url,{method:"POST",headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"},body:JSON.stringify(command),cache:"no-store"});
 if(!r.ok) throw new Error(`Redis request failed: ${r.status}`);
 return (await r.json()).result;
}
export async function GET(){
 const id="rhevolver-selftest-dedup-v1";
 const key="rhevolver:monitor:test:seen:"+createHash("sha256").update(id).digest("hex");
 await redis(["DEL",key]);
 const first=await redis(["SET",key,new Date().toISOString(),"NX","EX","60"]);
 const second=await redis(["SET",key,new Date().toISOString(),"NX","EX","60"]);
 await redis(["DEL",key]);
 return NextResponse.json({ok:first==="OK"&&second===null,dedup:{firstAccepted:first==="OK",secondRejected:second===null},cleanup:true});
}
