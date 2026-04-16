import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
const Scan = lazy(() => import('./pages/Scan'))
const Results = lazy(() => import('./pages/Results'))
const PostPurchase = lazy(() => import('./pages/PostPurchase'))
const Details = lazy(() => import('./pages/Details'))
const Letters = lazy(() => import('./pages/Letters'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const HowItWorks = lazy(() => import('./pages/HowItWorks'))
const Refund = lazy(() => import('./pages/Refund'))
const Loading = () => <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#0B1D33',color:'#10B981',fontSize:17,fontWeight:600}}>MoneyScan</div>
export default function App() {
  return <Suspense fallback={<Loading/>}><Routes>
    <Route path="/" element={<Scan/>}/>
    <Route path="/results" element={<Results/>}/>
    <Route path="/post-purchase" element={<PostPurchase/>}/>
    <Route path="/details" element={<Details/>}/>
    <Route path="/letters" element={<Letters/>}/>
    <Route path="/dashboard" element={<Dashboard/>}/>
    <Route path="/how-it-works" element={<HowItWorks/>}/>
    <Route path="/refund" element={<Refund/>}/>
  </Routes></Suspense>
}
