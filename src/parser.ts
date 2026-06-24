import JSZip from 'jszip';
import { toast } from './state';
import { t } from './i18n';
import type { Entry, Buckets, ReadResult, Derived } from './types';

/* ---------- Fix testo: Instagram salva emoji/accenti come byte UTF-8 "mojibake" ---------- */
export function fixMojibake(s){
  if(typeof s!=='string' || !/[-ÿ]/.test(s) || /[Ā-￿]/.test(s)) return s;
  try{
    if(typeof TextDecoder!=='undefined') return new TextDecoder('utf-8',{fatal:false}).decode(Uint8Array.from(s,c=>c.charCodeAt(0)));
    return decodeURIComponent(escape(s));
  }catch(e){ return s; }
}

/* ---------- Normalizzazione username per l'incrocio (match robusto) ---------- */
export function normU(s){
  s=fixMojibake(String(s==null?'':s));
  try{ s=s.normalize('NFKC'); }catch(e){}
  return s.replace(/[​-‏‪-‮﻿]/g,'').replace(/^@+/,'').trim().toLowerCase();
}

/* ---------- Estrazione robusta da JSON ---------- */
export function extractEntries(json){
  let arr=null;
  if(Array.isArray(json)) arr=json;
  else if(json && typeof json==='object'){
    const keys=Object.keys(json);
    let k=keys.find(k=>k.startsWith('relationships_') && Array.isArray(json[k]) && json[k].length);
    if(!k) k=keys.find(k=>Array.isArray(json[k]) && json[k].length);
    if(!k) k=keys.find(k=>Array.isArray(json[k]));
    if(k) arr=json[k];
  }
  if(!Array.isArray(arr)) return [];
  const out=[];
  for(const it of arr){
    if(typeof it==='string'){ const u=it.trim(); if(u) out.push({username:fixMojibake(u),href:'https://www.instagram.com/'+encodeURIComponent(u),ts:0}); continue; }
    if(!it || typeof it!=='object') continue;
    const s=(Array.isArray(it.string_list_data)&&it.string_list_data.length)?it.string_list_data[0]:null;
    let href=(s&&s.href)||it.href||'';
    let username='';
    // 1) label_values → "Nome utente"/"Username" (richieste, smesso di seguire, storie nascoste…)
    if(Array.isArray(it.label_values)){
      const lv=it.label_values.find(x=>x&&/nome utente|username/i.test(x.label||''));
      if(lv&&lv.value) username=String(lv.value).trim();
    }
    // 2) @handle dall'URL del profilo (gestisce anche i redirect instagram.com/_u/USERNAME)
    if(!username && /instagram\.com/i.test(href)){ const h=usernameFromHref(href); if(h) username=h; }
    // 3) altrimenti value / title (following: title = username pulito)
    if(!username){ const val=(s&&s.value)||it.value||(typeof it.title==='string'?it.title:''); username=String(val||'').trim(); }
    // 4) scansione profonda: un link instagram.com ovunque nella voce
    if(!username){ try{ const mm=JSON.stringify(it).match(/instagram\.com\\?\/(?:_u\/)?([A-Za-z0-9._]{1,40})/i); if(mm) username=mm[1]; }catch(e){} }
    const ts=(s&&s.timestamp)||it.timestamp||0;
    if(username){ const href2='https://www.instagram.com/'+encodeURIComponent(username); out.push({username:fixMojibake(username),href:href2,ts}); }
  }
  return out;
}
export function usernameFromHref(href){ try{ const u=new URL(href); const seg=u.pathname.split('/').filter(Boolean); const last=seg.pop()||''; return decodeURIComponent(last).trim(); }catch(e){ return ''; } }

