export type Message={id:string;text:string;role:'user'|'assistant'|'target';source?:string};
export type Asset={id:string;name:string;kind:'audio'|'image';data:string};
export type Profile={id:string;name:string;photo:string;consent:boolean;consentAt:string;messages:Message[];history:Message[];assets:Asset[];style:string;logs?:{id:string;name:string;text:string;ext:string}[]};
export type State={version:1;profiles:Profile[]};
const DB='remind-rebuilt-v1';
export function db(){return new Promise<IDBDatabase>((resolve,reject)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>r.result.createObjectStore('state');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
export async function read(){const d=await db();try{return await new Promise<State|undefined>((resolve,reject)=>{const r=d.transaction('state').objectStore('state').get('main');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}finally{d.close()}}
export async function write(s:State){const d=await db();try{await new Promise<void>((resolve,reject)=>{const t=d.transaction('state','readwrite');t.objectStore('state').put(s,'main');t.oncomplete=()=>resolve();t.onerror=()=>reject(t.error);t.onabort=()=>reject(t.error)})}finally{d.close()}}
export function dataURL(file:File){return new Promise<string>((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result));r.onerror=()=>reject(r.error);r.readAsDataURL(file)})}
export function completeness(p:Profile){return Math.round((p.photo?10:0)+(p.consent?10:0)+Math.min(60,p.messages.length*2)+(p.assets.some(a=>a.kind==='audio')?10:0)+(p.style.trim()?10:0))}
export function parseLog(text:string,ext:string):Message[]{
 let values:string[]=[];
 if(ext==='json'){const j=JSON.parse(text);const rows=Array.isArray(j)?j:j.messages;if(!Array.isArray(rows))throw Error('JSON 배열 또는 messages 배열이 필요합니다.');values=rows.map((v:unknown)=>typeof v==='string'?v:typeof v==='object'&&v!==null?String((v as Record<string,unknown>).text??(v as Record<string,unknown>).content??''):'');}
 else if(ext==='csv'){let row:string[]=[],cell='',quoted=false;const rows:string[][]=[];for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++}else quoted=!quoted}else if(c===','&&!quoted){row.push(cell);cell=''}else if(c==='\n'&&!quoted){row.push(cell.replace(/\r$/,''));rows.push(row);row=[];cell=''}else cell+=c}if(quoted)throw Error('CSV 따옴표가 닫히지 않았습니다.');row.push(cell);rows.push(row);const col=rows[0]?.findIndex(x=>/^(text|content|message|메시지|내용)$/i.test(x.trim()))??-1;values=(col>=0?rows.slice(1):rows).map(r=>col>=0?r[col]??'':r.join(' | '));}
 else values=text.split(/\r?\n/);
 return values.map(x=>x.trim()).filter(Boolean).map(text=>({id:crypto.randomUUID(),text,role:'target',source:'log'}));
}
