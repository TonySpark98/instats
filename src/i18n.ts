import { STATE } from './state';
import type { Lang } from './types';
import {
  renderSummary, renderStats, renderCompare, renderTabs, renderList,
  renderTabsWithVirtual, renderListVirtual, renderProfile, renderStatsAll, renderExplore
} from './render';

/* ---------- Traduzioni IT / EN ---------- */
export const I18N = {
  it:{
    tagline:`Scopri chi non ti segue, i tuoi fan e i profili reciproci — dal tuo export di Instagram`,
    free_badge:`✨ Gratis e open source`,
    upload_title:`1 · Carica i tuoi dati Instagram`,
    upload_sub:`<b>Consigliato:</b> carica direttamente il file <b>.zip</b> esportato da Instagram — è il modo più semplice e completo. In alternativa puoi caricare i singoli file <b>JSON</b> (anche più di uno insieme). Nessun login, nessuna password: i dati restano sul tuo dispositivo.`,
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
        <li>In <b>Formato</b> scegli <span class="pill">JSON</span> (consigliato): è il formato dell'export ufficiale di Instagram. Intervallo <b>Tutto</b>, poi <b>Crea file</b>.</li>
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
    snap_save:`⬇ Scarica snapshot`, snap_load:`⬆ Carica snapshot`,
    snap_saved:`Snapshot salvato come file ✔`, snap_loaded:`Snapshot caricato ✔`, snap_err:`File snapshot non valido.`, snap_none:`Nessuno snapshot da salvare: carica prima un export.`,
    csv_btn:`⬇ Esporta CSV`,
    search_ph:`Cerca un username…`,
    sort_az:`Ordine: A → Z`, sort_za:`Ordine: Z → A`, sort_new:`Più recenti prima`, sort_old:`Più vecchi prima`,
    refresh_warn:`⚠️ I dati restano solo in memoria: se <b>ricarichi o chiudi</b> la pagina dovrai ricaricare il file. Gli snapshot e i profili “visti” salvati restano.`,
    footer_made:`Realizzato da Antonio Villanacci`,
    footer_free:`📊 Instats · open source · funziona offline`,
    footer_disc:`Strumento indipendente, non affiliato a Instagram / Meta.`,
    run_title:`📲 Usalo come app · esegui il codice`,
    run_body:`<div class="runsteps">
      <div class="runstep"><div class="ri">📱</div><div class="rt"><b>Installalo come app — telefono:</b><br><b>iPhone (Safari):</b> apri il sito, tocca Condividi <span class="pill">⬆️</span> → «Aggiungi a Home».<br><b>Android (Chrome):</b> apri il sito, tocca il menu <span class="pill">⋮</span> → «Aggiungi a schermata Home» (o «Installa app»).</div></div>
      <div class="runstep"><div class="ri">💻</div><div class="rt"><b>Installalo come app — desktop:</b><br>In <b>Chrome</b> o <b>Edge</b> apri il sito e clicca l'icona di installazione <span class="pill">⊕</span> nella barra degli indirizzi (oppure menu → «Installa Instats»). Si apre in una finestra dedicata e funziona offline.</div></div>
      <div class="runstep"><div class="ri">⌨️</div><div class="rt"><b>Scaricalo da GitHub ed eseguilo in locale:</b><br>1) Scarica il codice da <a href="https://github.com/TonySpark98/instats" target="_blank" rel="noopener">GitHub</a> (pulsante verde «Code» → «Download ZIP», oppure <code>git clone</code>).<br>2) Nella cartella esegui <code>npm install</code>.<br>3) Poi <code>npm run dev</code> e apri l'indirizzo locale che compare. Per la versione di produzione: <code>npm run build</code>.</div></div>
    </div>
    <div class="note">🔒 Comunque tu lo usi, i file di Instagram restano sul tuo dispositivo: niente viene inviato da nessuna parte.</div>`,
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
    consent_body:`Instats funziona <b>interamente nel tuo browser</b>. I tuoi dati Instagram <b>non lasciano mai il tuo dispositivo</b>: nessun file viene inviato a server, nessun account da collegare, nessun tracciamento e nessuna pubblicità.<br><br>Per qualsiasi problema o segnalazione puoi scrivere a <a href="mailto:antonio.villanacci@icloud.com">antonio.villanacci@icloud.com</a>.`,
    consent_accept:`Ho capito e accetto`,
    wiz_step1:`Privacy`, wiz_step2:`Il file`, wiz_step3:`Carica`,
    wiz_back:`← Indietro`,
    wiz1_title:`🔒 Termini e condizioni`,
    wiz1_body:`<b>Cos'è Instats.</b> Uno strumento gratuito e open source che analizza l'export ufficiale dei tuoi dati Instagram e ti mostra follower, chi non ti segue, profili reciproci, richieste e altro.<br><br><b>Dove finiscono i tuoi dati.</b> Da nessuna parte. L'elaborazione avviene solo nel tuo browser: l'export non viene mai caricato, non serve alcun account o login, e non ci sono pubblicità, tracciatori, cookie o analytics.<br><br><b>Cosa resta su questo dispositivo.</b> Facoltativamente, gli snapshot (per confrontare i cambiamenti nel tempo) e i profili che segni come "visti" vengono salvati solo nella memoria locale del browser. Non lasciano mai il dispositivo e puoi cancellarli quando vuoi svuotando i dati del sito.<br><br><b>Accuratezza e responsabilità.</b> I risultati dipendono interamente dai dati che Instagram include nell'export e sono forniti "così come sono", senza garanzie. Usa le informazioni con responsabilità: Instats non è responsabile delle decisioni prese sulla loro base.<br><br><b>Indipendenza.</b> Instats è un progetto indipendente, non affiliato né approvato da Instagram o Meta. Rispetta i Termini d'uso di Instagram.<br><br><b>Open source e contatti.</b> Il codice è pubblico su <a href="https://github.com/TonySpark98/instats" target="_blank" rel="noopener">GitHub</a>. Domande o segnalazioni: <a href="mailto:antonio.villanacci@icloud.com">antonio.villanacci@icloud.com</a>.`,
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
    tagline:`See who doesn't follow you back, your fans and mutuals — from your own Instagram export`,
    free_badge:`✨ Free & open source`,
    upload_title:`1 · Upload your Instagram data`,
    upload_sub:`<b>Recommended:</b> upload the <b>.zip</b> exported from Instagram directly — it's the easiest and most complete way. Alternatively you can upload the individual <b>JSON</b> files (several at once). No login, no password: your data stays on your device.`,
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
        <li>For <b>Format</b> choose <span class="pill">JSON</span> (recommended): it's the format of Instagram's official export. Date range <b>All time</b>, then <b>Create files</b>.</li>
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
    snap_save:`⬇ Save snapshot`, snap_load:`⬆ Load snapshot`,
    snap_saved:`Snapshot saved as a file ✔`, snap_loaded:`Snapshot loaded ✔`, snap_err:`Invalid snapshot file.`, snap_none:`No snapshot to save: load an export first.`,
    csv_btn:`⬇ Export CSV`,
    search_ph:`Search a username…`,
    sort_az:`Sort: A → Z`, sort_za:`Sort: Z → A`, sort_new:`Newest first`, sort_old:`Oldest first`,
    refresh_warn:`⚠️ Data is kept in memory only: if you <b>refresh or close</b> the page you will need to upload the file again. Saved snapshots and “seen” profiles remain.`,
    footer_made:`Made by Antonio Villanacci`,
    footer_free:`📊 Instats · open source · works offline`,
    footer_disc:`Independent tool, not affiliated with Instagram / Meta.`,
    run_title:`📲 Use it as an app · run the code`,
    run_body:`<div class="runsteps">
      <div class="runstep"><div class="ri">📱</div><div class="rt"><b>Install as an app — phone:</b><br><b>iPhone (Safari):</b> open the site, tap Share <span class="pill">⬆️</span> → "Add to Home Screen".<br><b>Android (Chrome):</b> open the site, tap the menu <span class="pill">⋮</span> → "Add to Home screen" (or "Install app").</div></div>
      <div class="runstep"><div class="ri">💻</div><div class="rt"><b>Install as an app — desktop:</b><br>In <b>Chrome</b> or <b>Edge</b>, open the site and click the install icon <span class="pill">⊕</span> in the address bar (or menu → "Install Instats"). It opens in its own window and works offline.</div></div>
      <div class="runstep"><div class="ri">⌨️</div><div class="rt"><b>Download from GitHub and run it locally:</b><br>1) Get the code from <a href="https://github.com/TonySpark98/instats" target="_blank" rel="noopener">GitHub</a> (green "Code" button → "Download ZIP", or <code>git clone</code>).<br>2) In the folder run <code>npm install</code>.<br>3) Then <code>npm run dev</code> and open the local URL it prints. For a production build: <code>npm run build</code>.</div></div>
    </div>
    <div class="note">🔒 However you run it, your Instagram files stay on your device — nothing is sent anywhere.</div>`,
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
    consent_body:`Instats runs <b>entirely in your browser</b>. Your Instagram data <b>never leaves your device</b>: no file is sent to any server, no account to connect, no tracking and no ads.<br><br>For any issue or report you can write to <a href="mailto:antonio.villanacci@icloud.com">antonio.villanacci@icloud.com</a>.`,
    consent_accept:`I understand and accept`,
    wiz_step1:`Privacy`, wiz_step2:`The file`, wiz_step3:`Upload`,
    wiz_back:`← Back`,
    wiz1_title:`🔒 Terms & conditions`,
    wiz1_body:`<b>What Instats is.</b> A free, open-source tool that analyzes the official export of your Instagram data and shows your followers, who doesn't follow you back, mutuals, requests and more.<br><br><b>Where your data goes.</b> Nowhere. All processing happens only in your browser: your export is never uploaded, no account or login is required, and there are no ads, trackers, cookies or analytics.<br><br><b>What stays on this device.</b> Optionally, snapshots (to compare changes over time) and the profiles you mark as "seen" are saved only in your browser's local storage. They never leave your device and you can erase them anytime by clearing the site data.<br><br><b>Accuracy &amp; responsibility.</b> Results depend entirely on the data Instagram includes in your export and are provided "as is", without warranty. Use the information responsibly: Instats is not liable for decisions you make based on it.<br><br><b>Independence.</b> Instats is an independent project, not affiliated with or endorsed by Instagram or Meta. Please respect Instagram's Terms of Use.<br><br><b>Open source &amp; contact.</b> The source code is public on <a href="https://github.com/TonySpark98/instats" target="_blank" rel="noopener">GitHub</a>. Questions or reports: <a href="mailto:antonio.villanacci@icloud.com">antonio.villanacci@icloud.com</a>.`,
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

export let LANG: Lang = (localStorage.getItem('instats_lang') as Lang) || 'en';
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