export function categorize(name){
  const n=(name.toLowerCase().split('/').pop()||''); // SOLO il nome del file, non la cartella
  // (la cartella "followers_and_following" contiene "following": va ignorata)
  if(n.includes('pending_follow_request')) return 'pending';
  if(n.includes('recent_follow_request')||n.includes('permanent_follow_request')) return 'recentReq';
  if(n.includes('follow_requests_you')||n.includes('requests_received')||n.includes('received')) return 'received';
  if(n.includes('recently_unfollowed')) return 'unfollowed';
  if(n.includes('close_friends')) return 'close';
  if(n.includes('blocked')) return 'blocked';
  if(n.includes('restricted')) return 'restricted';
  if(n.includes('hide_story')) return 'hideStory';
  if(n.includes('removed_suggestions')) return 'removedSug';
  if(n.includes('hashtag')) return 'hashtags';            // hashtag seguiti: NON sono profili
  if(n.includes('following')) return 'following';
  if(n.includes('follower')) return 'followers';
  return null;
}
/* Riconoscimento dal CONTENUTO del JSON (se il nome file non basta) */
export function categorizeByContent(json, name){
  if(json && typeof json==='object' && !Array.isArray(json)){
    const k=Object.keys(json).find(k=>k.startsWith('relationships_'));
    if(k){
      if(k.includes('following')) return 'following';
      if(k.includes('follow_requests_sent')||k.includes('pending')) return 'pending';
      if(k.includes('follow_requests_received')) return 'received';
      if(k.includes('permanent_follow_request')) return 'recentReq';
      if(k.includes('unfollowed')) return 'unfollowed';
      if(k.includes('close_friends')) return 'close';
      if(k.includes('blocked')) return 'blocked';
      if(k.includes('restricted')) return 'restricted';
      if(k.includes('follower')) return 'followers';
    }
  }
  // Array di primo livello con link a profili IG, MA solo se il nome file parla di "follow"
  // (così nel download completo non scambiamo altri file per la lista follower)
  const base=(name||'').toLowerCase().split('/').pop();
  if(Array.isArray(json) && json.length && /follow/.test(base) && !/following/.test(base)){
    const s=json[0];
    if(s && Array.isArray(s.string_list_data) && s.string_list_data[0] && /instagram\.com/i.test(s.string_list_data[0].href||'')) return 'followers';
  }
  return null;
}
/* ============================================================
   MOTORE DI ANALISI COMPLETA — riconosce ogni file dell'export
   ============================================================ */
