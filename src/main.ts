import { STATE, $, toast } from './state';
import { t, LANG, setLangValue, applyI18n } from './i18n';
import { readFiles, computeDerived } from './parser';
import {
  SNAP_KEY, pushSnapshot, renderAll, renderWarn, renderDiag,
  renderProfile, renderStatsAll, renderExplore, renderInteractions, renderCompare,
  renderList, renderListVirtual, renderTabs, exportCSV, fmtNum,
  setupOpenedDelegation, downloadSnapshot, importSnapshotFile, setView, moveNavInd
} from './render';
import type { Lang } from './types';
import { hydrateIcons } from './icons';

/* ---------- Eventi / orchestrazione ---------- */
function showLoading(){ const el=$('#loading'); if(el) el.classList.add('show'); }
function hideLoading(){ const el=$('#loading'); if(el) el.classList.remove('show'); }
async function handleFiles(fileList){
  if(!fileList||!fileList.length) return;
  showLoading();
  try{
    const {buckets,log,scan,profile,interactions}=await readFiles([...fileList]);
    const hasRel = buckets.followers||buckets.following||buckets.pending;
    if(!hasRel && !(scan&&scan.length)){ toast(t('toast_nodata')); return; }
    STATE.data=buckets; STATE._log=log; STATE.scan=scan||[]; STATE.profile=profile||{}; STATE.derived=computeDerived(buckets); STATE._virtual=null; pushSnapshot(buckets);
    STATE.active='notfb'; renderAll(); renderWarn(buckets, STATE.derived); renderDiag(log, !((buckets.followers||[]).length));
    renderProfile(STATE.profile); renderStatsAll(STATE.scan, buckets); renderExplore(STATE.scan);
    STATE.interactions=interactions; renderInteractions(interactions, buckets);
    toast(t('toast_done'));
  }catch(err){ console.error(err); toast(t('toast_readerr')); }
  finally{ hideLoading(); }
}

// Wizard guidato a 3 step
const CONSENT_KEY='instats_consent_v1';
function goToStep(n:number){
  for(let i=1;i<=3;i++){ const p=$('#wizPanel'+i); if(p) p.classList.toggle('hidden', i!==n); }
  document.querySelectorAll('#wizSteps .wiz-step').forEach((el:any)=>{
    const s=parseInt(el.getAttribute('data-step'),10);
    el.classList.toggle('active', s===n); el.classList.toggle('done', s<n);
  });
}

