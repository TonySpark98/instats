import { STATE } from './state';
import type { Lang } from './types';
import {
  renderSummary, renderStats, renderCompare, renderTabs, renderList,
  renderTabsWithVirtual, renderListVirtual, renderProfile, renderStatsAll, renderExplore
} from './render';

/* ---------- Traduzioni IT / EN ---------- */
export const I18N = {
  it:{
    tagline:`Tutte le statistiche del tuo Instagram — privato, sul tuo dispositivo`,
    free_badge:`✨ 100% Gratis · nessun costo, nessuna pubblicità`,
    upload_title:`1 · Carica i tuoi dati Instagram`,
    upload_sub:`<b>Consigliato:</b> carica direttamente il file <b>.zip</b> esportato da Instagram — è il modo più semplice e completo. In alternativa puoi caricare i singoli file <b>JSON</b> (anche più di uno insieme). Nessun login, nessuna password: i dati restano sul tuo computer.`,
    privacy_text:`<b>100% privato.</b> L'analisi avviene interamente nel tuo browser. I tuoi file <b>non vengono caricati su nessun server</b>. Niente da installare, niente account da collegare.`,
    drop_t1:`Trascina qui lo <b>.ZIP</b> di Instagram <span class="reco">consigliato</span> — o clicca per scegliere`,
    drop_t2:`Accetta: archivio <b>.zip</b> (consigliato) · file <b>.json</b> (anche più insieme) · file <b>.html</b>`,
    json_note:`📄 File JSON riconosciuti automaticamente: <span class="pill">followers_1.json</span> <span class="pill">following.json</span> <span class="pill">pending_follow_requests.json</span> e altri dell'export (anche più file <code>followers_2/3…</code> per profili grandi).`,
    guide_summary:`📥 Come scaricare i tuoi dati da Instagram (2 min)`,
    guide_body:`Per avere la lista completa di follower e seguiti serve l'<b>esportazione ufficiale</b> di Instagram. È l'unico metodo che Instagram consente alle app esterne.
      <ol>
        <li>Apri Instagram → <span class="pill">Profilo</span> → menu ☰ → <b>Centro gestione account</b>.</li>
        <li>Vai su <b>Le tue informazioni e autorizzazioni</b> → <b>Scarica le tue informazioni</b>.</li>
        <li>Tocca <b>Scarica o trasferisci le informazioni</b> → scegli il tuo profilo.</li>
        <li>Seleziona <b>Parte delle tue informazioni</b> → spunta solo <b>Follower e profili seguiti</b> (così è veloce).</li>
        <li>In <b>Formato</b> scegli <span class="pill">JSON</span> (consigliato), intervallo <b>Tutto</b>, poi <b>Crea file</b>.</li>
        <li>Instagram ti invia il file (di solito in pochi minuti). Scaricalo: è un <b>.zip</b>.</li>
        <li>Torna qui e caricalo. Fatto. 🎉</li>
      </ol>
      <div style="margin-top:12px"><a class="btn sm" href="https://help.instagram.com/181231772500920" target="_blank" rel="noopener" style="text-decoration:none;display:inline-flex;align-items:center;gap:7px">📖 Guida ufficiale Instagram ↗</a></div>
      <div class="note">Suggerimento: per vedere <b>chi ti ha tolto il follow</b>, ripeti l'export ogni tanto e ricaricalo qui: l'app confronta automaticamente con la volta precedente.</div>`,
    summary_title:`Riepilogo`,
    reset_btn:`↺ Nuovo file`,
    compare_title:`📈 Cambiamenti nel tempo`,
    compare_sub:`Confronto tra l'export attuale e uno snapshot salvato in precedenza su questo browser.`,
    compare_how:`<b>Come funziona il confronto:</b> ogni volta che carichi un export, l'app salva una “fotografia” (snapshot) di follower e seguiti nella memoria di <b>questo</b> browser. Al caricamento <b>successivo</b> confronta il nuovo export con quello salvato e ti mostra <b>chi ti ha tolto il follow</b>, i nuovi follower e i tuoi cambiamenti.<br>👉 Il primo caricamento non ha nulla con cui confrontarsi: rifai l'export tra qualche giorno o settimana e ricaricalo qui. Gli snapshot restano solo sul tuo dispositivo (se cambi browser o cancelli i dati del sito, la cronologia si azzera).`,
    compare_with:`Confronta con:`,
    clear_snaps:`🗑 Cancella cronologia`,
    csv_btn:`⬇ Esporta CSV`,
    search_ph:`Cerca un username…`,
    sort_az:`Ordine: A → Z`, sort_za:`Ordine: Z → A`, sort_new:`Più recenti prima`, sort_old:`Più vecchi prima`,
    footer_made:`Realizzato da Antonio Villanacci`,
    footer_free:`📊 Instats · 100% gratis · funziona offline · i tuoi dati non lasciano mai il tuo dispositivo`,
    footer_disc:`Strumento indipendente, non affiliato a Instagram / Meta.`,
    run_title:`📥 Come usarlo sul tuo PC o telefono`,
    run_body:`<div class="runsteps">
      <div class="runstep"><div class="ri">💻</div><div class="rt"><b>Su computer (Windows / Mac):</b><br>1) Scarica il file <code>instats.html</code>.<br>2) Fai <b>doppio clic</b>: si apre nel tuo browser.<br>Funziona anche <b>offline</b>, senza internet.</div></div>
      <div class="runstep"><div class="ri">📱</div><div class="rt"><b>Su iPhone / Android:</b><br>1) Salva <code>instats.html</code> sul telefono.<br>2) Aprilo con il browser (Safari o Chrome).<br>3) Per usarlo come app aggiungilo alla Home: <b>iPhone</b> → Condividi <span class="pill">⬆️</span> → «Aggiungi a Home»; <b>Android</b> → menu <span class="pill">⋮</span> → «Aggiungi a schermata Home».</div></div>
      <div class="runstep"><div class="ri">🌐</div><div class="rt"><b>Sul tuo sito web:</b><br>Carica il file sul tuo sito: chiunque potrà usarlo dal proprio browser. <b>Nessun dato viene raccolto</b> — l'analisi avviene solo nel browser di chi lo usa, senza server né database.</div></div>
    </div>
    <div class="note">🔒 Privacy garantita: i file di Instagram non vengono mai inviati a nessuno, restano sul dispositivo di chi usa l'app.</div>`,
    stat_followers:`Follower`, stat_following:`Seguiti`, stat_notfb:`Non ti seguono`, stat_fans:`Non li segui tu`, stat_mutual:`Reciproci`, stat_pending:`Richieste inviate`,
    m_followers:`follower`, m_following:`seguiti`, m_ratio:`rapporto follower/seguiti`,
    tab_notfb:`❌ Non ti seguono`, desc_notfb:`Account che <b>tu segui</b> ma che <b>non ti seguono</b>. I candidati a uno “smetti di seguire”.`,
    tab_fans:`💜 Non li segui tu`, desc_fans:`Account che <b>ti seguono</b> ma che <b>tu non segui</b>. I tuoi “fan”.`,
    tab_mutual:`🤝 Reciproci`, desc_mutual:`Follow reciproco: vi seguite a vicenda.`,
    tab_pending:`⏳ Richieste inviate`, desc_pending:`Richieste di follow che <b>hai inviato</b> e che <b>non sono ancora state accettate</b>. Clicca <b>«Annulla richiesta»</b> per aprire il profilo e annullarla su Instagram (tocca «Richiesto»). L'annullamento automatico non è possibile: Instagram non lo consente alle app.`,
    tab_followers:`👥 I tuoi follower`, desc_followers:`Tutti gli account che ti seguono.`,
    tab_following:`➡️ Profili che segui`, desc_following:`Tutti gli account che segui.`,
    tab_received:`📥 Richieste ricevute`, desc_received:`Richieste di follow che <b>hai ricevuto</b> (in attesa di tua risposta).`,
    tab_unfollowed:`🔄 Hai smesso di seguire`, desc_unfollowed:`Account che <b>hai smesso di seguire</b> di recente (dato fornito da Instagram).`,
    tab_recentreq:`📤 Richieste inviate (recenti)`, desc_recentreq:`Richieste di follow che <b>hai inviato</b> di recente. Clicca <b>«Annulla richiesta»</b> per aprire il profilo e annullarla su Instagram (tocca «Richiesto»).`,
    tab_close:`⭐ Amici stretti`, desc_close:`La tua lista “Amici più stretti”.`,
    tab_blocked:`🚫 Bloccati`, desc_blocked:`Account che hai bloccato.`,
    tab_restricted:`🔇 Con restrizioni`, desc_restricted:`Account a cui hai applicato restrizioni.`,
    tab_hidestory:`🙈 Storie nascoste a`, desc_hidestory:`Account a cui <b>hai nascosto le tue storie</b> (dato fornito da Instagram).`,
    tab_removedsug:`🙅 Suggerimenti rimossi`, desc_removedsug:`Account che <b>hai rimosso dai suggerimenti</b> (dato fornito da Instagram).`,
    cmp_newf:`Nuovi follower`, cmp_lost:`Ti hanno tolto il follow`, cmp_youf:`Hai iniziato a seguire`, cmp_youunf:`Hai smesso di seguire`,
    cmp_first:`🆕 Questo è il <b>primo snapshot</b> salvato su questo browser. Ricarica un nuovo export più avanti per vedere <b>chi ti ha tolto il follow</b>, i nuovi follower e altro.`,
    cmp_hint_compare:`Confronto con lo snapshot del <b>{date}</b>. Clicca un riquadro per vedere i nomi.`,
    vlabel_newFollowers:`➕ Nuovi follower`, vlabel_lostFollowers:`➖ Ti hanno tolto il follow`, vlabel_youFollowed:`➡️ Hai iniziato a seguire`, vlabel_youUnfollowed:`⬅️ Hai smesso di seguire`,
    vdesc:`Risultato del confronto tra snapshot.`,
    empty_none_title:`Nessun risultato.`, empty_search:`Prova un altro termine di ricerca.`, empty_list:`Questa lista è vuota.`, empty_cmp:`<b>Nessuno.</b> Nessun cambiamento in questa categoria.`,
    row_since:`dal {date}`, open_btn:`Apri ↗`, snap_foll:`follower`, cancel_req:`Annulla richiesta ↗`,
    warn_missing_followers:`⚠️ <b>Attenzione:</b> ho letto <b>0 follower</b> ma <b>{n} seguiti</b>. Manca il file dei follower, quindi "Non ti seguono" non è attendibile. Carica anche <code>followers_1.json</code> (a volte ce ne sono più: followers_1, followers_2…) oppure <b>l'intero file .zip</b> dell'export. Puoi selezionare più file insieme.`,
    warn_missing_following:`⚠️ <b>Attenzione:</b> ho letto <b>{n} follower</b> ma <b>0 seguiti</b>. Manca il file <code>following.json</code>. Carica anche quel file o l'intero .zip dell'export.`,
    warn_zero_mutual:`⚠️ <b>Reciproci = 0:</b> nessun follower combacia con i profili che segui. È molto raro e di solito significa che nel tuo export gli username dei due file sono scritti in modo diverso. Ho già reso l'incrocio più robusto; se vedi ancora 0, scrivimi e adatto l'app al tuo formato.`,
    diag_title:`File rilevati`,
    profile_title:`👤 Il tuo profilo`,
    statsall_title:`📊 Tutte le statistiche`,
    statsall_sub:`Ogni dato trovato nel tuo export, raggruppato per categoria. <b>Clicca una scheda</b> per vederne il dettaglio qui sotto.`,
    grp_profilo:`Profilo`, grp_relazioni:`Relazioni`, grp_contenuti:`Contenuti`, grp_attivita:`Attività`, grp_interessi:`Interessi`, grp_ads:`Pubblicità`, grp_sicurezza:`Sicurezza & accessi`, grp_altro:`Altri dati`,
    stat_click_hint:`Clicca per vedere il dettaglio`,
    explore_title:`🔍 Esplora tutto l'export`,
    explore_sub:`Ogni singolo file trovato nel tuo ZIP, con quante voci contiene. Niente è nascosto.`,
    explore_ph:`Cerca un file o un dato…`, explore_col:`Dato`, explore_file:`File`, explore_n:`Voci`, explore_files:`file analizzati`,
    toast_analyzing:`Analisi in corso…`, toast_done:`Fatto! ✔`, toast_csv:`CSV esportato ✔`,
    loading_text:`Analisi dei tuoi dati in corso…`, loading_sub:`Tutto avviene sul tuo dispositivo, niente viene caricato online.`,
    consent_title:`🔒 La tua privacy viene prima di tutto`,
    consent_body:`Instats funziona <b>interamente nel tuo browser</b>. I tuoi dati Instagram <b>non lasciano mai il tuo dispositivo</b>: nessun file viene inviato a server, nessun account da collegare, nessun tracciamento e nessuna pubblicità.<br><br>Per qualsiasi problema o segnalazione puoi scrivere a <a href="mailto:antonio.villanacci@outlook.com">antonio.villanacci@outlook.com</a>.`,
    consent_accept:`Ho capito e accetto`,
    wiz_step1:`Privacy`, wiz_step2:`Il file`, wiz_step3:`Carica`,
    wiz_back:`← Indietro`,
    wiz1_title:`🔒 Termini e privacy`,
    wiz1_body:`Instats funziona <b>interamente nel tuo browser</b>. I tuoi dati Instagram <b>non lasciano mai il tuo dispositivo</b>: nessun file viene caricato, nessun account da collegare, nessun tracciamento e nessuna pubblicità.<br><br>Per qualsiasi problema o segnalazione scrivi a <a href="mailto:antonio.villanacci@outlook.com">antonio.villanacci@outlook.com</a>.`,
    wiz1_checkbox:`Accetto i Termini e l'informativa sulla privacy`,
    wiz1_continue:`Continua`,
    wiz2_title:`📥 Come ottenere il file`,
    wiz2_next:`Ho il file, continua →`,
    wiz3_title:`📂 Carica il file`,
    seen_badge:`✓ visto`,
    unseen_title:`Segna come non aperto`,
    toast_nodata:`Non ho trovato follower/seguiti. Controlla di aver caricato lo ZIP giusto.`,
    toast_readerr:`Errore nella lettura del file. Prova con i singoli file JSON.`,
    toast_badjson:`File JSON non valido: `, toast_nozip:`Libreria ZIP non caricata: serve internet una volta, oppure carica i file JSON.`,
    toast_histcleared:`Cronologia cancellata.`, confirm_clear:`Cancellare tutta la cronologia degli snapshot salvati su questo browser?`,
    csv_username:`username`, csv_profile:`profilo`, csv_date:`data`,
  },
  en:{
    tagline:`All your Instagram stats — private, on your device`,
    free_badge:`✨ 100% Free · no cost, no ads`,
    upload_title:`1 · Upload your Instagram data`,
    upload_sub:`<b>Recommended:</b> upload the <b>.zip</b> exported from Instagram directly — it's the easiest and most complete way. Alternatively you can upload the individual <b>JSON</b> files (several at once). No login, no password: your data stays on your computer.`,
    privacy_text:`<b>100% private.</b> Everything runs entirely in your browser. Your files <b>are never uploaded to any server</b>. Nothing to install, no account to connect.`,
    drop_t1:`Drag your Instagram <b>.ZIP</b> here <span class="reco">recommended</span> — or click to choose`,
    drop_t2:`Accepts: <b>.zip</b> archive (recommended) · <b>.json</b> files (several at once) · <b>.html</b> files`,
    json_note:`📄 JSON files auto-detected: <span class="pill">followers_1.json</span> <span class="pill">following.json</span> <span class="pill">pending_follow_requests.json</span> and others from the export (also multiple <code>followers_2/3…</code> files for large profiles).`,
    guide_summary:`📥 How to download your data from Instagram (2 min)`,
    guide_body:`To get the full list of followers and following you need Instagram's <b>official data export</b>. It's the only method Instagram allows third-party apps.
      <ol>
        <li>Open Instagram → <span class="pill">Profile</span> → menu ☰ → <b>Accounts Center</b>.</li>
        <li>Go to <b>Your information and permissions</b> → <b>Download your information</b>.</li>
        <li>Tap <b>Download or transfer information</b> → choose your profile.</li>
        <li>Select <b>Some of your information</b> → tick only <b>Followers and following</b> (so it's fast).</li>
        <li>For <b>Format</b> choose <span class="pill">JSON</span> (recommended), date range <b>All time</b>, then <b>Create files</b>.</li>
        <li>Instagram emails you the file (usually within minutes). Download it: it's a <b>.zip</b>.</li>
        <li>Come back here and upload it. Done. 🎉</li>
      </ol>
      <div style="margin-top:12px"><a class="btn sm" href="https://help.instagram.com/181231772500920" target="_blank" rel="noopener" style="text-decoration:none;display:inline-flex;align-items:center;gap:7px">📖 Official Instagram guide ↗</a></div>
      <div class="note">Tip: to see <b>who unfollowed you</b>, repeat the export now and then and re-upload it here: the app automatically compares with the previous time.</div>`,
    summary_title:`Summary`,
    reset_btn:`↺ New file`,
    compare_title:`📈 Changes over time`,
    compare_sub:`Comparison between the current export and a snapshot previously saved in this browser.`,
    compare_how:`<b>How the comparison works:</b> each time you upload an export, the app saves a “snapshot” of your followers and following in <b>this</b> browser's memory. On the <b>next</b> upload it compares the new export with the saved one and shows <b>who unfollowed you</b>, new followers and your changes.<br>👉 The first upload has nothing to compare against: redo the export in a few days or weeks and re-upload it here. Snapshots stay only on your device (if you change browser or clear site data, the history resets).`,
    compare_with:`Compare with:`,
    clear_snaps:`🗑 Clear history`,
    csv_btn:`⬇ Export CSV`,
    search_ph:`Search a username…`,
    sort_az:`Sort: A → Z`, sort_za:`Sort: Z → A`, sort_new:`Newest first`, sort_old:`Oldest first`,
    footer_made:`Made by Antonio Villanacci`,
    footer_free:`📊 Instats · 100% free · works offline · your data never leaves your device`,
    footer_disc:`Independent tool, not affiliated with Instagram / Meta.`,
    run_title:`📥 How to use it on your PC or phone`,
    run_body:`<div class="runsteps">
      <div class="runstep"><div class="ri">💻</div><div class="rt"><b>On a computer (Windows / Mac):</b><br>1) Download the <code>instats.html</code> file.<br>2) <b>Double-click</b> it: it opens in your browser.<br>It works <b>offline</b> too, no internet needed.</div></div>
      <div class="runstep"><div class="ri">📱</div><div class="rt"><b>On iPhone / Android:</b><br>1) Save <code>instats.html</code> to your phone.<br>2) Open it with your browser (Safari or Chrome).<br>3) To use it like an app, add it to the Home Screen: <b>iPhone</b> → Share <span class="pill">⬆️</span> → "Add to Home Screen"; <b>Android</b> → menu <span class="pill">⋮</span> → "Add to Home screen".</div></div>
      <div class="runstep"><div class="ri">🌐</div><div class="rt"><b>On your website:</b><br>Upload the file to your site and anyone can use it from their own browser. <b>No data is collected</b> — the analysis happens only in each user's browser, with no server or database.</div></div>
    </div>
    <div class="note">🔒 Privacy guaranteed: Instagram files are never sent to anyone, they stay on the device of whoever uses the app.</div>`,
    stat_followers:`Followers`, stat_following:`Following`, stat_notfb:`Don't follow you back`, stat_fans:`You don't follow back`, stat_mutual:`Mutual`, stat_pending:`Sent requests`,
    m_followers:`followers`, m_following:`following`, m_ratio:`follower/following ratio`,
    tab_notfb:`❌ Don't follow you back`, desc_notfb:`Accounts <b>you follow</b> but who <b>don't follow you back</b>. Candidates to unfollow.`,
    tab_fans:`💜 You don't follow back`, desc_fans:`Accounts who <b>follow you</b> but <b>you don't follow</b>. Your “fans”.`,
    tab_mutual:`🤝 Mutual`, desc_mutual:`Mutual follow: you follow each other.`,
    tab_pending:`⏳ Sent requests`, desc_pending:`Follow requests <b>you sent</b> that <b>haven't been accepted yet</b>. Click <b>“Cancel request”</b> to open the profile and cancel it on Instagram (tap “Requested”). Automatic cancellation isn't possible: Instagram doesn't allow it for apps.`,
    tab_followers:`👥 Your followers`, desc_followers:`All accounts that follow you.`,
    tab_following:`➡️ Accounts you follow`, desc_following:`All accounts you follow.`,
    tab_received:`📥 Requests received`, desc_received:`Follow requests <b>you received</b> (awaiting your response).`,
    tab_unfollowed:`🔄 You unfollowed`, desc_unfollowed:`Accounts <b>you recently unfollowed</b> (data provided by Instagram).`,
    tab_recentreq:`📤 Sent requests (recent)`, desc_recentreq:`Follow requests <b>you recently sent</b>. Click <b>“Cancel request”</b> to open the profile and cancel it on Instagram (tap “Requested”).`,
    tab_close:`⭐ Close friends`, desc_close:`Your “Close Friends” list.`,
    tab_blocked:`🚫 Blocked`, desc_blocked:`Accounts you've blocked.`,
    tab_restricted:`🔇 Restricted`, desc_restricted:`Accounts you've restricted.`,
    tab_hidestory:`🙈 Story hidden from`, desc_hidestory:`Accounts <b>you hid your stories from</b> (data provided by Instagram).`,
    tab_removedsug:`🙅 Removed suggestions`, desc_removedsug:`Accounts <b>you removed from suggestions</b> (data provided by Instagram).`,
    cmp_newf:`New followers`, cmp_lost:`Unfollowed you`, cmp_youf:`You started following`, cmp_youunf:`You unfollowed`,
    cmp_first:`🆕 This is the <b>first snapshot</b> saved in this browser. Re-upload a new export later to see <b>who unfollowed you</b>, new followers and more.`,
    cmp_hint_compare:`Compared with the snapshot from <b>{date}</b>. Click a box to see the names.`,
    vlabel_newFollowers:`➕ New followers`, vlabel_lostFollowers:`➖ Unfollowed you`, vlabel_youFollowed:`➡️ You started following`, vlabel_youUnfollowed:`⬅️ You unfollowed`,
    vdesc:`Result of comparing snapshots.`,
    empty_none_title:`No results.`, empty_search:`Try a different search term.`, empty_list:`This list is empty.`, empty_cmp:`<b>Nobody.</b> No change in this category.`,
    row_since:`since {date}`, open_btn:`Open ↗`, snap_foll:`followers`, cancel_req:`Cancel request ↗`,
    warn_missing_followers:`⚠️ <b>Heads up:</b> I read <b>0 followers</b> but <b>{n} following</b>. The followers file is missing, so "Don't follow you back" isn't reliable. Also upload <code>followers_1.json</code> (sometimes there are several: followers_1, followers_2…) or <b>the whole .zip</b> export. You can select multiple files at once.`,
    warn_missing_following:`⚠️ <b>Heads up:</b> I read <b>{n} followers</b> but <b>0 following</b>. The <code>following.json</code> file is missing. Also upload that file or the whole .zip export.`,
    warn_zero_mutual:`⚠️ <b>Mutual = 0:</b> none of your followers match the accounts you follow. That's very unusual and usually means the usernames in the two files are written differently in your export. I've made the matching more robust; if you still see 0, let me know and I'll adapt the app to your format.`,
    diag_title:`Detected files`,
    profile_title:`👤 Your profile`,
    statsall_title:`📊 All statistics`,
    statsall_sub:`Every piece of data found in your export, grouped by category. <b>Click a card</b> to see its detail below.`,
    grp_profilo:`Profile`, grp_relazioni:`Relationships`, grp_contenuti:`Content`, grp_attivita:`Activity`, grp_interessi:`Interests`, grp_ads:`Ads`, grp_sicurezza:`Security & logins`, grp_altro:`Other data`,
    stat_click_hint:`Click to see the detail`,
    explore_title:`🔍 Explore the whole export`,
    explore_sub:`Every single file found in your ZIP, with how many entries it contains. Nothing is hidden.`,
    explore_ph:`Search a file or a data type…`, explore_col:`Data`, explore_file:`File`, explore_n:`Entries`, explore_files:`files analyzed`,
    toast_analyzing:`Analyzing…`, toast_done:`Done! ✔`, toast_csv:`CSV exported ✔`,
    loading_text:`Analyzing your data…`, loading_sub:`Everything happens on your device, nothing is uploaded online.`,
    consent_title:`🔒 Your privacy comes first`,
    consent_body:`Instats runs <b>entirely in your browser</b>. Your Instagram data <b>never leaves your device</b>: no file is sent to any server, no account to connect, no tracking and no ads.<br><br>For any issue or report you can write to <a href="mailto:antonio.villanacci@outlook.com">antonio.villanacci@outlook.com</a>.`,
    consent_accept:`I understand and accept`,
    wiz_step1:`Privacy`, wiz_step2:`The file`, wiz_step3:`Upload`,
    wiz_back:`← Back`,
    wiz1_title:`🔒 Terms & privacy`,
    wiz1_body:`Instats runs <b>entirely in your browser</b>. Your Instagram data <b>never leaves your device</b>: no file is uploaded, no account to connect, no tracking and no ads.<br><br>For any issue or report write to <a href="mailto:antonio.villanacci@outlook.com">antonio.villanacci@outlook.com</a>.`,
    wiz1_checkbox:`I accept the Terms and the privacy policy`,
    wiz1_continue:`Continue`,
    wiz2_title:`📥 How to get the file`,
    wiz2_next:`I have the file, continue →`,
    wiz3_title:`📂 Upload the file`,
    seen_badge:`✓ seen`,
    unseen_title:`Mark as unseen`,
    toast_nodata:`No followers/following found. Check you uploaded the right ZIP.`,
    toast_readerr:`Error reading the file. Try the individual JSON files.`,
    toast_badjson:`Invalid JSON file: `, toast_nozip:`ZIP library not loaded: needs internet once, or upload the JSON files.`,
    toast_histcleared:`History cleared.`, confirm_clear:`Clear all snapshot history saved in this browser?`,
    csv_username:`username`, csv_profile:`profile`, csv_date:`date`,
  }
};

