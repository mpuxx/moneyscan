export const questions = [
  // Q1: RENT — 11M renters, highest hit rate, beginner's luck
  { id:'rent', question:'Do you rent from a private landlord?', amount:300, category:'Rental Claims', confirmation:'Rental Claims', lossFrame:'1 in 3 landlords break deposit rules. Tenants can claim up to 3x back.', microContext:'CHECKING RENTAL CLAIMS...', socialProof:'11 million people rent privately in England', color:'#6d5bd0', abbr:'R', youSaid:'You rent privately' },
  // Rent follow-ups
  { id:'deposit', question:'Did you pay a deposit when you moved in?', amount:1100, parentId:'rent', category:'Unprotected Deposit', confirmation:'Unprotected Deposit', lossFrame:'Your landlord had 30 days to protect it. If they didn’t, you could claim 1–3x the amount back.', microContext:'CHECKING DEPOSIT PROTECTION...', socialProof:'£515 million in deposits are still unprotected — Tenant Angels', color:'#6d5bd0', abbr:'D', youSaid:'You paid a rental deposit' },
  { id:'depositDeduct', question:'Did your landlord ever try to keep part of your deposit?', amount:400, parentId:'deposit', category:'Unfair Deposit Deductions', confirmation:'Unfair Deposit Deductions', lossFrame:'Landlords often deduct for normal wear and tear — which is illegal. You may be owed that money back.', microContext:'CHECKING DEDUCTION HISTORY...', socialProof:'Most deposit deductions for cleaning are not legally valid', color:'#6d5bd0', abbr:'DD', youSaid:'Your landlord deducted from your deposit' },
  { id:'fees', question:'Did you pay any fees to a letting agent?', amount:500, parentId:'rent', category:'Banned Tenant Fees', confirmation:'Banned Tenant Fees', lossFrame:'The Tenant Fees Act 2019 banned most letting fees. If you paid them after June 2019, you’re owed a refund.', microContext:'CHECKING TENANT FEES...', socialProof:'Letting fees were banned in June 2019', color:'#6d5bd0', abbr:'F', youSaid:'You paid letting agent fees' },
  { id:'hmo', question:'Do you share your home with 3 or more unrelated people?', amount:4100, parentId:'rent', category:'Rent Repayment Order', confirmation:'Rent Repayment Order (up to 24 months’ rent)', lossFrame:'If your house isn’t licensed as an HMO, you could claim back up to 2 years of rent.', microContext:'CHECKING HMO LICENSING...', socialProof:'46 tenants won £263,555 in rent repayment orders — March 2026', color:'#6d5bd0', abbr:'HMO', youSaid:'You live in a shared house (3+ people)' },

  // NEW: MASTERCARD INTERCHANGE FEES — near-universal hit (46M UK adults eligible)
  { id:'mastercard', question:'Were you an adult in the UK between 1992 and 2008?', amount:70, category:'Mastercard Retail Refund', confirmation:'Mastercard Retail Refund', lossFrame:'For 16 years, unlawful Mastercard fees pushed up UK shop prices. A £200 million settlement was approved for 46 million adults — you don’t need to have held a Mastercard.', microContext:'CHECKING MASTERCARD SETTLEMENT...', socialProof:'46 million UK adults eligible — Merricks v Mastercard settlement approved', color:'#3b82f6', abbr:'MC', youSaid:'You shopped in the UK 1992–2008' },

  // NEW: WATER COMPANY SEWAGE OVERCHARGE — 20M UK households
  { id:'water', question:'Do you pay a water bill?', amount:70, category:'Water Overcharge Refund', confirmation:'Water Overcharge Refund', lossFrame:'Opt-out collective actions allege water companies under-reported sewage leaks to justify higher bills. 20 million UK households are potentially eligible for a refund.', microContext:'CHECKING WATER COMPANY OVERCHARGE...', socialProof:'20 million UK households — £800m opt-out collective action', color:'#3b82f6', abbr:'WO', youSaid:'You pay a water bill' },

  // Q2: CAR FINANCE — 12.1M eligible, use real people's language
  { id:'carFinance', question:'Have you ever bought a car on monthly payments?', amount:830, category:'Car Finance Compensation', confirmation:'Car Finance Compensation', lossFrame:'The FCA confirmed 12.1 million car finance deals were mis-sold. You may not have been told the dealer was earning commission from your interest rate.', microContext:'CHECKING FCA CAR FINANCE DATA...', socialProof:'12.1 million agreements eligible — average payout £829', color:'#e8552e', abbr:'CF', youSaid:'You bought a car on finance' },

  // NEW: DIESEL EMISSIONS — 1.6M UK claimants, placed after car finance for logical grouping
  { id:'diesel', question:'Have you owned a diesel car in the last 15 years?', amount:3500, category:'Diesel Emissions Claim', confirmation:'Diesel Emissions Claim (NOx)', lossFrame:'High Court group actions allege Mercedes, BMW, VW, Ford and others used defeat devices. Judgment expected 2026 — potential payout in the thousands per vehicle.', microContext:'CHECKING DIESEL EMISSIONS LITIGATION...', socialProof:'1.6 million UK diesel owners in litigation — £6bn claimed', color:'#e8552e', abbr:'DE', youSaid:'You owned a diesel vehicle' },

  // Q3: MARRIAGE ALLOWANCE
  { id:'marriage', question:'Are you married or in a civil partnership?', amount:1260, category:'Marriage Allowance', confirmation:'Marriage Allowance (up to 4 years back)', lossFrame:'If one of you earns under £12,570 and the other is a basic rate taxpayer, you’re owed up to £1,260 backdated.', microContext:'CHECKING HMRC MARRIAGE ALLOWANCE...', socialProof:'2.4 million eligible couples don’t claim — HMRC', color:'#10B981', abbr:'MA', youSaid:'You are married/civil partnership' },

  // Q4: PENSION
  { id:'pension', question:'Does your employer take pension contributions from your pay?', amount:960, category:'Pension Tax Relief', confirmation:'Pension Tax Relief', lossFrame:'If you’re on a “net pay” pension scheme and earn under £12,570, you’ve been missing tax relief worth hundreds.', microContext:'CHECKING PENSION TAX RELIEF...', socialProof:'1.5 million low earners miss pension relief — HMRC', color:'#10B981', abbr:'PT', youSaid:'You have a workplace pension' },

  // Q5: TAX CODE
  { id:'taxCode', question:'Have you changed jobs in the last 4 years?', amount:1000, invertAnswer:true, category:'Tax Code Refund', confirmation:'Tax Code Refund', lossFrame:'When you start a new job, HMRC often puts you on an emergency tax code. You overpay and never get it back unless you ask.', microContext:'CHECKING PAYE TAX CODES...', socialProof:'HMRC repaid £990 million in tax code errors last year', hasThirdOption:'Not sure', color:'#10B981', abbr:'TC', youSaid:'You may have a tax code error' },

  // Q6: TRAVEL
  { id:'travel', question:'Do you travel to different locations for work (not just your commute)?', amount:1000, category:'Travel Expenses', confirmation:'Travel Expense Relief', lossFrame:'If you travel between work sites or to temporary workplaces, you can claim tax relief on every mile.', microContext:'CHECKING TRAVEL EXPENSE RELIEF...', socialProof:'Millions of UK workers under-claim travel relief', color:'#3b82f6', abbr:'TE', youSaid:'You travel for work' },

  // Q7: FLIGHTS
  { id:'flights', question:'Have you had a delayed or cancelled flight in the last 6 years?', amount:520, category:'Flight Compensation', confirmation:'Flight Compensation (EU261)', lossFrame:'If your flight was delayed 3+ hours or cancelled, you could be owed up to £520 per person. Most people never claim.', microContext:'CHECKING FLIGHT COMPENSATION...', socialProof:'85% of eligible passengers never claim — CAA', color:'#3b82f6', abbr:'FC', youSaid:'You had a delayed/cancelled flight' },

  // Q8: UNIFORM — updated language
  { id:'uniform', question:'Do you have to wear specific clothes, a uniform, or PPE for work?', amount:500, category:'Uniform Tax Relief', confirmation:'Uniform Tax Relief (up to 5 years)', lossFrame:'If you wash, repair, or replace work clothing yourself, you can claim tax relief for up to 5 years back.', microContext:'CHECKING UNIFORM TAX ALLOWANCE...', socialProof:'Millions eligible but only 15% claim — HMRC', color:'#3b82f6', abbr:'UT', youSaid:'You wear work clothing/uniform' },

  // Q9: COUNCIL TAX
  { id:'councilTax', question:'Do you live alone or with only students?', amount:500, category:'Council Tax Discount', confirmation:'Council Tax Discount', lossFrame:'Single occupants get 25% off. Student households pay nothing. Many people don’t know and overpay for years.', microContext:'CHECKING COUNCIL TAX ELIGIBILITY...', socialProof:'800,000 people overpay council tax — MoneySavingExpert', color:'#d4a017', abbr:'CT', youSaid:'You may qualify for council tax discount' },

  // Q10: WFH
  { id:'wfh', question:'Do you work from home at least some of the time?', amount:312, category:'Work From Home Relief', confirmation:'Work From Home Tax Relief', lossFrame:'If your employer requires you to work from home — even one day a week — you can claim £6/week tax relief.', microContext:'CHECKING WFH TAX RELIEF...', socialProof:'£312 per year if you work from home — HMRC', color:'#d4a017', abbr:'WFH', youSaid:'You work from home' },

  // Q11: PROFESSIONAL FEES
  { id:'profFees', question:'Do you pay for work memberships, subscriptions, or professional fees?', amount:200, category:'Professional Fees Relief', confirmation:'Professional Fees Tax Relief', lossFrame:'If you pay for professional body memberships required by your employer, you can claim the tax back.', microContext:'CHECKING PROFESSIONAL SUBSCRIPTIONS...', socialProof:'Over 600 HMRC-approved professional bodies', color:'#d4a017', abbr:'PF', youSaid:'You pay professional subscriptions' },

  // NEW: APPLE APP STORE — 36M UK users, liability already ruled
  { id:'apple', question:'Do you use an iPhone or iPad?', amount:50, category:'Apple App Store Compensation', confirmation:'Apple App Store Compensation', lossFrame:'The Competition Appeal Tribunal ruled Apple abused its dominance and overcharged UK users on App Store purchases. Liability has already been confirmed.', microContext:'CHECKING APPLE APP STORE CLAIM...', socialProof:'36 million UK Apple users — £1.5 billion claimed (Kent v Apple)', color:'#6d5bd0', abbr:'AS', youSaid:'You use Apple devices' },

  // NEW: GOOGLE PLAY STORE — 19.5M UK Android users, claim certified
  { id:'google', question:'Do you use an Android phone?', amount:50, category:'Google Play Store Compensation', confirmation:'Google Play Store Compensation', lossFrame:'A UK tribunal certified a claim that Google Play Store restrictions and commissions inflated the price of apps and in-app purchases.', microContext:'CHECKING GOOGLE PLAY CLAIM...', socialProof:'19.5 million UK Android users — over £1 billion claimed', color:'#10B981', abbr:'GP', youSaid:'You use Android devices' },

  // NEW: FACEBOOK/META — 45M UK users, claim proceeding
  { id:'facebook', question:'Have you ever had a Facebook account?', amount:50, category:'Meta Facebook Data Claim', confirmation:'Meta Facebook Data Claim', lossFrame:'A £2.1 billion UK claim alleges Meta exploited its market dominance and extracted unfair value from users’ personal data.', microContext:'CHECKING META DATA CLAIM...', socialProof:'45 million UK Facebook users — claim proceeding', color:'#3b82f6', abbr:'FB', youSaid:'You’ve used Facebook' },

  // Q12: CHILD TRUST FUND
  { id:'childTrust', question:'Were any of your children born between September 2002 and January 2011?', amount:2000, category:'Child Trust Fund', confirmation:'Child Trust Fund', lossFrame:'6 million Child Trust Funds are sitting unclaimed. Your child could have £2,000+ waiting for them.', microContext:'CHECKING CHILD TRUST FUND DATA...', socialProof:'6 million unclaimed funds worth £2,000+ each', color:'#e8552e', abbr:'CTF', youSaid:'You have eligible children' },
  { id:'childTrustCount', question:'How many children born in that period?', isMultiChoice:true, options:['1','2','3+'], parentId:null, microContext:'CALCULATING CHILD TRUST FUND VALUE...', lossFrame:'Each child could have a fund worth £2,000+.' },

  // Q13: PARKING — updated language
  { id:'parking', question:'Have you ever been fined for parking at a supermarket, hospital, or car park?', amount:100, category:'Parking Fine Appeal', confirmation:'Parking Fine Appeal', lossFrame:'Private parking fines are often unenforceable. Nearly half of people who appeal get the charge dropped entirely.', microContext:'CHECKING PARKING APPEAL ELIGIBILITY...', socialProof:'50% of private parking appeals succeed — POPLA', color:'#e8552e', abbr:'PK', youSaid:'You received a parking fine' },

  // Q14: PPI TAX
  { id:'ppiTax', question:'Did you ever receive a PPI payout?', amount:200, category:'PPI Tax Refund', confirmation:'PPI Tax Refund', lossFrame:'20% tax was automatically deducted from every PPI payout. If you’re a basic rate taxpayer, you’re owed it back.', microContext:'CHECKING PPI TAX RECLAIM...', socialProof:'£1 billion in PPI tax still unclaimed — HMRC', color:'#e8552e', abbr:'PPI', youSaid:'You received a PPI payout' },

  // Q15: PAYE QUALIFIER
  { id:'paye', question:'Are you employed (paid through PAYE)?', amount:0, isQualifier:true, lossFrame:'PAYE employees are the most likely to have unclaimed tax reliefs and allowances.', microContext:'CONFIRMING EMPLOYMENT STATUS...', socialProof:'31 million PAYE employees in the UK' },

  // Q16: DRIP PRICING REFUNDS — CMA investigation, Digital Markets Act 2024
  { id:'dripPricing', question:'Have you bought driving lessons, gym memberships, event tickets, or appliances online?', amount:200, category:'Drip Pricing Refund', confirmation:'Drip Pricing Refund', lossFrame:'The CMA is investigating companies that add hidden fees at checkout. AA was fined £4.2 million and refunded 80,000 customers. You may be owed money back.', microContext:'CHECKING CMA DRIP PRICING CASES...', socialProof:'Half of online businesses use hidden fees — CMA investigation 2025', color:'#e8552e', abbr:'DP', youSaid:'You may have paid hidden checkout fees' },
]
