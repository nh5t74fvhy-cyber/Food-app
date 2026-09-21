import {createClient} from '@supabase/supabase-js';
import type {Preferences,Deal} from './types';
const env = import.meta.env;
const supabaseUrl = env.VITE_MEALRADAR_SUPABASE_URL || env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_MEALRADAR_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const configured = Boolean(supabaseUrl && supabaseKey);
export const supabase = configured ? createClient(supabaseUrl, supabaseKey) : null;
export const defaults:Preferences = {enabled:false,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,times:{breakfast:'07:30',lunch:'11:30',dinner:'17:30'},meals:['breakfast','lunch','dinner'],brands:[],maxPrice:25,radius:10,nearbyOnly:false,latitude:null,longitude:null};
export function stored<T>(key:string,fallback:T):T {try{return JSON.parse(localStorage.getItem(key)||'null')??fallback}catch{return fallback}}
export function saveLocal(key:string,value:unknown){try{localStorage.setItem(key,JSON.stringify(value))}catch{/* Storage may be disabled. */}}
export function isCurrent(d:Deal){return d.status==='verified' && Boolean(d.checked_at) && Date.parse(d.checked_at!)<=Date.now() && Date.now()-Date.parse(d.checked_at!)<7*86400000 && (!d.expires_at||Date.parse(d.expires_at)>Date.now());}
export const brandClass = (brand:string)=>brand.startsWith('Mc')?'mcd':brand.startsWith('Chili')?'chilis':brand.startsWith('Panera')?'panera':brand.startsWith('Apple')?'applebees':'other';
export const brandMark = (brand:string)=>brand.startsWith('Mc')?'M':brand.startsWith('Chili')?'c':brand.startsWith('Panera')?'P':brand.startsWith('Apple')?'a':brand.charAt(0);
export async function api(path:string,body?:unknown){
 const session = await supabase?.auth.getSession();
 const response=await fetch(path,{method:body?'POST':'GET',headers:{'Content-Type':'application/json',...(session?.data.session?{Authorization:`Bearer ${session.data.session.access_token}`}:{})},...(body?{body:JSON.stringify(body)}:{})});
 let data;try{data=await response.json()}catch{throw new Error('This feature needs the hosted app. Your preferences can still be saved on this device.')}
 if(!response.ok)throw new Error(data.error||'Unable to complete this request. Try again.');return data;
}
export async function enablePush(){
 if(!supabase)throw new Error('Scheduled alerts will be available after the app’s backend is connected. You can set your preferences now.');
 if(!('serviceWorker'in navigator)||!('PushManager'in window))throw new Error('Push is not supported here. On iPhone, add MealRadar to your Home Screen and open it there.');
 if(!env.VITE_VAPID_PUBLIC_KEY)throw new Error('Push delivery has not been configured yet.');
 if(Notification.permission==='denied')throw new Error('Notifications are blocked. Allow them in your browser settings first.');
 const permission=await Notification.requestPermission();if(permission!=='granted')throw new Error('Notifications were not enabled.');
 const registration=await navigator.serviceWorker.ready;
 const raw=atob(env.VITE_VAPID_PUBLIC_KEY.replace(/-/g,'+').replace(/_/g,'/'));
 const key=Uint8Array.from(raw,c=>c.charCodeAt(0));
 const subscription=await registration.pushManager.getSubscription()||await registration.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:key});
 await api('/api/push',{subscription:subscription.toJSON()});return subscription;
}

export async function signOutDevice(){
 if('serviceWorker' in navigator){const registration=await navigator.serviceWorker.getRegistration();const sub=await registration?.pushManager.getSubscription();if(sub){await api('/api/push',{subscription:sub.toJSON(),action:'unsubscribe'});await sub.unsubscribe();}}
 const result=await supabase?.auth.signOut();if(result?.error)throw result.error;
}
