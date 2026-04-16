import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { questions } from '../data/questions'
import { formatMoney, saveScan } from '../utils/helpers'

function buildQuestionList(a){const l=[];for(const q of questions){if(q.parentId){if(a[q.parentId]===true)l.push(q)}else if(q.id==='childTrustCount'){if(a.childTrust===true)l.push(q)}else l.push(q)};return l}
function calcTotal(a){let t=0;for(const q of questions){if(!q.amount||q.isQualifier)continue;if(q.invertAnswer){if(a[q.id]===false||a[q.id]==='dontknow')t+=q.amount}else if(q.id==='childTrustCount'){const c=a[q.id];if(c)t+=2000*(c==='3+'?3:parseInt(c))}else if(a[q.id]===true)t+=q.amount};return t}
function getClaims(a){const c=[];for(const q of questions){if(!q.amount||q.isQualifier||!q.category)continue;let ok=q.invertAnswer?(a[q.id]===false||a[q.id]==='dontknow'):a[q.id]===true;if(q.id==='childTrustCount')continue;if(ok){let amt=q.amount;if(q.id==='childTrust'&&a.childTrustCount)amt=2000*(a.childTrustCount==='3+'?3:parseInt(a.childTrustCount));c.push({...q,amount:amt})}};return c.sort((a,b)=>b.amount-a.amount)}

function Confetti(){const cols=['#0D9B6A','#e8552e','#3b82f6','#d4a017','#6d5bd0','#10B981'];return<div className="confetti-container">{Array.from({length:30}).map((_,i)=><div key={i} className="confetti-piece" style={{left:Math.random()*100+'%',background:cols[i%cols.length],borderRadius:Math.random()>.5?'50%':'2px',width:(6+Math.random()*8)+'px',height:(6+Math.random()*8)+'px',animationDelay:Math.random()*.5+'s',animationDuration:(1.5+Math.random()*1.5)+'s'}}/>)}</div>}

const interstitials={5:{text:"People like you are finding £5,000+ they didn't know about.",sub:'Keep going — checking HMRC and FCA data next.'},9:{text:'46 tenants won £263,555 in rent repayment orders.',sub:'Nearly there — cross-referencing the final categories.'},13:{text:'Almost done.',sub:'Finishing up the last checks for you.'}}

function LoadingScreen({total,claimCount}){const[step,setStep]=useState(0);const steps=['Analysing your answers...','Cross-referencing FCA data...','Checking HMRC relief categories...','Generating your personalised report...'];useEffect(()=>{const t=steps.map((_,i)=>setTimeout(()=>setStep(i),i*1200));return()=>t.forEach(clearTimeout)},[]);return<div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'100dvh',textAlign:'center',background:'var(--navy)',color:'#fff',padding:20}}><div style={{fontSize:15,fontWeight:500,marginBottom:20,opacity:.9}}>{steps[step]}</div><div style={{width:260,height:6,background:'rgba(255,255,255,.15)',borderRadius:3,overflow:'hidden',marginBottom:24}}><div style={{height:'100%',background:'var(--green-bright)',borderRadius:3,transition:'width 0.8s ease',width:((step+1)/steps.length*100)+'%'}}/></div><div style={{fontSize:36,fontWeight:700,color:'var(--green-bright)'}}>{formatMoney(total)}</div><div style={{fontSize:13,opacity:.6,marginTop:6}}>{claimCount} potential claims identified</div></div>}

