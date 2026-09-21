# Research and implementation notes

Research date: September 21, 2026. Official pages were used for the seed catalog. Local participation was not verified.

## Restaurant sources

- [McDonald's official offers](https://www.mcdonalds.com/us/en-us/deals.html): starting-price meal deal and dated app promotions. See the offer details in the app for eligibility and purchase requirements.
- [Chili's 3 for Me](https://www.chilis.com/3-for-me): advertised meal bundle with a starting price and location caveat.
- [Applebee's official specials](https://www.applebees.com/en/specials): meal-for-two structure confirmed; a universal price was not published on the inspected page, so the app shows “Local price.”
- [Panera menu](https://www.panerabread.com/en-us/menu/categories/value-duets.html): the retrieved page exposed an account/ordering shell rather than dependable public offer data. No price or current discount is asserted.

Promotional image origins are recorded directly in `src/deals.json`. The images are illustrative restaurant marketing assets, not evidence of local inventory. Broken remote images fall back to restaurant identity cards.

## Technical primary sources reviewed

- [Supabase changelog](https://supabase.com/changelog)
- [Supabase React authentication](https://supabase.com/docs/guides/auth/quickstarts/react)
- [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase Cron](https://supabase.com/docs/guides/cron)
- [Supabase notification examples](https://supabase.com/docs/guides/functions/examples/push-notifications)
- [MDN Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Google web push codelab](https://codelabs.developers.google.com/codelabs/push-notifications)
- [web-push library](https://github.com/web-push-libs/web-push)
- [Google Places Text Search](https://developers.google.com/maps/documentation/places/web-service/text-search)
- [Vercel Node.js functions](https://vercel.com/docs/functions/runtimes/node-js)

Video resources were searched and the official Supabase YouTube channel was opened, but the available text did not provide a technical transcript. Implementation is grounded in the primary documentation above; no claim is made that video contents were watched or verified.

## Important product choices

- Starting prices and required purchase amounts are not treated as universal checkout totals.
- No invented list-price comparisons, savings percentages, nearby-store distances, or “live” labels.
- Authenticated/personalized restaurant offers need the user's own restaurant app. The app links out for redemption.
- Reviewed source changes go to human review. A changed page is not sufficient evidence for automatically publishing a newly inferred promotion.

## Bundled promotional images

- Chili’s meal: https://cdn.builder.io/api/v1/image/assets%2F4967176e01a141828a5fad701f6faa79%2Fdd5d232753c044729366a78c979ca303?width=983
- McDonald’s meal: https://s7d1.scene7.com/is/image/mcdonalds/ROD_Meal_Deal:3-column-desktop?resmode=sharp2

These two assets are bundled to avoid broken remote loads; they were retrieved from the official source pages.

## Expanded catalog — September 21, 2026

Added ten listings from seven additional restaurant brands. Exact location participation is not verified. Unknown end dates remain null and all verified research expires after seven days unless rechecked.

- Wendy’s: https://www.wendys.com/offers-coupons — $1.99 nuggets require another purchase (total spend unknown, excluded from budget alerts); $3 discount requires $20 qualifying spend. No weekday-only offers added because weekday scheduling is not yet implemented.
- Taco Bell: https://www.tacobell.com/food/luxe-value-menu — value menu; listed prices $1.39–$2.99, subject to local pricing.
- Domino’s: https://www.dominos.com/deals — $7.99 carryout; $6.99 each Mix & Match requires two items, so the price-filter minimum is $13.98. Local surcharges apply.
- Buffalo Wild Wings: https://www.buffalowildwings.com/promos/ — advertised $21.99 bundle, limited time and participating locations.
- IHOP: https://www.ihop.com/en/specials — $6 Value Menu with location, tax and promotion exclusions.
- Subway: https://www.subway.com/en-us/menunutrition/menu — $4.99 Sub of the Day and $6.99 Meal of the Day; locally confirm items and eligibility.
- Denny’s: https://dennys.com/rewards — personalized member offer discovery only, status `check`, no advertised price, excluded from alerts.

Burger King, Pizza Hut, Sonic and Popeyes pages yielded no usable promotion terms. Arby’s visible deal was for August, so it was not added as a current September offer.
