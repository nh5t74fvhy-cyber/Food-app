import test from 'node:test';
import assert from 'node:assert/strict';
import push from '../api/push.js';
import nearby from '../api/nearby.js';
import cron from '../api/cron.js';
import refresh from '../api/refresh.js';
function response(){return {code:0,data:null,headers:{},setHeader(k,v){this.headers[k]=v},status(s){this.code=s;return this},json(v){this.data=v;return this}}}
test('private endpoints reject unauthenticated requests before doing work',async()=>{for(const handler of [push,nearby]){const res=response();await handler({method:'POST',headers:{},body:{}},res);assert.equal(res.code,401)}});
test('cron and refresh fail closed when scheduler has no secret',async()=>{delete process.env.CRON_SECRET;for(const handler of [cron,refresh]){const res=response();await handler({method:'POST',headers:{},body:{}},res);assert.equal(res.code,503)}});
test('cron rejects an incorrect secret',async()=>{process.env.CRON_SECRET='s'.repeat(40);for(const handler of [cron,refresh]){const res=response();await handler({method:'POST',headers:{authorization:'Bearer wrong'},body:{}},res);assert.equal(res.code,401)}delete process.env.CRON_SECRET});
test('endpoints reject unintended HTTP methods',async()=>{for(const handler of [push,nearby,refresh,cron]){const res=response();await handler({method:'PATCH',headers:{}},res);assert.equal(res.code,405)}});
