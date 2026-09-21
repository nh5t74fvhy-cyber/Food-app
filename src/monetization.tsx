import config from './monetization.json';
type Affiliate={url:string;disclosure:string};
type Sponsor={name:string;title:string;description:string;url:string;endsAt:string};
const setup=config as {sponsor:Sponsor|null;affiliateLinks:Record<string,Affiliate>};
export function safeCommercialUrl(value:string){try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password?u.href:null}catch{return null}}
export function AffiliateOffer({id}:{id:string}){
 const offer=setup.affiliateLinks[id];const url=offer&&safeCommercialUrl(offer.url);
 if(!offer||!url)return null;
 return <div className="commercial-offer"><p>{offer.disclosure||'Paid link: MealRadar may earn a commission if you make a qualifying purchase.'}</p><a className="secondary full" href={url} rel="sponsored noopener noreferrer" target="_blank">Shop partner offer ↗</a></div>;
}
export function SponsoredPlacement(){
 const sponsor=setup.sponsor;const url=sponsor&&safeCommercialUrl(sponsor.url);
 if(!sponsor||!url||!Number.isFinite(Date.parse(sponsor.endsAt))||Date.parse(sponsor.endsAt)<=Date.now())return null;
 return <aside className="sponsored-placement" aria-label="Advertisement"><small>ADVERTISEMENT · {sponsor.name}</small><h2>{sponsor.title}</h2><p>{sponsor.description}</p><a className="secondary" href={url} target="_blank" rel="sponsored noopener noreferrer">View sponsor offer ↗</a></aside>;
}
