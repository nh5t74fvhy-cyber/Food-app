import {readFile} from 'node:fs/promises';
import {database} from '../server/shared.mjs';
const deals=JSON.parse(await readFile(new URL('../src/deals.json',import.meta.url),'utf8'));
// Preserve the actual research timestamps. Never make old research look current.
const{error}=await database().from('deals').upsert(deals,{onConflict:'id'});if(error)throw error;console.log(`Seeded ${deals.length} offers with original verification dates.`);
