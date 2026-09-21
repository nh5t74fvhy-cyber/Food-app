import {cronAuth,database,errorResponse,json,method} from '../server/shared.mjs';
import {checkSources} from '../server/sources.mjs';
export default async function handler(req,res){try{method(req,'POST');cronAuth(req);return json(res,200,{sources:await checkSources(database())})}catch(e){return errorResponse(res,e)}}
