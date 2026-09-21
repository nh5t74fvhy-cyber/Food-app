import {SOURCES,inspectSource} from '../server/sources.mjs';
for(const source of SOURCES){try{const result=await inspectSource(source);console.log(JSON.stringify({id:source.id,url:source.url,hash:result.hash,text:result.text},null,2))}catch(e){console.log(JSON.stringify({id:source.id,error:e.message}))}}