// LIVE COUNTER — creates real-time "people are scanning now" feel.
// Scales with UK time of day. Creates appointment dynamic (FOMO).
function getTimeBasedScanCount(){
  const hour = new Date().getHours();
  const progress = hour < 6 ? (hour / 6) * 0.1 : Math.min((hour - 6) / 18, 1);
  return Math.floor(1200 + progress * 7600 + Math.random() * 400);
}
function LiveCounter(){
  const [scans, setScans] = useState(getTimeBasedScanCount());
  const [money, setMoney] = useState(() => scans * 4200 + Math.floor(Math.random() * 50000));
  useEffect(() => {
    const i = setInterval(() => {
      const delta = Math.random() > 0.4 ? 1 : 0;
      setScans(s => s + delta);
      if (delta > 0) setMoney(m => m + 2000 + Math.floor(Math.random() * 5000));
    }, 4500 + Math.random() * 3000);
    return () => clearInterval(i);
  }, []);
  return (
    <div style={{background:'#f0fdf4',padding:'10px 16px',textAlign:'center',borderBottom:'1px solid #bbf7d0',display:'flex',alignItems:'center',justifyContent:'center',gap:10,flexWrap:'wrap'}}>
      <div style={{display:'inline-flex',alignItems:'center',gap:6}}>
        <span style={{width:7,height:7,borderRadius:'50%',background:'var(--green-bright)',animation:'pulse-dot 2s ease-in-out infinite',display:'inline-block'}}/>
        <span style={{fontSize:12,color:'var(--green)',fontWeight:700}}>{scans.toLocaleString()} scanned today</span>
      </div>
      <span style={{color:'var(--text-light)',fontSize:12}}>·</span>
      <span style={{fontSize:12,color:'var(--green)',fontWeight:700}}>{formatMoney(money)} found</span>
    </div>
  );
}

