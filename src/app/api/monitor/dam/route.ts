import { NextRequest, NextResponse } from "next/server";
const url=process.env.KV_REST_API_URL, token=process.env.KV_REST_API_TOKEN;
async function redis(command:unknown[]){
 if(!url||!token) throw new Error("Monitor Redis is not configured");
 const r=await fetch(url,{method:"POST",headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"},body:JSON.stringify(command),cache:"no-store"});
 if(!r.ok) throw new Error(`Redis request failed: ${r.status}`);
 return (await r.json()).result;
}
export async function POST(req:NextRequest){
 const body=await req.json();
 if(!body?.sourceUrl||!body?.observedAt) return NextResponse.json({ok:false,error:"sourceUrl and observedAt required"},{status:400});
 const key="rhevolver:monitor:dam:valerio_trujano:last";
 const previousRaw=await redis(["GET",key]);
 const previous=previousRaw?JSON.parse(String(previousRaw)):null;
 const current={observedAt:String(body.observedAt),sourceUrl:String(body.sourceUrl),fillPercent:body.fillPercent??null,volumeHm3:body.volumeHm3??null,level:body.level??null,release:body.release??null,verified:true};
 const changed=!previous||JSON.stringify({...previous,observedAt:undefined})!==JSON.stringify({...current,observedAt:undefined});
 if(changed) await redis(["SET",key,JSON.stringify(current)]);
 return NextResponse.json({ok:true,changed,previous,current});
}
