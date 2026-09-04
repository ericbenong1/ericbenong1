# Rungs launch checklist

Items marked **[Eric]** need a human (account, money, or posting under his name). Everything else Claude does.

## Before launch
- [ ] Play 3 daily puzzles + 2 unlimited on phone and desktop; note friction (Claude does a QA pass; Eric does a 5-minute play).
- [ ] Deploy to lovable.app (done by Claude this session; URL in STATUS.md).
- [ ] **[Eric]** Domain: buy `playrungs.com` or `rungs.app` (~$10–20/yr) and connect in Lovable → Settings → Domains. A real domain matters for Show HN and aggregators.
- [ ] **[Eric]** Set the contact email on the Privacy page (tell Claude which address).
- [ ] **[Eric]** Connect Stripe in Lovable (Settings → Integrations → Stripe). Then Claude wires `startProCheckout()` to a $3.99 one-time product with a refund line in Terms.

## Launch day (do these in this order)
- [ ] **[Eric]** Post Show HN (copy in `promo-copy.md`). Tuesday–Thursday, 8–10am Central is best.
- [ ] **[Eric]** Post to r/WebGames (copy in `promo-copy.md`). Do not post to r/wordle the same day; wait a week.
- [ ] **[Eric]** Submit to: Listdle (https://listdle.com/submit/), DleList (https://dlelist.com/), Puzzle Index (https://puzzle-index.com/), Alldle (https://www.alldle.net/all-dles), aukspot dles (PR to https://github.com/aukspot/dles — Claude can draft the PR text).
- [ ] **[Eric]** Email pitch to Thinky Games and Playlin (copy in `promo-copy.md`).
- [ ] Claude: watch analytics + `events` for 48h, fix bugs same day.

## Week 2+
- [ ] **[Eric]** Apply to Adsterra (no traffic minimum). When approved, paste the publisher/zone ID into Lovable env as `VITE_ADSENSE_CLIENT` (Claude will rename to a generic key) so ads switch on.
- [ ] **[Eric]** Ko-fi page (optional). Claude adds a "Buy me a coffee" link in the results modal for free users.
- [ ] Claude: weekly analytics review → one retention feature shipped → refreshed promo (see Routine).
- [ ] When Pro waitlist ≥ 40 emails and Stripe is live: Claude drafts the "Pro is live, 50% off for 72h" email; **[Eric]** sends it (Resend via Lovable or Gmail).

## Legal minimums (built in P0; Eric reviews once)
- [ ] Privacy page (localStorage, optional accounts, ads/analytics disclosure).
- [ ] Terms page with refund language once Stripe is live.
- [ ] Cookie consent banner appears only once ads/analytics cookies are enabled.
