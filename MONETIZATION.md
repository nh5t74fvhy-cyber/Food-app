# MealRadar monetization — September 21, 2026

No ads, affiliate contracts, payment account, wallet, or revenue are active. No additional ChatGPT plugin is needed. The application never stores the owner's banking details.

## How the money would work

| Route | What earns money | What must exist first |
|---|---|---|
| AdSense display ads | Valid ad impressions, with revenue measured by eCPM; it is not a fixed payment for every website click | Approved publisher account and website, real publisher/ad-unit IDs, consent integration and payment verification |
| Affiliate restaurant or ordering links | The approved program's qualifying action, commonly a tracked sale; rules differ by advertiser | Network plus advertiser approval, permission for coupon/deal traffic, actual tracking links and disclosure |
| Direct local sponsorship | A restaurant pays an agreed fee for a labeled placement | A real sponsor, agreed campaign/price/dates, and an invoice/payment arrangement |

Ordinary links to McDonald's, Chili's or another restaurant do not create a payment obligation. Counting outbound clicks does not create an earnings balance. We have not confirmed any named chain accepts MealRadar into an affiliate program. Awin and CJ are places to inspect approved advertiser programs, not promises of admission or commission.

Suggested sequence: finish account onboarding; maintain accurate, useful original deal coverage; secure a suitable domain; apply for AdSense and relevant affiliate programs; activate only approved IDs and links; set up payments directly in the provider's account. A local sponsored placement is another option if a restaurant agrees to purchase one.

## Prepared in the code

`src/monetization.json` defaults to no sponsor and no affiliate links. The homepage has a labeled, separated sponsor slot that appears only when a valid HTTPS campaign with a future expiry is configured. Deal details keep the official source link and can additionally show a clearly disclosed partner link. Paid links use `rel="sponsored noopener noreferrer"`. No ads load or test clicks are sent.

Example configuration shape (replace only after approval; never invent a tracking link):

```json
{
  "sponsor": {
    "name": "Approved sponsor name",
    "title": "Approved campaign title",
    "description": "Accurate approved offer terms",
    "url": "https://approved-sponsor.example/offer",
    "endsAt": "2030-01-01T00:00:00Z"
  },
  "affiliateLinks": {
    "existing-deal-id": {
      "url": "https://approved-network.example/your-issued-tracking-link",
      "disclosure": "Paid link: MealRadar may earn a commission if you make a qualifying purchase."
    }
  }
}
```

Do not activate the example. Sponsorship payment collection is not implemented. Use the publisher/network payment account for affiliate/display earnings; a crypto wallet is not required for this plan.

## AdSense activation still required

AdSense itself is not installed because there is no approved publisher account or ad-unit ID. Before adding its script: obtain approval, publish an accurate privacy disclosure and required consent messages/CMP, implement request-specific nonce-based strict CSP according to Google's current guidance, add the account's authentic ads.txt record, then validate rendering without clicking ads. The present app CSP intentionally permits no third-party ad scripts. Do not weaken it just to display an unapproved ad.

The owner must supply truthful payee/country information and complete required identity, tax, address and payment steps within Google. For USD, Google's published payment threshold is $100, and the payment-method selection threshold is $10. These are thresholds, not expected earnings. Never click your own ads or encourage visitors to click to support the site.

## Illustrative math, not a forecast

At a hypothetical $5 page RPM, 10,000 page views would produce about $50: views / 1,000 × RPM. At a hypothetical $3 commission per approved order, 500 outbound visits × 2% qualifying conversion = 10 orders = $30 before reversals. Actual RPM, attribution, eligibility, geography, approvals and conversions can differ substantially, including zero revenue.

## Primary sources

- [Google: AdSense revenue share and eCPM](https://support.google.com/adsense/answer/180195?hl=en)
- [Google: account activation before ad setup](https://support.google.com/adsense/answer/7037624?hl=en)
- [Google: payment thresholds](https://support.google.com/adsense/answer/1709871?hl=en)
- [Google: AdSense policies](https://support.google.com/adsense/answer/48182?hl=en)
- [Google: strict CSP integration](https://support.google.com/adsense/answer/16283098?hl=en)
- [Awin: tracked links, sale commissions and payout methods](https://www.awin.com/us/publishers/content-creator-influencer)
- [CJ: publisher program](https://www.cj.com/publisher)

## Sponsorship offer to prepare once traffic is measurable

A proposed starter campaign could include one clearly labeled homepage placement for an agreed two-week period, an accurate link to the sponsor's offer, and a report based on measured activity. Quote pricing only after discussing the actual audience and deliverables; there is no verified traffic baseline yet. Do not promise orders or paid clicks. Prospects would be independent restaurants or authorized local franchise marketing teams serving the first launch city. The owner still needs to choose that city; no outreach has been sent and no sponsor is secured.

The domain remains the existing free Vercel address at the owner's request. MealRadar's public title and descriptions were improved, but search-engine indexing and ranking are not guaranteed.
