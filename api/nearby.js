import {body,errorResponse,json,locationSchema,method,rateLimit,user} from '../server/shared.mjs';
import {findNearby} from '../server/places.mjs';
export default async function handler(req,res){try{method(req,'POST');const account=await user(req);await rateLimit(account.id,'nearby',5);const location=locationSchema.parse(body(req));return json(res,200,{locations:await findNearby(location),attribution:'Google Maps'});}catch(e){return errorResponse(res,e)}}
