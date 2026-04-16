import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadScan, formatMoney, getOrCreateRefCode, saveEmail, isDiscountActive, getTimeRemaining, clearScan, markResultsVisited, isReturnVisitor } from '../utils/helpers'
import { caseStudies, STRIPE_LINKS } from '../config'

// Generic letter preview generator — works for ANY claim category, no wrong-content bugs
function generatePreview(claim) {
  const cat = claim?.category || 'Consumer Refund'
  const previews = {
    'Car Finance Compensation': 'Dear Sir/Madam,\n\nFollowing the FCA’s confirmation of the motor finance redress scheme (PS26/3, 30 March 2026), I write regarding my motor finance agreement which I believe was affected by undisclosed discretionary commission arrangements.\n\nUnder the FCA’s scheme rules I am entitled to compensation. Please confirm my eligibility...',
    'Unprotected Deposit': 'Dear Sir/Madam,\n\nUnder the Housing Act 2004, you were required to protect my deposit in a government-approved scheme within 30 days of receipt and provide me with prescribed information.\n\nI have received no evidence that this was done. Under Section 214 of the Housing Act 2004, I may be entitled to between one and three times the deposit amount...',
    'Child Trust Fund': 'Dear Sir/Madam,\n\nI am writing on behalf of my child who was born during the eligible Child Trust Fund period (1 September 2002 — 2 January 2011). HMRC records indicate a Child Trust Fund was opened in their name.\n\nPlease confirm the current account holder and value of this fund...',
    'Marriage Allowance': 'Dear HMRC,\n\nI write to claim Marriage Allowance under the Income Tax Act 2007, backdated for the previous four tax years where eligible.\n\nMy spouse and I meet the qualifying conditions...',
    'Diesel Emissions Claim': 'Dear Sir/Madam,\n\nI am writing regarding my diesel vehicle, which I believe was fitted with a defeat device designed to give false emissions readings during testing.\n\nThis constitutes a breach of the Consumer Protection from Unfair Trading Regulations 2008. I reserve the right to join existing UK group litigation...',
    'Parking Fine Appeal': 'Dear Sir/Madam,\n\nI formally appeal Parking Charge Notice [reference] under the Protection of Freedoms Act 2012 and the BPA Code of Practice.\n\nI dispute this charge on the following grounds: inadequate signage, unclear terms, and disproportionate amount...',
    'Tax Code Refund': 'Dear HMRC,\n\nI request a review of my PAYE tax code for the past four tax years. I believe I have been placed on emergency or incorrect codes resulting in overpayment of income tax...',
    'Mastercard Retail Refund': 'Registration Notice\n\nYou are automatically included in the Merricks v Mastercard collective action settlement (£200m, approved 2025).\n\nVisit the official scheme registration portal listed below to claim your share. Estimated payment: up to £70 per UK adult shopper...',
    'Apple App Store Compensation': 'Registration Notice\n\nThe Competition Appeal Tribunal found Apple liable in Kent v Apple (2026). UK iPhone and iPad users are automatically included in the class.\n\nNo opt-in action is required at this stage. Distribution will follow the damages hearing...',
    'Google Play Store Compensation': 'Registration Notice\n\nA UK Competition Appeal Tribunal certified collective action against Google for Play Store overcharging (Coll v Google).\n\nAs a UK Android user you are included in the class. Stay informed at the scheme website below...',
    'Meta Facebook Data Claim': 'Registration Notice\n\nA £2.1bn UK collective action against Meta for misuse of personal data is proceeding. UK Facebook users are within the proposed class.\n\nNo immediate action required — this notice confirms your inclusion...',
    'Water Overcharge Refund': 'Registration Notice\n\nOpt-out collective actions are filed against UK water companies for under-reporting sewage leaks to inflate bills. As a UK water bill payer you are automatically included unless you opt out...',
    'Drip Pricing Refund': 'Dear Sir/Madam,\n\nI write regarding charges I paid which I believe included undisclosed or misleading fees, contrary to the Consumer Rights Act 2015 and CMA enforcement under the Digital Markets, Competition and Consumers Act 2024...',
    'Banned Tenant Fees': 'Dear Sir/Madam,\n\nUnder the Tenant Fees Act 2019 you may charge tenants only certain permitted fees. I believe I was charged prohibited fees, which I now formally request you refund...',
    'Rent Repayment Order': 'Dear Sir/Madam,\n\nI write to give notice of intent to apply for a Rent Repayment Order under the Housing and Planning Act 2016 in respect of my tenancy. I have reason to believe the property required HMO licensing which has not been obtained...',
    'Flight Compensation (EU261)': 'Dear Sir/Madam,\n\nI am claiming compensation under retained EU Regulation 261/2004 for a flight delay/cancellation in respect of which I have not yet received the compensation due...',
    'Uniform Tax Relief (up to 5 years)': 'Dear HMRC,\n\nI claim flat rate tax relief for the cost of laundering and maintaining specialist work clothing under section 367 of the Income Tax (Earnings and Pensions) Act 2003, for the past four tax years...',
    'Council Tax Discount': 'Dear Council Tax Department,\n\nI am writing to apply for the Single Person Discount under section 11 of the Local Government Finance Act 1992, backdated to the start of my eligibility...',
    'Work From Home Tax Relief': 'Dear HMRC,\n\nI am writing to claim tax relief on additional household expenses incurred while working from home, under section 336 of the Income Tax (Earnings and Pensions) Act 2003...',
    'Pension Tax Relief': 'Dear HMRC,\n\nI am writing to claim outstanding tax relief on pension contributions made through a net pay arrangement scheme, where my earnings fell below the personal allowance threshold...',
    'PPI Tax Refund': 'Dear HMRC,\n\nI am writing to reclaim the income tax that was automatically deducted from a PPI compensation payout I received. As a basic rate taxpayer I am entitled to use my Personal Savings Allowance against this...',
    'Travel Expense Relief': 'Dear HMRC,\n\nI am writing to claim tax relief on business travel expenses incurred over the past four tax years, including mileage to temporary workplaces under section 339 ITEPA 2003...',
    'Professional Fees Tax Relief': 'Dear HMRC,\n\nI am writing to claim tax relief under section 343 ITEPA 2003 for professional subscriptions and fees paid to HMRC-approved professional bodies relevant to my employment...',
    'Unfair Deposit Deductions': 'Dear Sir/Madam,\n\nI dispute the deductions made from my tenancy deposit. Under the prescribed adjudication rules of [DPS/MyDeposits/TDS], I formally request a full review and refund of any deductions made for normal wear and tear...',
  }
  if (previews[cat]) return previews[cat]
  // Generic fallback
  return `Dear Sir/Madam,\n\nI am writing to make a formal claim in respect of ${cat}. I believe I am entitled to compensation under the relevant UK consumer protection legislation.\n\nPlease treat this as a formal request and respond within 8 weeks as required by the relevant statutory framework...`
}

