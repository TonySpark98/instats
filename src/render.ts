import { STATE, $, toast } from './state';
import { t, LANG, LOC } from './i18n';
import { GROUP_ORDER, STAT_TAB, isOpened, setOpened } from './parser';
import type { Entry, TabDef } from './types';

/* ---------- Snapshot ---------- */
export const SNAP_KEY='instats_snapshots_v1';
export function loadSnaps(){ try{ return JSON.parse(localStorage.getItem(SNAP_KEY)||'[]'); }catch(e){ return []; } }
export function saveSnaps(s){ try{ localStorage.setItem(SNAP_KEY,JSON.stringify(s)); }catch(e){} }
export function pushSnapshot(d){
  const snaps=loadSnaps();
  const snap={ date:new Date().toISOString(), followers:(d.followers||[]).map(e=>e.username), following:(d.following||[]).map(e=>e.username) };
  const last=snaps[snaps.length-1];
  const same=last && last.followers.length===snap.followers.length && last.following.length===snap.following.length &&
             last.followers.join('|').toLowerCase()===snap.followers.join('|').toLowerCase();
  if(same) return snaps;
  snaps.push(snap); while(snaps.length>15) snaps.shift(); saveSnaps(snaps); return snaps;
}

/* ---------- Avatar ---------- */
export const AV_GRADS=[['#833ab4','#fd1d1d'],['#405de6','#5851db'],['#0891b2','#22d3ee'],['#16a34a','#4ade80'],['#d97706','#fbbf24'],['#c13584','#fd1d1d'],['#7c3aed','#ec4899']];
export function avatar(username){
  let h=0; for(let i=0;i<username.length;i++) h=(h*31+username.charCodeAt(i))>>>0;
  const g=AV_GRADS[h%AV_GRADS.length];
  const init=(username.replace(/[^a-z0-9]/gi,'')[0]||'?').toUpperCase();
  return `<div class="av" style="background:linear-gradient(135deg,${g[0]},${g[1]})">${init}</div>`;
}
export function fmtDate(ts){ if(!ts) return ''; return new Date(ts*1000).toLocaleDateString(LOC(),{day:'2-digit',month:'short',year:'numeric'}); }
export function fmtNum(n){ return n.toLocaleString(LOC()); }

/* ---------- Tab ---------- */
export function tabsDef(): TabDef[]{
  const d:any=STATE.data, x:any=STATE.derived;
  const L=[
    {id:'notfb', label:t('tab_notfb'), items:x.notFollowingBack, desc:t('desc_notfb')},
    {id:'fans',  label:t('tab_fans'),  items:x.fans,             desc:t('desc_fans')},
    {id:'mutual',label:t('tab_mutual'),items:x.mutuals,          desc:t('desc_mutual')},
    {id:'pending',label:t('tab_pending'),items:d.pending||[],    desc:t('desc_pending'), action:t('cancel_req')},
    {id:'followers',label:t('tab_followers'),items:d.followers||[],desc:t('desc_followers')},
    {id:'following',label:t('tab_following'),items:d.following||[],desc:t('desc_following')},
  ];
  if((d.recentReq||[]).length) L.push({id:'recentReq',label:t('tab_recentreq'),items:d.recentReq,desc:t('desc_recentreq'),action:t('cancel_req')});
  if((d.received||[]).length) L.push({id:'received',label:t('tab_received'),items:d.received,desc:t('desc_received')});
  if((d.unfollowed||[]).length) L.push({id:'unfollowed',label:t('tab_unfollowed'),items:d.unfollowed,desc:t('desc_unfollowed')});
  if((d.close||[]).length) L.push({id:'close',label:t('tab_close'),items:d.close,desc:t('desc_close')});
  if((d.blocked||[]).length) L.push({id:'blocked',label:t('tab_blocked'),items:d.blocked,desc:t('desc_blocked')});
  if((d.restricted||[]).length) L.push({id:'restricted',label:t('tab_restricted'),items:d.restricted,desc:t('desc_restricted')});
  if((d.hideStory||[]).length) L.push({id:'hideStory',label:t('tab_hidestory'),items:d.hideStory,desc:t('desc_hidestory')});
  if((d.removedSug||[]).length) L.push({id:'removedSug',label:t('tab_removedsug'),items:d.removedSug,desc:t('desc_removedsug')});
  return L;
}
export function currentTab(){ return tabsDef().find(x=>x.id===STATE.active) || tabsDef()[0]; }