export let LANG: Lang = (localStorage.getItem('instats_lang') as Lang) || (((navigator.language||'it').slice(0,2)==='en')?'en':'it');
export function setLangValue(l: Lang){ LANG = l; }
export const t = (k: string): string => ((I18N as any)[LANG] && (I18N as any)[LANG][k]!=null) ? (I18N as any)[LANG][k] : ((I18N as any).it[k]!=null?(I18N as any).it[k]:k);
export const LOC = (): string => LANG==='it' ? 'it-IT' : 'en-US';


/* ---------- i18n apply ---------- */
export function applyI18n(){
  document.documentElement.lang=LANG;
  document.querySelectorAll('[data-i18n]').forEach((el:any)=>{ el.innerHTML=t(el.getAttribute('data-i18n')); });
  document.querySelectorAll('[data-i18n-ph]').forEach((el:any)=>{ el.placeholder=t(el.getAttribute('data-i18n-ph')); });
  const ls=document.getElementById('langSwitch'); if(ls) ls.className='lang-switch '+LANG;
  if(STATE.data){ renderSummary(); renderStats(); renderCompare();
    if(STATE._virtual && STATE.active==='_v'){ renderTabsWithVirtual(); renderListVirtual(); }
    else { renderTabs(); renderList(); }
    if(STATE.profile) renderProfile(STATE.profile);
    if(STATE.scan){ renderStatsAll(STATE.scan, STATE.data); renderExplore(STATE.scan); }
  }
}