// chiave = nome file normalizzato (senza _N e senza estensione) -> [emoji, IT, EN, gruppo]
export const FILE_MAP = {
  followers:['👥','Follower','Followers','relazioni'],
  following:['➡️','Profili che segui','Following','relazioni'],
  pending_follow_requests:['⏳','Richieste inviate (in attesa)','Sent requests (pending)','relazioni'],
  follow_requests_youve_received:['📥','Richieste ricevute','Requests received','relazioni'],
  recent_follow_requests:['📤','Richieste inviate (recenti)','Recent sent requests','relazioni'],
  permanent_follow_requests:['📤','Richieste inviate (storico)','All sent requests','relazioni'],
  recently_unfollowed_profiles:['🔄','Smesso di seguire (recente)','Recently unfollowed','relazioni'],
  close_friends:['⭐','Amici stretti','Close friends','relazioni'],
  blocked_profiles:['🚫','Profili bloccati','Blocked profiles','relazioni'],
  blocked_accounts:['🚫','Account bloccati','Blocked accounts','relazioni'],
  restricted_profiles:['🔇','Profili con restrizioni','Restricted profiles','relazioni'],
  hide_story_from:['🙈','Storie nascoste a','Story hidden from','relazioni'],
  following_hashtags:['#️⃣','Hashtag seguiti','Followed hashtags','relazioni'],
  followed_hashtags:['#️⃣','Hashtag seguiti','Followed hashtags','relazioni'],
  removed_suggestions:['🙅','Suggerimenti rimossi','Removed suggestions','relazioni'],
  posts:['🖼️','Post pubblicati','Posts published','contenuti'],
  stories:['⭕','Storie pubblicate','Stories published','contenuti'],
  reels:['🎬','Reels pubblicati','Reels published','contenuti'],
  igtv_videos:['📺','Video IGTV','IGTV videos','contenuti'],
  archived_posts:['🗄️','Post archiviati','Archived posts','contenuti'],
  recently_deleted_content:['🗑️','Contenuti eliminati di recente','Recently deleted','contenuti'],
  profile_photos:['🪪','Foto profilo','Profile photos','contenuti'],
  liked_posts:['❤️','"Mi piace" ai post','Liked posts','attivita'],
  liked_comments:['👍','"Mi piace" ai commenti','Liked comments','attivita'],
  post_comments:['💬','Commenti ai post','Post comments','attivita'],
  reels_comments:['💬','Commenti ai reels','Reels comments','attivita'],
  saved_posts:['🔖','Post salvati','Saved posts','attivita'],
  saved_collections:['📁','Raccolte salvate','Saved collections','attivita'],
  story_likes:['❤️','"Mi piace" alle storie','Story likes','attivita'],
  polls:['📊','Sondaggi votati','Polls voted','attivita'],
  questions:['❓','Risposte a domande','Questions answered','attivita'],
  emoji_sliders:['🎚️','Slider emoji','Emoji sliders','attivita'],
  countdowns:['⏲️','Conto alla rovescia','Countdowns','attivita'],
  posts_viewed:['👀','Post visti','Posts viewed','attivita'],
  videos_watched:['▶️','Video guardati','Videos watched','attivita'],
  suggested_accounts_viewed:['👁️','Account suggeriti visti','Suggested accounts viewed','attivita'],
  account_searches:['🔎','Ricerche di profili','Profile searches','attivita'],
  word_or_phrase_searches:['🔍','Ricerche di parole','Word searches','attivita'],
  tag_searches:['🏷️','Ricerche di tag','Tag searches','attivita'],
  recently_visited_profiles:['🕘','Profili visitati di recente','Recently visited profiles','attivita'],
  link_history:['🔗','Cronologia link','Link history','attivita'],
  your_topics:['🎯','Argomenti di interesse','Your topics','interessi'],
  ads_viewed:['📣','Inserzioni viste','Ads viewed','ads'],
  ads_clicked:['🖱️','Inserzioni cliccate','Ads clicked','ads'],
  advertisers_using_your_activity_or_information:['🏢','Inserzionisti con i tuoi dati','Advertisers using your data','ads'],
  login_activity:['🔐','Accessi','Logins','sicurezza'],
  logout_activity:['🚪','Disconnessioni','Logouts','sicurezza'],
  devices:['📱','Dispositivi','Devices','sicurezza'],
  password_change_activity:['🔑','Cambi password','Password changes','sicurezza'],
  signup_details:['📝','Dati di registrazione','Signup details','profilo'],
  instagram_profile_information:['🪪','Info profilo Instagram','Profile information','profilo'],
  'two-factor_authentication':['🔐','Autenticazione a due fattori','Two-factor auth','sicurezza'],
  custom_lists:['📋','Liste personalizzate','Custom lists','relazioni'],
  locations_of_interest:['📍','Luoghi di interesse','Locations of interest','profilo'],
  profile_based_in:['🌍','Posizione stimata','Profile based in','profilo'],
  note_and_repost_interactions:['🗒️','Note e repost','Notes & reposts','attivita'],
  instagram_friend_map:['🗺️','Mappa amici','Friend map','attivita'],
  recent_searches:['🕘','Ricerche recenti','Recent searches','attivita'],
  profile_searches:['🔎','Ricerche di profili','Profile searches','attivita'],
  suggested_profiles_viewed:['👁️','Profili suggeriti visti','Suggested profiles viewed','attivita'],
  profile_activity:['👤','Attività profilo','Profile activity','sicurezza'],
  profile_privacy_changes:['🔒','Modifiche privacy profilo','Profile privacy changes','sicurezza'],
  profile_status_changes:['🔁','Cambi stato profilo','Profile status changes','sicurezza'],
  ad_preferences:['🎛️','Preferenze pubblicità','Ad preferences','ads'],
  signup_information:['📝','Dati di registrazione','Signup information','profilo'],
  account_information:['🪪','Informazioni account','Account information','profilo'],
  personal_information:['🪪','Informazioni personali','Personal information','profilo'],
  profile_changes:['✏️','Modifiche al profilo','Profile changes','profilo'],
  professional_information:['💼','Informazioni professionali','Professional info','profilo'],
  account_privacy_changes:['🔒','Modifiche privacy','Privacy changes','sicurezza'],
  two_factor_authentication:['🔐','Autenticazione a due fattori','Two-factor auth','sicurezza'],
  camera_information:['📷','Fotocamera','Camera information','sicurezza'],
  last_known_location:['📍','Ultima posizione nota','Last known location','sicurezza'],
  apps_and_websites:['🧩','App e siti collegati','Connected apps & sites','sicurezza'],
  your_activity_off_meta_technologies:['🌐','Attività off-Meta','Off-Meta activity','sicurezza'],
  recommended_topics:['🎯','Argomenti consigliati','Recommended topics','interessi'],
  subscription_for_no_ads:['💳','Abbonamento senza pubblicità','No-ads subscription','ads'],
  other_categories_used_to_reach_you:['🏷️','Categorie per raggiungerti','Ad categories','ads'],
  comments_on_others_media:['💬','Commenti su post altrui','Comments on others','attivita'],
  quizzes:['🧠','Quiz delle storie','Story quizzes','attivita'],
  recently_viewed_items:['🛍️','Prodotti visti di recente','Recently viewed items','attivita'],
  wishlist:['💖','Lista desideri','Wishlist','attivita'],
  music_recently_used:['🎵','Musica usata di recente','Recently used music','attivita'],
  events:['📅','Eventi','Events','attivita'],
};
export const GROUP_ORDER=['profilo','relazioni','contenuti','attivita','interessi','ads','sicurezza','altro'];
export function normBase(name){ return (name.toLowerCase().split('/').pop()||'').replace(/\.(json|html?)$/,'').replace(/['’]/g,'').replace(/_\d+$/,''); }
export function primaryArray(j){ if(Array.isArray(j)) return j; if(j&&typeof j==='object'){ for(const k of Object.keys(j)){ if(Array.isArray(j[k])) return j[k]; } } return null; }
export function humanize(nb){ return nb.replace(/[_-]+/g,' ').replace(/\b\w/g,c=>c.toUpperCase()); }
export function collectStringMap(j){
  const out={}; const pull=(o)=>{ if(o&&o.string_map_data&&typeof o.string_map_data==='object'){ for(const k in o.string_map_data){ const v=o.string_map_data[k]; if(v&&v.value!=null&&out[k]==null) out[k]=fixMojibake(String(v.value)); } } };
  const arr=primaryArray(j); if(arr) arr.forEach(x=>pull(x)); pull(j); return out;
}

/* ---------- Parsing di un file HTML dell'export ---------- */
export function parseHtmlUsernames(text){
  try{
    const doc=new DOMParser().parseFromString(text,'text/html');
    const seen=new Set(); const out=[];
    doc.querySelectorAll('a[href]').forEach(a=>{
      const href=a.getAttribute('href')||'';
      if(/instagram\.com/i.test(href)){
        const u=usernameFromHref(href);
        if(u && !['p','reel','reels','explore','stories','accounts','direct'].includes(u.toLowerCase()) && !seen.has(u)){
          seen.add(u); out.push({username:u,href:'https://www.instagram.com/'+u,ts:0});
        }
      }
    });
    return out;
  }catch(e){ return []; }
}

const STORY_RX=/\/stories\/([A-Za-z0-9._]{1,40})/i;
const IGPROF_RX=/instagram\.com\\?\/(?:_u\/)?([A-Za-z0-9._]{1,40})/i;
function smdFind(e:any, rx:RegExp){ const smd=e&&e.string_map_data; if(!smd) return null; for(const k in smd){ if(rx.test(k)) return smd[k]; } return null; }

export async function readFiles(fileList: any): Promise<ReadResult>{
  const buckets:any={}; const log:any[]=[]; const scan:any[]=[]; const profile:any={}; const interactions:any={};
  const base=(p)=>p.split('/').pop();
  const add=(cat,entries,name)=>{ if(cat&&entries.length){ (buckets[cat]=buckets[cat]||[]).push(...entries); } log.push({name:base(name),cat:cat||'?',count:entries?entries.length:0}); };
  const recordScan=(json,name)=>{
    const nb=normBase(name); const meta=FILE_MAP[nb];
    const arr=primaryArray(json); const count=arr?arr.length:null;
    scan.push({file:base(name), nb, emoji:meta?meta[0]:'📄', label:meta?{it:meta[1],en:meta[2]}:{it:humanize(nb),en:humanize(nb)}, group:meta?meta[3]:'altro', count});
    // dati profilo / creazione account
    if(/personal_information|account_information|profile|signup|registration|based_in|professional|information_about_you|contact|email|phone/.test(name.toLowerCase())){
      const sm=collectStringMap(json); for(const k in sm){ if(profile[k]==null) profile[k]=sm[k]; }
    }
  };
  const bumpI=(u:string,kind:string,ts:number)=>{
    const k=normU(u); if(!k||k.length>40||/[\/\s@]/.test(k)) return;
    const d=interactions[k]||(interactions[k]={username:k,comment:0,likedComment:0,storyLike:0,total:0,ts:0});
    d[kind]++; d.total++; if(ts && ts>d.ts) d.ts=ts;
  };
  const recordInteractions=(json:any,name:string)=>{
    const nb=normBase(name);
    if(/post_comments|reels_comments|comments_on_others/.test(nb)){
      const arr=primaryArray(json)||[];
      for(const e of arr){ const v=smdFind(e,/media owner|owner|proprietario|autore/i); const tv=smdFind(e,/^(time|ora|data)$/i); if(v&&v.value) bumpI(String(v.value),'comment',(tv&&tv.timestamp)||0); }
    } else if(nb==='liked_comments'){
      const w=json&&json.likes_comment_likes;
      if(Array.isArray(w)) for(const e of w){ if(e&&e.title){ const s=Array.isArray(e.string_list_data)&&e.string_list_data[0]; bumpI(String(e.title),'likedComment',(s&&s.timestamp)||0); } }
    } else if(nb==='story_likes'){
      const arr=primaryArray(json)||[];
      for(const e of arr){ let u=''; try{ const blob=JSON.stringify(e); const m=blob.match(STORY_RX)||blob.match(IGPROF_RX); if(m) u=m[1]; }catch(x){} if(!u && e && e.title) u=String(e.title); if(u) bumpI(u,'storyLike',(e&&e.timestamp)||0); }
    }
  };
  const handleJson=(txt,name)=>{
    let json; try{ json=JSON.parse(txt); }catch(e){ log.push({name:base(name),cat:'errore',count:0}); return; }
    const cat = categorize(name) || categorizeByContent(json, name);
    add(cat, extractEntries(json), name);
    recordScan(json,name);
    recordInteractions(json,name);
  };
  const handleHtml=(txt,name)=>{ add(categorize(name), parseHtmlUsernames(txt), name); };
  for(const f of fileList){
    const lower=f.name.toLowerCase();
    if(lower.endsWith('.zip')){
      if(typeof JSZip==='undefined'){ toast(t('toast_nozip')); continue; }
      const zip=await JSZip.loadAsync(f);
      const paths=Object.keys(zip.files).filter(p=>!zip.files[p].dir);
      if(!paths.length){ log.push({name:f.name,cat:'ZIP vuoto?',count:0}); }
      for(const path of paths){
        const entry=zip.files[path];
        const pl=path.toLowerCase();
        if(pl.endsWith('.json')) handleJson(await entry.async('string'), path);
        else if(/\.html?$/.test(pl)) handleHtml(await entry.async('string'), path);
        else log.push({name:base(path),cat:'(ignorato)',count:0});
      }
    } else if(lower.endsWith('.json')){ handleJson(await f.text(), f.name); }
    else if(/\.html?$/.test(lower)){ handleHtml(await f.text(), f.name); }
  }
  for(const k of Object.keys(buckets)){
    const seen=new Set(); const dd=[];
    for(const e of buckets[k]){ const key=normU(e.username); if(!seen.has(key)){ seen.add(key); dd.push(e); } }
    buckets[k]=dd;
  }
  return {buckets, log, scan, profile, interactions};
}

/* ---------- Operazioni su insiemi ---------- */
export const setOf=(a)=>new Set(a.map(e=>normU(e.username)));
export const diff=(a,b)=>a.filter(e=>!b.has(normU(e.username)));
export const inter=(a,b)=>a.filter(e=>b.has(normU(e.username)));
export function computeDerived(d){
  const fSet=setOf(d.followers||[]), gSet=setOf(d.following||[]);
  return { notFollowingBack:diff(d.following||[],fSet), fans:diff(d.followers||[],gSet), mutuals:inter(d.following||[],fSet) };
}

/* ---------- Profili già aperti (visti) — persistiti su questo dispositivo ---------- */
export const OPENED_KEY='instats_opened_v1';
let _openedSet: Set<string> | null = null;
export function loadOpened(): Set<string>{
  if(_openedSet) return _openedSet;
  try{ const arr=JSON.parse(localStorage.getItem(OPENED_KEY)||'[]'); _openedSet=new Set((arr||[]).map((u:any)=>normU(u))); }
  catch(e){ _openedSet=new Set(); }
  return _openedSet;
}
export function saveOpened(){ try{ localStorage.setItem(OPENED_KEY, JSON.stringify([...loadOpened()])); }catch(e){} }
export function isOpened(u: string): boolean{ return loadOpened().has(normU(u)); }
export function setOpened(u: string, on: boolean){ const s=loadOpened(); const k=normU(u); if(on) s.add(k); else s.delete(k); saveOpened(); }

/* ---------- Mappa stat -> tab profili ---------- */
export const STAT_TAB: Record<string,string> = {followers:'followers',following:'following',pending_follow_requests:'pending',recent_follow_requests:'recentReq',permanent_follow_requests:'recentReq',follow_requests_youve_received:'received',recently_unfollowed_profiles:'unfollowed',hide_story_from:'hideStory',removed_suggestions:'removedSug',close_friends:'close',blocked_profiles:'blocked',blocked_accounts:'blocked',restricted_profiles:'restricted'};