/* ---------- Render ---------- */
export function renderAll(){
  $('#results').classList.remove('hidden'); $('#setupCard').classList.add('hidden');
  renderSummary(); renderStats(); renderCompare(); renderTabs(); renderList();
  window.scrollTo({top:0,behavior:'smooth'});
}
export function renderSummary(){
  const d:any=STATE.data, x:any=STATE.derived;
  const nf=(d.followers||[]).length, ng=(d.following||[]).length;
  const ratio = (nf&&ng)?(nf/ng).toFixed(2):'—';
  $('#summaryMeta').innerHTML = `<b>${fmtNum(nf)}</b> ${t('m_followers')} · <b>${fmtNum(ng)}</b> ${t('m_following')} · ${t('m_ratio')} <b>${ratio}</b>`;
  const el=$('#summaryChart');
  if(el){
    const mutual=(x&&x.mutuals?x.mutuals.length:0), notfb=(x&&x.notFollowingBack?x.notFollowingBack.length:0);
    el.innerHTML = donutChart([
      {v:mutual,c:'#22c55e',l:t('stat_mutual')},
      {v:notfb, c:'#ef4444',l:t('stat_notfb')}
    ], ng, fmtNum(ng), t('m_following'));
  }
  const bel=$('#summaryBars');
  if(bel) bel.innerHTML = barChart(STATE.data, STATE.derived);
}
/* Donut SVG riusabile (segmenti impilati via stroke-dasharray) */
function donutChart(segs:any[], total:number, centerN:string, centerL:string){
  const R=54, SW=15, C=2*Math.PI*R; let off=0;
  const arcs = total>0 ? segs.map((s:any)=>{
    const len=(s.v/total)*C; const rot=(off/C)*360-90; off+=len;
    return `<circle cx="70" cy="70" r="${R}" fill="none" stroke="${s.c}" stroke-width="${SW}" stroke-dasharray="${len} ${C-len}" transform="rotate(${rot} 70 70)"/>`;
  }).join('') : `<circle cx="70" cy="70" r="${R}" fill="none" stroke="rgba(128,128,128,.25)" stroke-width="${SW}"/>`;
  const legend = segs.map((s:any)=>`<span class="lg"><i style="background:${s.c}"></i>${s.l} <b>${fmtNum(s.v)}</b></span>`).join('');
  return `<div class="donutwrap"><svg viewBox="0 0 140 140" class="donut" role="img" aria-hidden="true">${arcs}<text x="70" y="66" text-anchor="middle" class="dt-n">${centerN}</text><text x="70" y="86" text-anchor="middle" class="dt-l">${centerL}</text></svg><div class="donut-legend">${legend}</div></div>`;
}
export function renderStats(){
  const d=STATE.data, x=STATE.derived;
  const cells=[
    {c:'s-foll',ic:'👥',n:(d.followers||[]).length,l:t('stat_followers'),tab:'followers'},
    {c:'s-fing',ic:'➡️',n:(d.following||[]).length,l:t('stat_following'),tab:'following'},
    {c:'s-nofb',ic:'❌',n:x.notFollowingBack.length,l:t('stat_notfb'),tab:'notfb'},
    {c:'s-fan', ic:'💜',n:x.fans.length,l:t('stat_fans'),tab:'fans'},
    {c:'s-mut', ic:'🤝',n:x.mutuals.length,l:t('stat_mutual'),tab:'mutual'},
    {c:'s-pend',ic:'⏳',n:(d.pending||[]).length,l:t('stat_pending'),tab:'pending'},
  ];
  $('#statsGrid').innerHTML = cells.map(s=>`<div class="stat ${s.c}" data-tab="${s.tab}"><div class="ic">${s.ic}</div><div class="n">${fmtNum(s.n)}</div><div class="l">${s.l}</div></div>`).join('');
  animateCounts();
  document.querySelectorAll('.stat').forEach((el:any)=>el.onclick=()=>{ STATE._virtual=null; STATE.active=el.dataset.tab; STATE.query=''; $('#searchInput').value=''; renderTabs(); renderList(); document.querySelector('.tabs').scrollIntoView({behavior:'smooth',block:'start'}); });
}
export function renderTabs(){
  const def=tabsDef();
  $('#tabs').innerHTML = def.map(x=>`<div class="tab ${x.id===STATE.active?'active':''}" data-tab="${x.id}">${x.label}<span class="badge">${fmtNum(x.items.length)}</span></div>`).join('');
  document.querySelectorAll('.tab').forEach((el:any)=>el.onclick=()=>{ STATE._virtual=null; STATE.active=el.dataset.tab; STATE.query=''; $('#searchInput').value=''; renderTabs(); renderList(); });
}
export function renderList(){
  const tab=currentTab(); $('#listDesc').innerHTML=tab.desc;
  let items=tab.items.slice();
  const q=STATE.query.trim().toLowerCase();
  if(q) items=items.filter(e=>e.username.toLowerCase().includes(q));
  const total=items.length, openedN=items.filter(e=>isOpened(e.username)).length;
  setListProgress(openedN, total);
  const hb=$('#hideOpenedBtn'); if(hb) hb.classList.toggle('active', !!STATE.hideOpened);
  if(STATE.hideOpened) items=items.filter(e=>!isOpened(e.username));
  const s=STATE.sort;
  items.sort((a,b)=> s==='az'?a.username.toLowerCase().localeCompare(b.username.toLowerCase()):
    s==='za'?b.username.toLowerCase().localeCompare(a.username.toLowerCase()):
    s==='new'?(b.ts||0)-(a.ts||0):(a.ts||0)-(b.ts||0));
  const wrap=$('#list');
  if(!items.length){
    const done=STATE.hideOpened && total>0;
    wrap.innerHTML=`<div class="empty"><div class="big">${done?'🎉':'🙌'}</div><div><b>${done?t('empty_allopened'):t('empty_none_title')}</b><br>${done?'':(q?t('empty_search'):t('empty_list'))}</div></div>`;
    return;
  }
  const actLabel = tab.action || t('open_btn');
  const actClass = (tab.id==='pending'||tab.id==='recentReq') ? 'open cancel' : 'open';
  wrap.innerHTML = items.map(e=>{
    const dd=fmtDate(e.ts);
    const meta = dd?`<div class="meta">${t('row_since').replace('{date}',dd)}</div>`:'';
    return rowHtml(e, actClass, actLabel, meta);
  }).join('');
}
function setListProgress(o:number,total:number){
  const el=$('#listProgress'); if(!el) return;
  if(!total){ el.innerHTML=''; return; }
  const pct=Math.round(o/Math.max(1,total)*100);
  el.innerHTML=`<span class="lp-txt">${t('list_progress').replace('{o}',fmtNum(o)).replace('{t}',fmtNum(total))}</span><span class="lp-bar"><span class="lp-fill" style="width:${pct}%"></span></span>`;
}
function updateProgress(){
  const tab=currentTab(); let items=tab.items.slice();
  const q=STATE.query.trim().toLowerCase(); if(q) items=items.filter(e=>e.username.toLowerCase().includes(q));
  setListProgress(items.filter(e=>isOpened(e.username)).length, items.length);
}
/* costruisce una riga; segna visivamente i profili già aperti */
export function rowHtml(e:any, actClass:string, actLabel:string, meta:string){
  const opened=isOpened(e.username);
  const seen = opened?`<span class="seen-badge">${t('seen_badge')}</span>`:'';
  const revert = opened?`<button class="revert" type="button" title="${escapeHtml(t('unseen_title'))}" data-u="${escapeHtml(e.username)}">↩</button>`:'';
  return `<div class="row${opened?' opened':''}" data-u="${escapeHtml(e.username)}">${avatar(e.username)}<div class="info"><div class="u">@${escapeHtml(e.username)}${seen}</div>${meta}</div>${revert}<a class="${actClass}" href="${escapeHtml(e.href)}" target="_blank" rel="noopener">${actLabel}</a></div>`;
}