export default function Results(){
  const nav = useNavigate()
  const scan = loadScan()
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [timer, setTimer] = useState(getTimeRemaining())
  const [copied, setCopied] = useState(false)
  const [showFreeLetter, setShowFreeLetter] = useState(false)
  const refCode = getOrCreateRefCode()
  const refLink = 'https://moneyscan.app/?ref=' + refCode
  const returnVisitor = isReturnVisitor()

  useEffect(() => { markResultsVisited() }, [])
  useEffect(() => { const i = setInterval(() => setTimer(getTimeRemaining()), 1000); return () => clearInterval(i) }, [])

  // Show recovery free letter offer after 30s if user hasn't acted
  useEffect(() => {
    const t = setTimeout(() => setShowFreeLetter(true), 30000)
    return () => clearTimeout(t)
  }, [])

  // No scan? Show capture screen
  if (!scan?.claims?.length) {
    return <div className="page" style={{paddingTop:40, textAlign:'center'}}>
      <h2 style={{fontSize:22, marginBottom:8, fontWeight:700}}>No claims found right now.</h2>
      <p style={{color:'var(--text-mid)', marginBottom:20}}>New schemes open regularly. Get notified.</p>
      <input className="input" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} style={{marginBottom:8, textAlign:'center'}}/>
      <button className="cta" onClick={()=>{ saveEmail(email); setEmailSent(true) }}>Alert me when new claims open</button>
      {emailSent && <p style={{color:'var(--green)', marginTop:8, fontWeight:600}}>Saved.</p>}
    </div>
  }

  const { total, claims } = scan
  const discount = isDiscountActive()
  const topClaim = claims[0]
  const topLetter = generatePreview(topClaim)
  // Solicitor anchor: real cost would be £200/letter
  const solicitorCost = claims.length * 200

  // FCA deadline — accurate framing per PS26/3
  const fcaDate = new Date('2026-06-30T23:59:59')
  const daysToFCA = Math.max(0, Math.floor((fcaDate - new Date()) / 86400000))

  // WhatsApp share messages
  const msgs = {
    partner: `Babe — I just checked and we might be owed ${formatMoney(total)}. Free 60-second check: ${refLink}`,
    parent: `Mum/Dad — you might be owed money from car finance (avg £829). Free scan: ${refLink}`,
    friend: `Have you ever had car finance or paid rent? Free 60-sec check: ${refLink}`,
  }

  return <>
    {/* ============ HEADER ============ */}
    <div className="header">
      <span className="header-timer">{discount && timer ? '50% off ends in ' + timer : ''}</span>
      <span className="header-logo">MoneyScan<span className="dot"/></span>
      <a href="#claim" className="header-cta">Claim now</a>
    </div>

    <div className="page" style={{paddingBottom:32}}>

      {/* ============ RETURN VISITOR BANNER ============ */}
      {returnVisitor && <div className="recovery-banner">
        <p><strong>Welcome back.</strong> Your {formatMoney(total)} claim is still waiting.</p>
        <a href={STRIPE_LINKS.letters || '#claim'} className="cta sm">All {claims.length} letters — £19.99 today only</a>
      </div>}

      {/* ============ HERO: PERSONALISED RESULT ============ */}
      <div className="results-hero" style={{paddingTop:20}}>
        <div className="results-label">Your personalised scan results</div>
        <div className="results-subtitle">You may be owed</div>
        <div className="results-total">{formatMoney(total)}</div>
        <div className="results-count">across {claims.length} separate claims</div>
        <div className="results-tagline">Claim what's yours.</div>
      </div>

      {/* ============ ALL CLAIMS VISIBLE (no hiding) ============ */}
      <div style={{margin:'18px 0 24px'}}>
        <div style={{fontSize:13, color:'var(--text-mid)', textAlign:'center', marginBottom:10, fontWeight:600}}>
          What we found for you:
        </div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(56px,1fr))', gap:6}}>
          {claims.map(c => (
            <div key={c.id} title={c.category + ' (~' + formatMoney(c.amount) + ')'}
                 style={{background:c.color, color:'#fff', padding:'10px 4px', borderRadius:8, textAlign:'center', fontSize:11, fontWeight:700}}>
              <div style={{fontSize:10, opacity:.85}}>{c.abbr}</div>
              <div style={{fontSize:11, marginTop:2}}>~{formatMoney(c.amount)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ============ THE PRIMARY DECISION (single CTA) ============ */}
      <div id="claim" style={{background:'#fff', border:'2px solid var(--green)', borderRadius:16, padding:'20px 16px', boxShadow:'0 8px 32px rgba(13,155,106,.15)', position:'relative'}}>
        <div style={{position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)', background:'var(--green)', color:'#fff', padding:'4px 14px', borderRadius:99, fontSize:11, fontWeight:700, letterSpacing:'.5px'}}>
          MOST POPULAR
        </div>

        {/* Big anchor */}
        <div style={{textAlign:'center', marginBottom:14}}>
          <div style={{fontSize:13, color:'var(--text-light)', marginBottom:4}}>A solicitor would charge</div>
          <div style={{fontSize:24, color:'var(--text-mid)', textDecoration:'line-through', fontWeight:600}}>{formatMoney(solicitorCost)}+</div>
        </div>

        {/* Price */}
        <div style={{textAlign:'center', marginBottom:6}}>
          <div style={{fontSize:13, color:'var(--green)', fontWeight:700, marginBottom:2}}>You pay today</div>
          <div style={{display:'inline-flex', alignItems:'baseline', gap:8}}>
            {discount && <span style={{fontSize:18, color:'var(--text-light)', textDecoration:'line-through'}}>£59.99</span>}
            <span style={{fontSize:42, color:'var(--green)', fontWeight:700, letterSpacing:'-1px'}}>£29.99</span>
          </div>
        </div>

        {discount && timer && <div style={{textAlign:'center', fontSize:12, color:'var(--orange)', fontWeight:700, marginBottom:14}}>
          50% off ends in {timer}
        </div>}

        {/* Primary CTA */}
        <a href={STRIPE_LINKS.letters || '#claim'} className="cta lg" style={{width:'100%', textAlign:'center', display:'block'}}>
          Send me my {claims.length} letters
        </a>

        {/* Inline trust */}
        <div style={{display:'flex', justifyContent:'center', gap:6, flexWrap:'wrap', marginTop:12}}>
          <span style={{fontSize:10, color:'var(--text-mid)', background:'var(--bg-off)', padding:'4px 8px', borderRadius:5, border:'1px solid var(--border)'}}>🔒 Stripe secure</span>
          <span style={{fontSize:10, color:'var(--text-mid)', background:'var(--bg-off)', padding:'4px 8px', borderRadius:5, border:'1px solid var(--border)'}}> Apple Pay</span>
          <span style={{fontSize:10, color:'var(--text-mid)', background:'var(--bg-off)', padding:'4px 8px', borderRadius:5, border:'1px solid var(--border)'}}>📋 ICO ZC106075</span>
          <span style={{fontSize:10, color:'var(--text-mid)', background:'var(--bg-off)', padding:'4px 8px', borderRadius:5, border:'1px solid var(--border)'}}>💰 30-day refund</span>
        </div>

        <div style={{textAlign:'center', fontSize:11, color:'var(--text-light)', marginTop:10}}>
          One-time payment · No subscription · No success fees
        </div>
      </div>

      {/* ============ NOW vs AFTER (proper loss aversion framing) ============ */}
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:20}}>
        <div style={{background:'#fef2f2', border:'2px solid #fca5a5', borderRadius:12, padding:'14px 10px', textAlign:'center'}}>
          <div style={{fontSize:10, fontWeight:700, color:'#dc2626', letterSpacing:'.5px', textTransform:'uppercase'}}>Right now</div>
          <div style={{fontSize:11, color:'var(--text-mid)', marginTop:4}}>In their pocket</div>
          <div style={{fontSize:24, fontWeight:700, color:'#dc2626', marginTop:6, letterSpacing:'-.3px'}}>{formatMoney(total)}</div>
          <div style={{fontSize:10, color:'var(--text-light)', marginTop:4}}>that's yours</div>
        </div>
        <div style={{background:'#f0fdf4', border:'2px solid var(--green)', borderRadius:12, padding:'14px 10px', textAlign:'center'}}>
          <div style={{fontSize:10, fontWeight:700, color:'var(--green)', letterSpacing:'.5px', textTransform:'uppercase'}}>After you claim</div>
          <div style={{fontSize:11, color:'var(--text-mid)', marginTop:4}}>In YOUR pocket</div>
          <div style={{fontSize:24, fontWeight:700, color:'var(--green)', marginTop:6, letterSpacing:'-.3px'}}>{formatMoney(total)}</div>
          <div style={{fontSize:10, color:'var(--text-light)', marginTop:4}}>where it belongs</div>
        </div>
      </div>

      {/* ============ FCA DEADLINE (accurate framing) ============ */}
      <div style={{background:'#fff7ed', border:'1px solid #fed7aa', borderRadius:12, padding:'14px 16px', marginTop:18, textAlign:'center'}}>
        <div style={{fontSize:11, color:'var(--orange)', fontWeight:700, letterSpacing:'.5px', textTransform:'uppercase'}}>
          Car finance scheme
        </div>
        <div style={{fontSize:22, fontWeight:700, color:'var(--orange)', margin:'4px 0'}}>
          {daysToFCA} days to be paid in 2026
        </div>
        <div style={{fontSize:12, color:'var(--text-mid)'}}>
          Complain by 30 June 2026 to be paid this year. After that you wait until 2027.
        </div>
      </div>

      {/* ============ LETTER PREVIEW (Zeigarnik gap) ============ */}
      <div style={{marginTop:24}}>
        <h3 style={{fontSize:16, fontWeight:700, marginBottom:10}}>Preview: Your {topClaim?.category} letter</h3>
        <div style={{background:'#fff', border:'1px solid var(--border)', borderLeft:'4px solid var(--green)', borderRadius:12, padding:18}}>
          <div style={{fontFamily:'Georgia, serif', fontSize:13, color:'var(--text)', lineHeight:1.6, whiteSpace:'pre-line'}}>{topLetter}</div>
          <div style={{fontFamily:'Georgia, serif', fontSize:13, color:'var(--text)', lineHeight:1.6, filter:'blur(4px)', userSelect:'none', marginTop:8}}>
            Furthermore, the schedule of compensation calculation should follow the methodology set out in section 4 of the relevant policy statement, including statutory interest at 8% per annum from the date of original payment to the date of restitution.
          </div>
          <div style={{fontSize:11, color:'var(--green)', fontWeight:600, marginTop:12, textAlign:'right'}}>
            Letter 1 of {claims.length} · Unlock above ↑
          </div>
        </div>
      </div>

      {/* ============ SECONDARY OPTIONS (subdued visual weight) ============ */}
      <div style={{marginTop:28}}>
        <div style={{textAlign:'center', fontSize:12, color:'var(--text-light)', marginBottom:10, fontWeight:600, letterSpacing:'.5px', textTransform:'uppercase'}}>
          Or choose a different option
        </div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
          <a href={STRIPE_LINKS.templates || '#claim'} style={{textDecoration:'none', background:'#fff', border:'1px solid var(--border)', borderRadius:10, padding:'14px 10px', textAlign:'center'}}>
            <div style={{fontSize:11, color:'var(--text-mid)', fontWeight:600}}>Templates with brackets</div>
            <div style={{fontSize:18, color:'var(--text)', fontWeight:700, marginTop:4}}>£6.99</div>
            <div style={{fontSize:10, color:'var(--green)', fontWeight:600, marginTop:4}}>Continue →</div>
          </a>
          <a href={STRIPE_LINKS.guided || '#claim'} style={{textDecoration:'none', background:'#fff', border:'1px solid var(--border)', borderRadius:10, padding:'14px 10px', textAlign:'center'}}>
            <div style={{fontSize:11, color:'var(--text-mid)', fontWeight:600}}>Guided + ombudsman</div>
            <div style={{fontSize:18, color:'var(--text)', fontWeight:700, marginTop:4}}>£99.99</div>
            <div style={{fontSize:10, color:'var(--green)', fontWeight:600, marginTop:4}}>Continue →</div>
          </a>
        </div>
      </div>

      {/* ============ FREE LETTER RECOVERY (after 30s only) ============ */}
      {showFreeLetter && !emailSent && <div style={{background:'#f0fdf4', border:'1px dashed var(--green)', borderRadius:12, padding:18, marginTop:24}}>
        <div style={{fontSize:14, fontWeight:700, color:'var(--green)', textAlign:'center', marginBottom:6}}>
          Not ready to buy? Take one letter free.
        </div>
        <div style={{fontSize:12, color:'var(--text-mid)', textAlign:'center', marginBottom:12}}>
          We'll email your top {topClaim?.category} letter at no cost.
        </div>
        <input className="input" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} type="email" style={{marginBottom:8, textAlign:'center'}}/>
        <button className="cta outline sm" style={{width:'100%'}} onClick={()=>{ if(!email.includes('@')) return; saveEmail(email); setEmailSent(true) }}>
          Email me my free letter
        </button>
      </div>}
      {emailSent && <div style={{background:'#f0fdf4', border:'1px solid var(--green)', borderRadius:12, padding:14, marginTop:14, textAlign:'center'}}>
        <div style={{color:'var(--green)', fontWeight:700, fontSize:14}}>Check your inbox</div>
        <div style={{fontSize:12, color:'var(--text-mid)', marginTop:4}}>Your free letter is on its way.</div>
      </div>}

      {/* ============ REAL CASES ============ */}
      <h3 style={{fontSize:16, fontWeight:700, margin:'28px 0 10px'}}>Real UK cases. Real money back.</h3>
      {caseStudies.slice(0, 4).map((cs, i) => (
        <div key={i} style={{background:'#fff', border:'1px solid var(--border)', borderRadius:10, padding:'12px 14px', marginBottom:8}}>
          <div style={{fontSize:13, fontWeight:700, color:'var(--navy)', lineHeight:1.4}}>{cs.headline}</div>
          <div style={{fontSize:11, color:'var(--text-light)', marginTop:3}}>{cs.source} · {cs.date}</div>
        </div>
      ))}

      {/* ============ FAQ — addresses objections ============ */}
      <div style={{marginTop:24}}>
        <h3 style={{fontSize:16, fontWeight:700, marginBottom:12}}>Common questions</h3>
        {[
          ['Will I really get this money?', 'These are real UK schemes (FCA, HMRC, tribunals). Many people are eligible but never claim. Our letters give you the wording most likely to succeed.'],
          ['What if no claim works?', '30-day money-back guarantee. If none of your letters lead to a valid claim path, we refund you in full.'],
          ['Are you a claims management company?', 'No. We charge a one-time fee for the letters. We never take a success fee. You keep 100% of what you claim.'],
          ['Why £29.99 not free?', 'A solicitor charges £200+ per letter. We charge once, no subscriptions, no commission, no cold calls.'],
        ].map(([q, a]) => (
          <details key={q} style={{borderBottom:'1px solid var(--border)', padding:'10px 0'}}>
            <summary style={{fontSize:13, fontWeight:600, cursor:'pointer', color:'var(--navy)'}}>{q}</summary>
            <div style={{fontSize:13, color:'var(--text-mid)', marginTop:6, lineHeight:1.5}}>{a}</div>
          </details>
        ))}
      </div>

      {/* ============ FINAL CTA REPEAT ============ */}
      <a href={STRIPE_LINKS.letters || '#claim'} className="cta lg" style={{marginTop:24, display:'block', textAlign:'center'}}>
        Send me my {claims.length} letters — £29.99
      </a>

      {/* ============ HOUSEHOLD SHARE (post-decision viral mechanic) ============ */}
      <div style={{marginTop:32, padding:'20px 16px', background:'var(--bg-off)', borderRadius:12}}>
        <div style={{textAlign:'center', fontSize:14, fontWeight:700, marginBottom:6}}>Check for your whole household</div>
        <div style={{textAlign:'center', fontSize:12, color:'var(--text-mid)', marginBottom:14}}>Each adult could be owed thousands.</div>
        <div style={{display:'flex', flexDirection:'column', gap:6}}>
          <a className="wa-btn" style={{fontSize:14, padding:12}} href={'https://wa.me/?text=' + encodeURIComponent(msgs.partner)} target="_blank" rel="noopener">Send to your partner</a>
          <a className="wa-btn" style={{fontSize:14, padding:12, background:'#128C7E'}} href={'https://wa.me/?text=' + encodeURIComponent(msgs.parent)} target="_blank" rel="noopener">Send to a parent</a>
          <a className="wa-btn" style={{fontSize:14, padding:12, background:'#075E54'}} href={'https://wa.me/?text=' + encodeURIComponent(msgs.friend)} target="_blank" rel="noopener">Share with a friend</a>
        </div>
        <div style={{textAlign:'center', marginTop:10}}>
          <button className="copy-btn" onClick={() => { navigator.clipboard?.writeText(refLink); setCopied(true); setTimeout(() => setCopied(false), 2000) }}>
            {copied ? 'Copied!' : 'Copy your referral link'}
          </button>
          <div style={{fontSize:11, color:'var(--text-light)', marginTop:4}}>Your friend also gets a free letter</div>
        </div>
      </div>

      <div style={{textAlign:'center', margin:'18px 0'}}>
        <span style={{fontSize:13, color:'var(--green)', cursor:'pointer', fontWeight:600}} onClick={() => { clearScan(); nav('/') }}>
          Scan for someone else →
        </span>
      </div>

      <div className="trust-footer">
        One-time payment. No subscriptions. No cold calls.<br/>
        ICO reg. ZC106075 · CivicStack Ltd 17099189<br/>
        <a href="/how-it-works">How it works</a> · <a href="/refund">Refund policy</a> · <a href="mailto:hello@moneyscan.app">Contact</a>
      </div>
    </div>

    <div className="footer">
      <div className="footer-brand">MoneyScan</div>
      <div className="footer-tagline">Claim what's yours.</div>
      <div className="footer-legal">
        CivicStack Ltd (17099189) · ICO: ZC106075<br/>
        Information and templates only. Not financial or legal advice.
      </div>
    </div>
  </>
}
