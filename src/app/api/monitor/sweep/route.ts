import { createHash } from "crypto";
import { monitorSources } from "../../../../../monitor/sources";
import { NextResponse } from "next/server";
const kv=process.env.KV_REST_API_URL, token=process.env.KV_REST_API_TOKEN;
async function redis(command:unknown[]){if(!kv||!token)throw new Error("Monitor Redis is not configured");const r=await fetch(kv,{method:"POST",headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"},body:JSON.stringify(command),cache:"no-store"});if(!r.ok)throw new Error(`Redis request failed: ${r.status}`);return(await r.json()).result;}
function links(html:string,base:string){const out=new Set<string>();for(const m of html.matchAll(/href=["']([^"'#]+)["']/gi)){try{const u=new URL(m[1],base);if(u.protocol==="https:"||u.protocol==="http:")out.add(u.href);}catch{}}return [...out].slice(0,100);}
export async function GET(){
 const started=Date.now(),at=new Date().toISOString(),results:any[]=[];
 try{
  for(const source of monitorSources){
   try{const r=await fetch(source.url,{headers:{"User-Agent":"RhevolverMonitor/1.0"},cache:"no-store",signal:AbortSignal.timeout(12000)});const html=await r.text();const found=links(html,source.url);let fresh=0;
    for(const link of found){const h=createHash("sha256").update(link).digest("hex");const ok=await redis(["SET",`rhevolver:monitor:seen:${h}`,at,"NX","EX","2592000"]);if(ok==="OK")fresh++;}
    const usable=r.ok&&found.length>=2; results.push({id:source.id,ok:r.ok,reachable:r.ok,usable,status:r.status,links:found.length,newLinks:fresh,reason:usable?null:(r.ok?"insufficient-links":"http-error")});
   }catch(e){results.push({id:source.id,ok:false,error:e instanceof Error?e.message:"unknown"});}
  }
  const successful=results.filter(x=>x.ok).length,usable=results.filter(x=>x.usable).length,finished=new Date().toISOString(),durationMs=Date.now()-started;
  const record={at,finished,durationMs,status:usable>0?"ok":"error",sources:results.length,successful,usable};
  if(usable>0){await redis(["SET","rhevolver:monitor:last_heartbeat",finished]);await redis(["SET","rhevolver:monitor:last_success",finished]);}
  await redis(["LPUSH","rhevolver:monitor:history",JSON.stringify(record)]);await redis(["LTRIM","rhevolver:monitor:history","0","499"]);
  return NextResponse.json({ok:usable>0,...record,results});
 }catch(e){return NextResponse.json({ok:false,error:e instanceof Error?e.message:"unknown"},{status:500});}
}