/* ---------- Delega eventi lista: segna/ripristina "già aperto" ---------- */
export function setupOpenedDelegation(){
  const wrap=$('#list'); if(!wrap || wrap._openedBound) return; wrap._openedBound=true;
  wrap.addEventListener('click',(ev:any)=>{
    const row=ev.target.closest && ev.target.closest('.row'); if(!row) return;
    const u=row.getAttribute('data-u'); if(!u) return;
    // pulsante ripristina → torna "non aperto"
    if(ev.target.closest && ev.target.closest('.revert')){
      ev.preventDefault();
      setOpened(u,false); if(STATE.hideOpened) renderList(); else { refreshRow(row,u); updateProgress(); }
      return;
    }
    // click sul link "Apri/Annulla" → segna come aperto (NON impedire l'apertura)
    if(ev.target.closest && ev.target.closest('a.open')){
      setOpened(u,true); if(STATE.hideOpened) renderList(); else { refreshRow(row,u); updateProgress(); }
    }
  });
}
/* aggiorna in-place la classe/badge/pulsante di una singola riga */
function refreshRow(row:any,u:string){
  const opened=isOpened(u);
  row.classList.toggle('opened',opened);
  const uEl=row.querySelector('.u');
  if(uEl){ const old=uEl.querySelector('.seen-badge'); if(old) old.remove();
    if(opened){ const b=document.createElement('span'); b.className='seen-badge'; b.textContent=t('seen_badge'); uEl.appendChild(b); } }
  const existing=row.querySelector('.revert');
  if(opened && !existing){ const a=row.querySelector('a.open'); const btn=document.createElement('button');
    btn.className='revert'; btn.type='button'; btn.title=t('unseen_title'); btn.setAttribute('data-u',u); btn.textContent='↩';
    if(a) row.insertBefore(btn,a); else row.appendChild(btn); }
  else if(!opened && existing){ existing.remove(); }
}

