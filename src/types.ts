export type Meal = 'breakfast' | 'lunch' | 'dinner';
export type Deal = {
 id:string; brand:string; title:string; description:string; price:number|null;
 price_label:string; meals:Meal[]; category:string; image:string; color:string;
 source_url:string; checked_at:string|null; expires_at:string|null; status:'verified'|'check';
 terms:string; app_required:boolean; featured?:boolean;
};
export type Preferences = {enabled:boolean;timezone:string;times:Record<Meal,string>;meals:Meal[];brands:string[];maxPrice:number;radius:number;nearbyOnly:boolean;latitude:number|null;longitude:number|null};
export type LocationMatch = {brand:string;name:string;address:string;latitude:number;longitude:number;distance:number};
