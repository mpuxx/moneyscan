export const STRIPE_LINKS = {
  templates: import.meta.env.VITE_STRIPE_TEMPLATES || '',
  letters: import.meta.env.VITE_STRIPE_LETTERS || '',
  guided: import.meta.env.VITE_STRIPE_GUIDED || '',
}
export const FEATURES = {
  supabaseEnabled: !!import.meta.env.VITE_SUPABASE_URL,
  stripeEnabled: !!STRIPE_LINKS.letters,
  resendEnabled: !!import.meta.env.VITE_RESEND_KEY,
  claudeApiEnabled: !!import.meta.env.VITE_CLAUDE_KEY,
}
export const newsHeadlines = [
  'FCA confirms £7.5bn car finance compensation scheme — 30 March 2026',
  '12.1 million car finance agreements eligible — average payout £829',
  '46 tenants win £263,555 in rent repayment orders — March 2026',
  'Tenant awarded £10,000 for unprotected deposit — First-tier Tribunal',
  'Parking appeals succeed in 60% of cases — RAC Foundation',
  'HMRC owes millions in unclaimed marriage allowance — apply before April',
  'CMA fines AA £4.2 million for hidden fees — 80,000 customers refunded',
  'Mastercard £200m settlement approved — 46 million UK adults eligible',
  'Apple liable for App Store overcharging — Competition Appeal Tribunal',
  '1.6 million diesel drivers await £6bn judgment in UK High Court',
  'Which? certifies £3bn iCloud lock-in claim — 38.5 million users',
]
export const caseStudies = [
  { headline: '46 tenants win £263,555 in rent repayment orders', source: 'First-tier Tribunal', date: 'March 2026' },
  { headline: 'Tenant awarded £10,000 for unprotected deposit', source: 'Housing Act s.214', date: '2025' },
  { headline: 'Student house recovers £25,000 in banned fees', source: 'Tenant Fees Act', date: '2024' },
  { headline: 'Average car finance payout confirmed at £829', source: 'FCA PS26/3', date: 'March 2026' },
  { headline: 'AA fined £4.2M — 80,000 customers refunded for hidden fees', source: 'CMA Investigation', date: '2025' },
  { headline: 'Apple ruled to have overcharged 36 million UK users', source: 'Kent v Apple — CAT', date: '2026' },
  { headline: '£200m Mastercard settlement for 46 million UK adults', source: 'Merricks v Mastercard', date: '2025' },
  { headline: 'Diesel emissions: Mercedes, BMW, VW face £6bn UK claim', source: 'High Court group action', date: '2026' },
]