/* ---------- Confronto snapshot ---------- */
export function renderCompare(){
  const snaps=loadSnaps(); const card=$('#compareCard'), sel=$('#snapSelect');
  const prevs=snaps.slice(0,-1);
  card.classList.remove('hidden');
  if(prevs.length===0){ sel.innerHTML=''; $('#cmpGrid').innerHTML=''; $('#cmpHint').innerHTML=t('cmp_first'); return; }
  sel.innerHTML = prevs.map((s,i)=>{ const dt=new Date(s.date).toLocaleString(LOC(),{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}); return `<option value="${i}">${dt} — ${s.followers.length} ${t('snap_foll')}</option>`; }).reverse().join('');
  sel.value=String(prevs.length-1);
  drawCompare(); sel.onchange=drawCompare;
}
export function drawCompare(){
  const snaps=loadSnaps(); const cur=snaps[snaps.length-1]; const prevs=snaps.slice(0,-1);
  const prev=prevs[parseInt($('#snapSelect').value,10)];
  if(!cur||!prev){ $('#cmpGrid').innerHTML=''; return; }
  const lc=a=>new Set(a.map(s=>s.toLowerCase()));
  const curF=lc(cur.followers), prevF=lc(prev.followers), curG=lc(cur.following), prevG=lc(prev.following);
  const lostFollowers=prev.followers.filter(u=>!curF.has(u.toLowerCase()));
  const newFollowers=cur.followers.filter(u=>!prevF.has(u.toLowerCase()));
  const youUnfollowed=prev.following.filter(u=>!curG.has(u.toLowerCase()));
  const youFollowed=cur.following.filter(u=>!prevG.has(u.toLowerCase()));
  STATE._cmp={lostFollowers,newFollowers,youUnfollowed,youFollowed};
  $('#cmpGrid').innerHTML =
    `<div class="cmp c-up" data-cmp="newFollowers"><div class="n">+${newFollowers.length}</div><div class="l">${t('cmp_newf')}</div></div>`+
    `<div class="cmp c-down" data-cmp="lostFollowers"><div class="n">−${lostFollowers.length}</div><div class="l">${t('cmp_lost')}</div></div>`+
    `<div class="cmp c-newf" data-cmp="youFollowed"><div class="n">+${youFollowed.length}</div><div class="l">${t('cmp_youf')}</div></div>`+
    `<div class="cmp c-unf" data-cmp="youUnfollowed"><div class="n">−${youUnfollowed.length}</div><div class="l">${t('cmp_youunf')}</div></div>`;
  const dt=new Date(prev.date).toLocaleString(LOC(),{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});
  $('#cmpHint').innerHTML = t('cmp_hint_compare').replace('{date}',dt);
  document.querySelectorAll('.cmp[data-cmp]').forEach((el:any)=>el.onclick=()=>showCmpList(el.dataset.cmp, STATE._cmp[el.dataset.cmp]||[]));
}
export function showCmpList(key,names){
  const labels={newFollowers:t('vlabel_newFollowers'),lostFollowers:t('vlabel_lostFollowers'),youFollowed:t('vlabel_youFollowed'),youUnfollowed:t('vlabel_youUnfollowed')};
  STATE._virtual={id:'_v',label:labels[key],items:names.map(u=>({username:u,href:'https://www.instagram.com/'+u,ts:0})),desc:t('vdesc')};
  STATE.active='_v'; STATE.query=''; $('#searchInput').value='';
  renderTabsWithVirtual(); renderListVirtual(); document.querySelector('.tabs').scrollIntoView({behavior:'smooth',block:'start'});
}
export function renderTabsWithVirtual(){
  const def=tabsDef(); def.unshift(STATE._virtual as TabDef);
  $('#tabs').innerHTML = def.map(x=>`<div class="tab ${x.id===STATE.active?'active':''}" data-tab="${x.id}">${x.label}<span class="badge">${fmtNum(x.items.length)}</span></div>`).join('');
  document.querySelectorAll('.tab').forEach((el:any)=>el.onclick=()=>{ STATE.active=el.dataset.tab; STATE.query=''; $('#searchInput').value='';
    if(el.dataset.tab==='_v'){ renderTabsWithVirtual(); renderListVirtual(); } else { STATE._virtual=null; renderTabs(); renderList(); } });
}
export function renderListVirtual(){
  const tab=STATE._virtual; $('#listDesc').innerHTML=tab.desc;
  let items=tab.items.slice(); const q=STATE.query.trim().toLowerCase();
  if(q) items=items.filter(e=>e.username.toLowerCase().includes(q));
  const wrap=$('#list');
  if(!items.length){ wrap.innerHTML=`<div class="empty"><div class="big">✨</div><div>${t('empty_cmp')}</div></div>`; return; }
  wrap.innerHTML=items.map(e=>rowHtml(e,'open',t('open_btn'),'')).join('');
}

