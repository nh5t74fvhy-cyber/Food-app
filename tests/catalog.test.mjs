import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {BRANDS,eligibleDeals} from '../server/logic.mjs';
import {preferencesSchema} from '../server/shared.mjs';
const deals=JSON.parse(await readFile(new URL('../src/deals.json',import.meta.url),'utf8'));
test('expanded restaurant preferences are accepted by the server',()=>{
 const settings={enabled:false,timezone:'UTC',times:{breakfast:'07:30',lunch:'11:30',dinner:'17:30'},meals:['lunch'],brands:BRANDS,maxPrice:25,radius:10,nearbyOnly:false,latitude:null,longitude:null};
 assert.ok(preferencesSchema.safeParse(settings).success);
 assert.ok(deals.every(d=>BRANDS.includes(d.brand)));
 assert.equal(new Set(deals.map(d=>d.id)).size,deals.length);
});
test('multi-buy and unknown-total offers do not look cheaper in budget alerts',()=>{
 const prefs={brands:[],maxPrice:7,nearbyOnly:false};
 const eligible=eligibleDeals(deals,prefs,'lunch',[],[],new Date('2026-09-21T12:00:00Z'));
 assert.ok(!eligible.some(d=>d.id==='dominos-mix'||d.id==='wendys-nuggets'));
 assert.equal(deals.find(d=>d.id==='dominos-mix').price,13.98);
});
