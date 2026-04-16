import{useNavigate}from"react-router-dom"
import{loadScan,formatMoney,getOrCreateRefCode}from"../utils/helpers"
export default function PostPurchase(){const nav=useNavigate(),scan=loadScan(),ref=getOrCreateRefCode()
if(!scan){nav("/");return null}
const{total}=scan,refLink='https://moneyscan.app/?ref='+ref
return<div className="page" style={{paddingTop:40,paddingBottom:40}}>
<div style={{textAlign:"center",marginBottom:24}}>
<div style={{width:56,height:56,borderRadius:"50%",background:"var(--green)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",fontSize:28,color:"#fff"}}>✓</div>
<h1 style={{fontSize:22,fontWeight:700,color:"var(--green)",marginBottom:4}}>Smart move.</h1>
<p style={{fontSize:14,color:"var(--text-mid)"}}>One more step — add your details to personalise your letters.</p></div>
{[{n:1,t:"Fill in your details",d:"2 minutes. Name + a few specifics."},{n:2,t:"We generate your letters",d:"Personalised and legally-worded."},{n:3,t:"Check your email",d:"Letters arrive within 2 minutes."}].map(s=>
<div key={s.n} style={{display:"flex",gap:12,marginBottom:12}}>
<div style={{width:28,height:28,borderRadius:"50%",background:"var(--navy)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,flexShrink:0}}>{s.n}</div>
<div><div style={{fontSize:14,fontWeight:600}}>{s.t}</div><div style={{fontSize:12,color:"var(--text-mid)"}}>{s.d}</div></div></div>)}
<button className="cta" onClick={()=>nav("/details")} style={{marginTop:16}}>Fill in my details →</button>
<div className="share-section" style={{marginTop:24}}><h3>Help others claim what's theirs</h3><p>Share with friends and family.</p>
<a className="wa-btn" href={"https://wa.me/?text="+encodeURIComponent("I just found "+formatMoney(Math.round(total/1000)*1000)+" I was owed. Free 60-sec check: "+refLink)} target="_blank" rel="noopener">Share on WhatsApp</a></div></div>}