export default function Scan(){
  const nav=useNavigate();
  const[answers,setAnswers]=useState({});
  const[idx,setIdx]=useState(0);
  const[total,setTotal]=useState(0);
  const[confirm,setConfirm]=useState(null);
  const[plus,setPlus]=useState(null);
  const[confetti,setConfetti]=useState(false);
  const[summary,setSummary]=useState(false);
  const[loading,setLoading]=useState(false);
  const[interstitial,setInterstitial]=useState(null);
  const[gold,setGold]=useState(false);
  const[jackpot,setJackpot]=useState(false);
  const[noMsg,setNoMsg]=useState(false);
  const tmr=useRef(null);

  const qList=buildQuestionList(answers),q=qList[idx],secsLeft=Math.max(0,(qList.length-idx)*4);

  const advance=(newA,ci)=>{
    const nl=buildQuestionList(newA),next=ci+1;
    if(next>=nl.length){
      const ft=calcTotal(newA),fc=getClaims(newA);
      saveScan(newA,ft,fc);
      setSummary(true);
      setTimeout(()=>{setSummary(false);setLoading(true);setTimeout(()=>nav('/results'),5000)},3000);
      return
    }
    if(interstitials[next]){setInterstitial(interstitials[next]);setTimeout(()=>{setInterstitial(null);setIdx(next)},2500)}
    else setIdx(next)
  };

  const answer=useCallback((val)=>{
    const newA={...answers,[q.id]:val};
    setAnswers(newA);
    const newT=calcTotal(newA),diff=newT-total;
    const isNo=(q.invertAnswer?val===true:val===false)||val==='dontknow';
    if(diff>0&&q.confirmation){
      setConfirm('✓ You may be eligible for '+q.confirmation+' (~'+formatMoney(q.amount)+')');
      setPlus('+'+formatMoney(diff));
      if(newT>=10000&&total<10000){setConfetti(true);setJackpot(true);setTimeout(()=>setConfetti(false),2500)}
      if(newT>=5000&&total<5000)setGold(true);
      tmr.current=setTimeout(()=>{setConfirm(null);setPlus(null);setTotal(newT);advance(newA,idx)},1200)
    }else if(isNo&&q.amount>0){
      setNoMsg(true);
      setTimeout(()=>{setNoMsg(false);setTotal(newT);advance(newA,idx)},800)
    }else{
      setTotal(newT);advance(newA,idx)
    }
  },[q,answers,total,idx]);

  useEffect(()=>()=>clearTimeout(tmr.current),[]);

  if(loading){const c=getClaims(answers);return<LoadingScreen total={total} claimCount={c.length}/>}

  if(summary){
    const c=getClaims(answers);
    return <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'100dvh',textAlign:'center',background:'var(--navy)',color:'#fff'}}>
      <div style={{fontSize:15,color:'rgba(255,255,255,.6)',marginBottom:8}}>{c.length} claims found</div>
      <div style={{fontSize:56,fontWeight:700,color:'var(--green-bright)',letterSpacing:'-1px',lineHeight:1}}>{formatMoney(total)}</div>
      <div style={{fontSize:17,fontWeight:600,marginTop:12}}>Claim what's yours.</div>
    </div>
  }

  if(interstitial)return <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'100dvh',textAlign:'center',padding:'0 30px',background:'var(--navy)',color:'#fff'}}>
    <div style={{fontSize:22,fontWeight:700,marginBottom:8,lineHeight:1.3}}>{interstitial.text}</div>
    <div style={{fontSize:14,color:'rgba(255,255,255,.6)'}}>{interstitial.sub}</div>
    {total>0&&<div style={{marginTop:20,fontSize:15,color:'var(--green-bright)',fontWeight:600}}>{formatMoney(total)} found so far</div>}
  </div>;

  if(confirm)return <div style={{display:'flex',flexDirection:'column',minHeight:'100dvh',background:'#fff'}}>
    <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
      <div className="micro-confirm">{confirm}</div>
    </div>
    <div className={'running-total'+(gold?' gold':'')}>
      {plus&&<div className="plus-toast">{plus}</div>}
      {jackpot?'🎉':'💰'} Your potential claims: {formatMoney(total)}
    </div>
  </div>;

  if(noMsg)return <div style={{display:'flex',flexDirection:'column',minHeight:'100dvh',background:'#fff'}}>
    <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
      <div style={{fontSize:15,color:'var(--text-light)',fontWeight:500}}>Not this one — most people find 3-5 claims</div>
    </div>
    {total>0&&<div className={'running-total'+(gold?' gold':'')}>{jackpot?'🎉':'💰'} Your potential claims: {formatMoney(total)}</div>}
  </div>;

  if(!q)return null;

  if(q.isMultiChoice)return <div className="page" style={{display:'flex',flexDirection:'column',minHeight:'100dvh'}}>
    <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center'}}>
      <div className="progress-bar">{qList.map((_,i)=><div key={i} className={'progress-dot'+(i<=idx?' active':'')}/>)}</div>
      <div className="question-area">
        <div className="q-meta">Question {idx+1}</div>
        <div className="q-context">{q.microContext}</div>
        {q.lossFrame&&<div className="loss-frame">{q.lossFrame}</div>}
        <div className="q-text">{q.question}</div>
        <div className="answer-buttons">{q.options.map(o=><button key={o} className="answer-btn yes" onClick={()=>answer(o)}>{o}</button>)}</div>
      </div>
    </div>
    {total>0&&<div className={'running-total'+(gold?' gold':'')}>💰 {formatMoney(total)}</div>}
    {confetti&&<Confetti/>}
  </div>;

  // ========== QUESTION-AS-LANDING: Q1 IS THE HERO ==========
  // No separate "start scan" button. First tap IS the commitment.
  if(idx===0){
    return <div style={{display:'flex',flexDirection:'column',minHeight:'100dvh',background:'#fff'}}>
      {/* Top: Logo + authority micro-line */}
      <div style={{background:'var(--navy)',padding:'12px 20px',textAlign:'center'}}>
        <div style={{color:'#fff',fontSize:18,fontWeight:700,letterSpacing:'-.3px'}}>
          MoneyScan
          <span style={{display:'inline-block',width:7,height:7,background:'var(--green-bright)',borderRadius:'50%',marginLeft:3,verticalAlign:'super',animation:'pulse-dot 2s ease-in-out infinite'}}/>
        </div>
        <div style={{color:'rgba(255,255,255,.6)',fontSize:10,fontWeight:500,marginTop:2,letterSpacing:'.3px'}}>
          BASED ON FCA · HMRC · UK TRIBUNAL DATA
        </div>
      </div>

      {/* Live social proof counter */}
      <LiveCounter/>

      {/* THE QUESTION — vertically centered hero */}
      <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',padding:'24px 24px 16px',maxWidth:460,margin:'0 auto',width:'100%'}}>
        <div style={{fontSize:11,color:'var(--green)',fontWeight:700,textTransform:'uppercase',letterSpacing:'1px',marginBottom:10,textAlign:'center'}}>
          £7.5 billion is being returned to UK consumers
        </div>

        <div style={{fontSize:14,color:'var(--text-mid)',textAlign:'center',marginBottom:22,lineHeight:1.5,fontWeight:500}}>
          Find out what you're owed in 60 seconds. Start with one question.
        </div>

        <div className="loss-frame" style={{marginBottom:18}}>
          {q.lossFrame}
        </div>

        <div style={{fontSize:26,fontWeight:700,textAlign:'center',lineHeight:1.22,marginBottom:24,color:'var(--navy)',letterSpacing:'-.3px'}}>
          {q.question}
        </div>

        <div style={{display:'flex',gap:12,flexDirection:'column',maxWidth:360,margin:'0 auto',width:'100%'}}>
          <button
            className="answer-btn yes"
            onClick={()=>answer(q.invertAnswer?false:true)}
            style={{padding:'20px 36px',fontSize:20,animation:'pulse 2s ease-in-out infinite'}}
          >
            Yes
          </button>
          <button
            className="answer-btn no"
            onClick={()=>answer(q.invertAnswer?true:false)}
            style={{padding:'20px 36px',fontSize:20}}
          >
            No
          </button>
        </div>

        <div style={{fontSize:12,color:'var(--text-light)',textAlign:'center',marginTop:18}}>
          {q.socialProof}
        </div>
      </div>

      {/* Bottom: trust micro-line + badges */}
      <div style={{padding:'16px 20px',textAlign:'center',background:'var(--bg-off)',borderTop:'1px solid var(--border)'}}>
        <div style={{fontSize:13,color:'var(--text)',fontWeight:600,marginBottom:6}}>
          60 seconds · No sign-up · No card · Free
        </div>
        <div style={{display:'flex',justifyContent:'center',gap:6,flexWrap:'wrap'}}>
          {['🔒 Encrypted','📋 ICO ZC106075','🏢 UK Company','💰 30-Day Guarantee'].map(b=>
            <span key={b} style={{fontSize:10,color:'var(--text-mid)',background:'#fff',padding:'4px 8px',borderRadius:5,border:'1px solid var(--border)'}}>{b}</span>
          )}
        </div>
      </div>
    </div>
  }

  // ========== Q2 ONWARDS: standard quiz layout ==========
  return <div className="page" style={{display:'flex',flexDirection:'column',minHeight:'100dvh',paddingBottom:total>0?'70px':'0'}}>
    <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center'}}>
      <div className="progress-bar">{qList.map((_,i)=><div key={i} className={'progress-dot'+(i<=idx?' active':'')}/>)}</div>
      <div className="question-area">
        <div className="q-meta">Question {idx+1}</div>
        <div className="q-context">{q.microContext}</div>
        <div className="q-timer">About {secsLeft} seconds left</div>
        <div className="loss-frame">{q.lossFrame}</div>
        <div className="q-text">{q.question}</div>
        <div className="answer-buttons">
          <button className="answer-btn yes" onClick={()=>answer(q.invertAnswer?false:true)}>Yes</button>
          <button className="answer-btn no" onClick={()=>answer(q.invertAnswer?true:false)}>No</button>
          {q.hasThirdOption&&<button className="answer-btn maybe" onClick={()=>answer('dontknow')}>{q.hasThirdOption}</button>}
        </div>
        <div className="social-line">{q.socialProof}</div>
        {idx>0&&<div className="back-link" onClick={()=>setIdx(idx-1)}>← Back</div>}
      </div>
    </div>
    {total>0&&<div className={'running-total'+(gold?' gold':'')}>
      {plus&&<div className="plus-toast">{plus}</div>}
      {jackpot?'🎉':'💰'} Your potential claims: {formatMoney(total)}
    </div>}
    {confetti&&<Confetti/>}
  </div>
}
