import { STATE, $, toast } from './state';
import { t, LANG, setLangValue, applyI18n } from './i18n';
import { readFiles, computeDerived } from './parser';
import {
  SNAP_KEY, pushSnapshot, renderAll, renderWarn, renderDiag,
  renderProfile, renderStatsAll, renderExplore, renderCompare,
  renderList, renderListVirtual, renderTabs, exportCSV, fmtNum,
  setupOpenedDelegation, downloadSnapshot, importSnapshotFile
} from './render';
import type { Lang } from './types';

/* ---------- Eventi / orchestrazione ---------- */
function showLoading(){ const el=$('#loading'); if(el) el.classList.add('show'); }
function hideLoading(){ const el=$('#loading'); if(el) el.classList.remove('show'); }
async function handleFiles(fileList){
  if(!fileList||!fileList.length) return;
  showLoading();
  try{
    const {buckets,log,scan,profile}=await readFiles([...fileList]);
    const hasRel = buckets.followers||buckets.following||buckets.pending;
    if(!hasRel && !(scan&&scan.length)){ toast(t('toast_nodata')); return; }
    STATE.data=buckets; STATE._log=log; STATE.scan=scan||[]; STATE.profile=profile||{}; STATE.derived=computeDerived(buckets); STATE._virtual=null; pushSnapshot(buckets);
    STATE.active='notfb'; renderAll(); renderWarn(buckets, STATE.derived); renderDiag(log, !((buckets.followers||[]).length));
    renderProfile(STATE.profile); renderStatsAll(STATE.scan, buckets); renderExplore(STATE.scan);
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
  file.onchange=()=>handleFiles(file.files);
  ['dragenter','dragover'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.add('over');}));
  ['dragleave','drop'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.remove('over');}));
  drop.addEventListener('drop',e=>{ if(e.dataTransfer.files.length) handleFiles(e.dataTransfer.files); });

  $('#searchInput').addEventListener('input',e=>{ STATE.query=e.target.value; (STATE._virtual&&STATE.active==='_v')?renderListVirtual():renderList(); });
  $('#sortSelect').addEventListener('change',e=>{ STATE.sort=e.target.value; renderList(); });
  $('#csvBtn').onclick=exportCSV;
  $('#resetBtn').onclick=()=>{ STATE.data=null; STATE._virtual=null; $('#results').classList.add('hidden'); $('#setupCard').classList.remove('hidden'); $('#file').value=''; goToStep(3); window.scrollTo({top:0,behavior:'smooth'}); };
  $('#clearSnaps').onclick=()=>{ if(confirm(t('confirm_clear'))){ localStorage.removeItem(SNAP_KEY); renderCompare(); toast(t('toast_histcleared')); } };
  $('#snapDownload').onclick=()=>downloadSnapshot();
  $('#snapUpload').onclick=()=>($('#snapFile') as any).click();
  $('#snapFile').onchange=(e:any)=>{ const f=e.target.files&&e.target.files[0]; if(f) importSnapshotFile(f, ()=>renderCompare()); e.target.value=''; };

  // Tema chiaro/scuro
  const THEME_KEY='instats_theme';
  const applyTheme=(th)=>{ const dark=(th==='dark'); document.body.classList.toggle('dark',dark); $('#themeToggle').textContent=dark?'☀️':'🌙'; };
  applyTheme(localStorage.getItem(THEME_KEY)||'gradient');
  $('#themeToggle').onclick=()=>{ const th=document.body.classList.contains('dark')?'gradient':'dark'; localStorage.setItem(THEME_KEY,th); applyTheme(th); };

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
}
document.addEventListener('DOMContentLoaded', init);
