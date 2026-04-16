import{useState}from"react"
import{Link}from"react-router-dom"
export default function Refund(){const[done,setDone]=useState(false);return<div className="page" style={{paddingTop:32,paddingBottom:40}}>
<h1 style={{fontSize:24,fontWeight:700,marginBottom:12}}>Request a refund</h1>
<p style={{fontSize:14,color:"var(--text-mid)",marginBottom:24,lineHeight:1.7}}>Not eligible? Full refund. No questions asked.</p>
{!done?<div><input className="input" placeholder="Your email" style={{marginBottom:8}}/><input className="input" placeholder="Order reference or date" style={{marginBottom:8}}/><textarea className="input" placeholder="Reason (optional)" rows={3} style={{resize:"vertical",marginBottom:8}}/><button className="cta" onClick={()=>setDone(true)}>Request Refund</button></div>:<div className="guarantee">Received. Processed within 5 working days.</div>}
<div className="trust-footer" style={{marginTop:24}}><Link to="/">Back to scan</Link></div></div>}