/* ---------- CSV ---------- */
export function exportCSV(){
  const tab=(STATE._virtual && STATE.active==='_v')?STATE._virtual:currentTab();
  const rows=[[t('csv_username'),t('csv_profile'),t('csv_date')]];
  tab.items.forEach(e=>rows.push([e.username,e.href,fmtDate(e.ts)]));
  const csv=rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
  const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob(["﻿"+csv],{type:'text/csv;charset=utf-8'}));
  a.download='instats_'+(tab.id||'list')+'.csv'; a.click(); toast(t('toast_csv'));
}

export function renderWarn(b, der){
  const el=$('#warnBanner'); const nf=(b.followers||[]).length, ng=(b.following||[]).length;
  let msg='';
  if(nf===0 && ng>0) msg=t('warn_missing_followers').replace('{n}',fmtNum(ng));
  else if(ng===0 && nf>0) msg=t('warn_missing_following').replace('{n}',fmtNum(nf));
  else if(nf>0 && ng>0 && der && der.mutuals.length===0) msg=t('warn_zero_mutual');
  if(msg){ el.innerHTML=msg; el.classList.remove('hidden'); } else { el.innerHTML=''; el.classList.add('hidden'); }
}
export function renderDiag(log, openIt){
  const el=$('#diag'); if(!log||!log.length){ el.innerHTML=''; return; }
  const rows=log.map(l=>`<span class="dchip">${l.name} · <b>${l.cat}</b> · ${fmtNum(l.count)}</span>`).join('');
  el.innerHTML=`<details ${openIt?'open':''}><summary>${t('diag_title')} (${log.length})</summary><div class="dwrap">${rows}</div></details>`;
}
export function escapeHtml(s){ return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

/* ---------- Scheda profilo ---------- */
export function renderProfile(p){
  const card=$('#profileCard'), el=$('#profileBody'); const keys=Object.keys(p||{});
  if(!keys.length){ card.classList.add('hidden'); return; }
  const pri=['Username','Nome utente','Name','Nome','Bio','Biografia','Genere','Email','E-mail','Email address','Indirizzo email','Sito web','Phone Number','Numero di telefono','Numero di telefono confermato','Phone Confirmation','Gender','Sesso','Date of birth','Data di nascita','Private Account','Account privato','Based In Local','Based In','Registration Time','Data di registrazione','Time','Ora','Date','IP Address'];
  const order=[...pri.filter(k=>p[k]!=null), ...keys.filter(k=>!pri.includes(k))];
  el.innerHTML=order.map(k=>`<div class="pf"><div class="pk">${escapeHtml(k)}</div><div class="pv">${escapeHtml(p[k])}</div></div>`).join('');
  card.classList.remove('hidden');
}

/* ---------- Statistiche complete (raggruppate) ---------- */
export function groupClass(g){ return ({profilo:'s-foll',relazioni:'s-fing',contenuti:'s-mut',attivita:'s-fan',interessi:'s-pend',ads:'s-nofb',sicurezza:'s-foll',altro:'s-fing'})[g]||'s-fing'; }
export function renderStatsAll(scan, buckets){
  const card=$('#statsAllCard'), el=$('#statsAllBody');
  if(!scan||!scan.length){ card.classList.add('hidden'); return; }
  const agg={};
  for(const s of scan){ if(s.count==null) continue; const a=agg[s.nb]||(agg[s.nb]={nb:s.nb,emoji:s.emoji,label:s.label,group:s.group,count:0}); a.count+=s.count; }
  // i conteggi delle relazioni usano la lista reale (deduplicata), così combaciano con le tab qui sotto
  const relMap={followers:'followers',following:'following',pending_follow_requests:'pending',recent_follow_requests:'recentReq',permanent_follow_requests:'recentReq',follow_requests_youve_received:'received',recently_unfollowed_profiles:'unfollowed',hide_story_from:'hideStory',removed_suggestions:'removedSug',close_friends:'close',blocked_profiles:'blocked',blocked_accounts:'blocked',restricted_profiles:'restricted'};
  for(const nb in relMap){ const b=buckets[relMap[nb]]; if(b&&agg[nb]) agg[nb].count=b.length; }
  const byGroup={};
  for(const nb in agg){ (byGroup[agg[nb].group]=byGroup[agg[nb].group]||[]).push(agg[nb]); }
  let html='';
  for(const g of GROUP_ORDER){ const items=byGroup[g]; if(!items||!items.length) continue;
    items.sort((a,b)=>b.count-a.count);
    html+=`<div class="grp"><div class="grp-h">${t('grp_'+g)}</div><div class="stats">`+
      items.map(i=>{ const lab=i.label[LANG]||i.label.it; const drill=STAT_TAB[i.nb]?' has-detail':'';
        return `<div class="stat${drill} ${groupClass(g)}" data-nb="${i.nb}" data-label="${escapeHtml(lab)}" title="${t('stat_click_hint')}"><div class="ic">${i.emoji||''}</div><div class="n">${fmtNum(i.count)}</div><div class="l">${lab}</div></div>`;
      }).join('')+`</div></div>`;
  }
  el.innerHTML=html; card.classList.remove('hidden');
  el.querySelectorAll('.stat[data-nb]').forEach((c:any)=>c.onclick=()=>openStatDetail(c.dataset.nb,c.dataset.label));
}
export function openStatDetail(nb,label){
  const tab=STAT_TAB[nb];
  if(tab && STATE.data){ const def=tabsDef(); if(def.find(x=>x.id===tab)){
    STATE._virtual=null; STATE.active=tab; STATE.query=''; const si=$('#searchInput'); if(si) si.value='';
    renderTabs(); renderList(); $('#tabs').scrollIntoView({behavior:'smooth',block:'start'}); return;
  }}
  // categorie senza lista profili → apri "Esplora" filtrato su questo dato
  const ex=$('#exploreCard'); if(ex){ ex.classList.remove('collapsed');
    const inp=$('#exploreSearch'); if(inp){ inp.value=label||''; drawExplore(inp.value); }
    ex.scrollIntoView({behavior:'smooth',block:'start'});
  }
}

/* ---------- Esplora tutti i file dell'export ---------- */
export function renderExplore(scan){
  const card=$('#exploreCard'); if(!scan||!scan.length){ card.classList.add('hidden'); return; }
  card.classList.remove('hidden');
  STATE._scanSorted=scan.slice().sort((a,b)=>(b.count||0)-(a.count||0));
  const inp=$('#exploreSearch'); if(inp){ inp.value=''; inp.oninput=(e)=>drawExplore(e.target.value); }
  drawExplore('');
}
export function drawExplore(q){
  q=(q||'').toLowerCase();
  const rows=(STATE._scanSorted||[]).filter(s=>!q || s.file.toLowerCase().includes(q) || (s.label[LANG]||s.label.it).toLowerCase().includes(q));
  $('#exploreCount').textContent=fmtNum(rows.length);
  $('#exploreBody').innerHTML=rows.map(s=>`<div class="exrow"><span class="exi">${s.emoji}</span><span class="exl">${s.label[LANG]||s.label.it}</span><span class="exf">${escapeHtml(s.file)}</span><span class="exc">${s.count==null?'·':fmtNum(s.count)}</span></div>`).join('');
}

/* ---------- Snapshot come file: scarica / carica ---------- */
export function downloadSnapshot(){
  const snaps=loadSnaps(); const snap=snaps[snaps.length-1];
  if(!snap){ toast(t('snap_none')); return; }
  const data=JSON.stringify({ _instats_snapshot:1, date:snap.date, followers:snap.followers, following:snap.following }, null, 2);
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([data],{type:'application/json'}));
  a.download='instats_snapshot_'+String(snap.date).slice(0,10)+'.json'; a.click();
  toast(t('snap_saved'));
}
export function importSnapshotFile(file:any, done?:()=>void){
  const r=new FileReader();
  r.onload=()=>{ try{
    const o:any=JSON.parse(String(r.result));
    if(!o||!Array.isArray(o.followers)||!Array.isArray(o.following)) throw 0;
    const snap={ date:o.date||new Date().toISOString(), followers:o.followers.map(String), following:o.following.map(String) };
    const snaps=loadSnaps(); const cur=snaps.length?snaps.pop():null;
    snaps.push(snap); if(cur) snaps.push(cur); while(snaps.length>15) snaps.shift();
    saveSnaps(snaps); toast(t('snap_loaded')); if(done) done();
  }catch(e){ toast(t('snap_err')); } };
  r.readAsText(file);
}

