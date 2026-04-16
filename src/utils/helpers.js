export const formatMoney = (n) => '£' + Math.round(n).toLocaleString('en-GB')
export const getOrCreateRefCode = () => { let c = localStorage.getItem('ms_refcode'); if (!c) { c = Math.random().toString(36).substring(2,8).toUpperCase(); localStorage.setItem('ms_refcode', c) } return c }
export const saveScan = (answers, total, claims) => localStorage.setItem('ms_scan', JSON.stringify({ answers, total, claims, ts: Date.now() }))
export const loadScan = () => { try { return JSON.parse(localStorage.getItem('ms_scan')) } catch { return null } }
export const clearScan = () => localStorage.removeItem('ms_scan')
export const saveEmail = (e) => localStorage.setItem('ms_email', e)
export const getSavedEmail = () => localStorage.getItem('ms_email') || ''
export const calcROI = (total) => Math.round(total / 29.99)
export const isDiscountActive = () => { const t = localStorage.getItem('ms_timer'); if (!t) { localStorage.setItem('ms_timer', Date.now().toString()); return true } return (Date.now() - parseInt(t)) < 86400000 }
export const getTimeRemaining = () => { const t = localStorage.getItem('ms_timer'); if (!t) return null; const left = 86400000 - (Date.now() - parseInt(t)); if (left <= 0) return null; const h = Math.floor(left/3600000); const m = Math.floor((left%3600000)/60000); const s = Math.floor((left%60000)/1000); return h+'h '+m+'m '+s+'s' }
export const markResultsVisited = () => localStorage.setItem('ms_results_visit', Date.now().toString())
export const isReturnVisitor = () => { const v = localStorage.getItem('ms_results_visit'); return v && (Date.now() - parseInt(v)) < 86400000 && (Date.now() - parseInt(v)) > 60000 }