function init(){
  hydrateIcons();
  applyI18n();
  setupOpenedDelegation();

  // Wizard: consenso pre-spuntato se già accettato in precedenza
  const consentCheck=$('#consentCheck'), wizCont=$('#wizContinue1');
  if(consentCheck && localStorage.getItem(CONSENT_KEY)){ consentCheck.checked=true; if(wizCont) wizCont.disabled=false; }
  if(consentCheck) consentCheck.onchange=()=>{ if(wizCont) wizCont.disabled=!consentCheck.checked; };
  if(wizCont) wizCont.onclick=()=>{ if(!consentCheck.checked) return; try{localStorage.setItem(CONSENT_KEY,'1');}catch(e){} goToStep(2); };
  const wb2=$('#wizBack2'); if(wb2) wb2.onclick=()=>goToStep(1);
  const wn2=$('#wizNext2'); if(wn2) wn2.onclick=()=>goToStep(3);
  const wb3=$('#wizBack3'); if(wb3) wb3.onclick=()=>goToStep(2);
  goToStep(1);

  const drop=$('#drop'), file=$('#file');
  drop.onclick=()=>file.click();
  drop.onkeydown=(e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); file.click(); } };
  file.onchange=()=>handleFiles(file.files);
  ['dragenter','dragover'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.add('over');}));
  ['dragleave','drop'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.remove('over');}));
  drop.addEventListener('drop',e=>{ if(e.dataTransfer.files.length) handleFiles(e.dataTransfer.files); });

  $('#searchInput').addEventListener('input',e=>{ STATE.query=e.target.value; (STATE._virtual&&STATE.active==='_v')?renderListVirtual():renderList(); });
  $('#sortSelect').addEventListener('change',e=>{ STATE.sort=e.target.value; renderList(); });
  { const hb=$('#hideOpenedBtn'); if(hb) hb.onclick=()=>{ STATE.hideOpened=!STATE.hideOpened; renderList(); }; }
  $('#csvBtn').onclick=exportCSV;
  $('#resetBtn').onclick=()=>{ STATE.data=null; STATE._virtual=null; $('#results').classList.add('hidden'); $('#setupCard').classList.remove('hidden'); $('#file').value=''; document.body.classList.remove('results-on'); goToStep(3); window.scrollTo({top:0,behavior:'smooth'}); };
  document.querySelectorAll('#sectionNav .snav').forEach((el:any)=>el.onclick=()=>{ setView(el.dataset.v); window.scrollTo({top:0,behavior:'smooth'}); });
  $('#clearSnaps').onclick=async()=>{ if(await ask()){ localStorage.removeItem(SNAP_KEY); renderCompare(); toast(t('toast_histcleared')); } };
  $('#snapDownload').onclick=()=>downloadSnapshot();
  $('#snapUpload').onclick=()=>($('#snapFile') as any).click();
  $('#snapFile').onchange=(e:any)=>{ const f=e.target.files&&e.target.files[0]; if(f) importSnapshotFile(f, ()=>renderCompare()); e.target.value=''; };

  // Tema chiaro/scuro
  const THEME_KEY='instats_theme';
  const applyTheme=(th)=>{ const dark=(th==='dark'); document.body.classList.add('theming'); document.body.classList.toggle('dark',dark);
    const col = dark ? '#09090b' : '#f7f7f8';
    document.documentElement.style.background = col;                 // evita il bianco nell'overscroll iOS
    const tc=document.querySelector('meta[name="theme-color"]'); if(tc) tc.setAttribute('content', col);  // tinta UI Safari
    requestAnimationFrame(()=>requestAnimationFrame(()=>document.body.classList.remove('theming'))); };
  const sysDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(localStorage.getItem(THEME_KEY)||(sysDark?'dark':'gradient'));
  $('#themeToggle').onclick=()=>{ const th=document.body.classList.contains('dark')?'gradient':'dark'; localStorage.setItem(THEME_KEY,th);
    const d:any=document; if(d.startViewTransition && !reduced()) d.startViewTransition(()=>applyTheme(th)); else applyTheme(th); };

  // Lingua ITA/ENG (slider)
  const setLang=(l:Lang|string)=>{ const lv:Lang=(l==='en')?'en':'it'; setLangValue(lv); localStorage.setItem('instats_lang',lv); applyI18n(); };
  const ls=$('#langSwitch');
  ls.onclick=(e)=>{ const opt=e.target.closest('.ls-opt'); setLang(opt?opt.getAttribute('data-l'):(LANG==='it'?'en':'it')); };
  ls.onkeydown=(e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); setLang(LANG==='it'?'en':'it'); } };

  // Sezioni collassabili: clic sull'intestazione per aprire/chiudere
  document.querySelectorAll('.card.collapsible > .ch').forEach(h=>{
    h.addEventListener('click',()=> h.parentElement.classList.toggle('collapsed'));
  });

  window.addEventListener('beforeunload',(e:any)=>{ if(STATE.data){ e.preventDefault(); e.returnValue=''; } });

  // Pillola della navigazione: si riposiziona se cambiano dimensioni, lingua o layout (barra in alto ↔ tab bar)
  const ro=new ResizeObserver(()=>moveNavInd());
  document.querySelectorAll('#sectionNav .snav').forEach(el=>ro.observe(el));

  // Riflesso che segue il puntatore su tessere e card (solo mouse/trackpad)
  if(window.matchMedia('(hover:hover) and (pointer:fine)').matches && !reduced()){
    document.addEventListener('pointermove',(e:PointerEvent)=>{
      const el=(e.target as Element).closest?.('.stat,.cmp,.ist,.drop,.runstep,.card') as HTMLElement|null; if(!el) return;
      const r=el.getBoundingClientRect();
      el.style.setProperty('--mx',(e.clientX-r.left)+'px'); el.style.setProperty('--my',(e.clientY-r.top)+'px');
    },{passive:true});
  }
}
const reduced=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Conferma con il dialog nativo (Esc o clic fuori = annulla); sostituisce confirm()
function ask():Promise<boolean>{
  const dlg=$('#confirmDlg') as HTMLDialogElement;
  return new Promise(res=>{
    const done=(ok:boolean)=>{ dlg.onclick=null; dlg.oncancel=null; dlg.close(); res(ok); };
    dlg.onclick=(e:any)=>{ const b=e.target.closest('[data-r]'); if(b) return done(b.dataset.r==='ok');
      const r=dlg.getBoundingClientRect(); if(e.target===dlg && (e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)) done(false); };
    dlg.oncancel=(e)=>{ e.preventDefault(); done(false); };
    dlg.showModal();
    (dlg.querySelector('[data-r="no"]') as HTMLElement).focus();
  });
}
document.addEventListener('DOMContentLoaded', init);

console.info('%cInstats','font:700 14px sans-serif;color:#c13584','· open source · github.com/TonySpark98/instats');