/* Count-up elegante dei numeri delle stat card */
function animateCounts(){
  try{ if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; }catch(e){}
  document.querySelectorAll('#statsGrid .stat .n').forEach((el:any)=>{
    const target=parseInt(String(el.textContent||'0').replace(/[^0-9]/g,''),10)||0;
    if(target<=0) return;
    const dur=900, t0=performance.now();
    el.textContent='0';
    const tick=(now:number)=>{ const p=Math.min((now-t0)/dur,1); const e=1-Math.pow(1-p,3);
      el.textContent=fmtNum(Math.round(target*e)); if(p<1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
}

/* Bar chart orizzontale delle categorie principali (barre animate) */
function barChart(d:any, x:any){
  const rows=[
    {l:t('stat_followers'), v:(d.followers||[]).length, c:'#6366f1'},
    {l:t('stat_following'), v:(d.following||[]).length, c:'#a855f7'},
    {l:t('stat_mutual'),    v:(x&&x.mutuals?x.mutuals.length:0), c:'#22c55e'},
    {l:t('stat_notfb'),     v:(x&&x.notFollowingBack?x.notFollowingBack.length:0), c:'#ef4444'},
    {l:t('stat_fans'),      v:(x&&x.fans?x.fans.length:0), c:'#06b6d4'},
    {l:t('stat_pending'),   v:(d.pending||[]).length, c:'#f59e0b'},
  ].filter((r:any)=>r.v>0);
  const max=Math.max(1, ...rows.map((r:any)=>r.v));
  return '<div class="bars">'+rows.map((r:any,i:number)=>
    '<div class="bar-row"><span class="bar-label">'+r.l+'</span>'+
    '<div class="bar-track"><div class="bar-fill" style="width:'+(r.v/max*100).toFixed(1)+'%;background:'+r.c+';animation-delay:'+(i*0.08).toFixed(2)+'s"></div></div>'+
    '<span class="bar-val">'+fmtNum(r.v)+'</span></div>'
  ).join('')+'</div>';
}
