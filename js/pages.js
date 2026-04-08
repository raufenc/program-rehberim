/* ===== Sayfa Render Fonksiyonlari ===== */

const Pages = {

  // ==================== ANA SAYFA ====================
  home() {
    const dersler = Object.values(APP.data);
    return `
      <div class="text-center mb-6 mt-2">
        <h2 class="text-xl font-bold text-primary dark:text-primary-light">Program Rehberim</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Turkiye Yuzyili Maarif Modeli Ogretmen Asistani</p>
      </div>
      ${UI.searchBox('Ders ara...', "Pages.filterDersler(this.value)")}
      <div id="ders-grid" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        ${dersler.map(d => UI.dersCard(d)).join('')}
      </div>`;
  },

  filterDersler(q) {
    const grid = document.getElementById('ders-grid');
    if (!grid) return;
    const dersler = Object.values(APP.data).filter(d =>
      !q || d.meta.ders_adi.toLowerCase().includes(q.toLowerCase()) || d.meta.ders_kodu.toLowerCase().includes(q.toLowerCase())
    );
    grid.innerHTML = dersler.length ? dersler.map(d => UI.dersCard(d)).join('') : UI.empty('Ders bulunamadi');
  },

  // ==================== DERS ANA SAYFASI ====================
  dersAnaSayfa(dersKodu) {
    const data = APP.getData(dersKodu);
    if (!data) return UI.empty('Ders bulunamadi');
    const m = data.meta;
    const uniteler = data.program.uniteler;
    const plan = data.eslestirme.haftalik_plan;
    const dk = dersKodu.toLowerCase();

    return `
      ${UI.buHaftaKarti(dersKodu, plan, data)}
      <div class="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
        <a href="#/${dk}/haftalik" class="card p-3 text-center text-xs hover:bg-slate-50 dark:hover:bg-slate-800">\u{1F4C5}<br>Haftalik Plan</a>
        <a href="#/${dk}/kavramlar" class="card p-3 text-center text-xs hover:bg-slate-50 dark:hover:bg-slate-800">\u{1F4D6}<br>Kavramlar</a>
        <a href="#/${dk}/teknikler" class="card p-3 text-center text-xs hover:bg-slate-50 dark:hover:bg-slate-800">\u{1F527}<br>Teknikler</a>
        <a href="#/${dk}/kitap" class="card p-3 text-center text-xs hover:bg-slate-50 dark:hover:bg-slate-800">\u{1F4D5}<br>Ders Kitabi</a>
        <a href="#/${dk}/program" class="card p-3 text-center text-xs hover:bg-slate-50 dark:hover:bg-slate-800">\u{1F4C4}<br>Program PDF</a>
        <a href="#/${dk}/matris" class="card p-3 text-center text-xs hover:bg-slate-50 dark:hover:bg-slate-800">\u{1F4CA}<br>Matris</a>
      </div>
      <h2 class="font-semibold text-base mb-3">\u{1F4DA} Uniteler</h2>
      ${uniteler.map(u => UI.uniteCard(dersKodu, u, plan)).join('')}
    `;
  },

  // ==================== HAFTALIK PLAN ====================
  haftalikPlan(dersKodu, haftaNo) {
    const data = APP.getData(dersKodu);
    if (!data) return UI.empty('Ders bulunamadi');
    const plan = data.eslestirme.haftalik_plan;
    const current = haftaNo || HaftaUtils.getCurrentWeek();
    const p = plan.find(h => h.hafta === current);
    const dk = dersKodu.toLowerCase();

    return `
      <div class="flex items-center justify-between mb-4">
        <button onclick="Pages.navigateWeek('${dersKodu}', ${current - 1})" class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 ${current <= 1 ? 'opacity-30 pointer-events-none' : ''}">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div class="text-center">
          <span class="font-semibold">Hafta ${current}</span>
          <div class="text-xs text-slate-400">${HaftaUtils.formatDateRange(current)}</div>
        </div>
        <button onclick="Pages.navigateWeek('${dersKodu}', ${current + 1})" class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 ${current >= plan.length ? 'opacity-30 pointer-events-none' : ''}">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
      ${p ? UI.haftalikKart(dersKodu, p, true, data) : UI.empty('Bu hafta icin plan yok')}
      <div class="mt-6">
        <h3 class="font-semibold text-sm mb-2 flex items-center gap-2 cursor-pointer" onclick="toggleAccordion('yillik')">
          \u{1F4C5} Tum Yil <svg id="acc-icon-yillik" class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
        </h3>
        <div id="acc-yillik" class="accordion-content">
          <div class="space-y-1">
            ${plan.map(h => `<a href="#/${dk}/haftalik/${h.hafta}" class="flex items-center gap-2 p-2 rounded-lg text-xs ${h.hafta === current ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}">
              <span class="w-14">Hafta ${h.hafta}</span>
              <span class="flex-1 truncate">U${h.unite_no}: ${h.konu_ozeti.substring(0, 50)}</span>
            </a>`).join('')}
          </div>
        </div>
      </div>`;
  },

  navigateWeek(dersKodu, week) {
    const data = APP.getData(dersKodu);
    if (!data) return;
    const maxWeek = data.eslestirme.haftalik_plan.length;
    const w = Math.max(1, Math.min(week, maxWeek));
    location.hash = `#/${dersKodu.toLowerCase()}/haftalik/${w}`;
  },

  // ==================== UNITE DETAY ====================
  uniteDetay(dersKodu, uniteNo) {
    const data = APP.getData(dersKodu);
    if (!data) return UI.empty('Ders bulunamadi');
    const unite = data.program.uniteler.find(u => u.unite_no === parseInt(uniteNo));
    if (!unite) return UI.empty('Unite bulunamadi');
    const dk = dersKodu.toLowerCase();
    const activeTab = APP.state.uniteTab || 0;

    let tabContent = '';
    if (activeTab === 0) {
      // Ciktilar
      tabContent = unite.ogrenme_ciktilari.map(c =>
        UI.ciktiCard(dersKodu, uniteNo, c, data.eslestirme.cikti_kitap)
      ).join('');
    } else if (activeTab === 1) {
      // Beceriler
      tabContent = `
        ${unite.alan_becerileri?.length ? `<div class="mb-3"><h4 class="text-xs font-semibold text-slate-400 mb-1">Alan Becerileri</h4><div class="flex flex-wrap gap-1">${unite.alan_becerileri.map(b => UI.beceridBadge(b, 'badge-primary')).join('')}</div></div>` : ''}
        ${unite.kavramsal_beceriler?.length ? `<div class="mb-3"><h4 class="text-xs font-semibold text-slate-400 mb-1">Kavramsal Beceriler</h4><div class="flex flex-wrap gap-1">${unite.kavramsal_beceriler.map(b => UI.beceridBadge(b, 'badge-blue')).join('')}</div></div>` : ''}
        ${unite.egilimler?.length ? `<div class="mb-3"><h4 class="text-xs font-semibold text-slate-400 mb-1">Egilimler</h4><div class="flex flex-wrap gap-1">${unite.egilimler.map(b => UI.beceridBadge(b, 'badge-accent')).join('')}</div></div>` : ''}
        ${unite.programlar_arasi_bilesenler ? `
          ${unite.programlar_arasi_bilesenler.sosyal_duygusal_ogrenme?.length ? `<div class="mb-3"><h4 class="text-xs font-semibold text-slate-400 mb-1">Sosyal-Duygusal Ogrenme</h4><div class="flex flex-wrap gap-1">${unite.programlar_arasi_bilesenler.sosyal_duygusal_ogrenme.map(b => UI.beceridBadge(b, 'badge-pink')).join('')}</div></div>` : ''}
          ${unite.programlar_arasi_bilesenler.degerler?.length ? `<div class="mb-3"><h4 class="text-xs font-semibold text-slate-400 mb-1">Degerler</h4><div class="flex flex-wrap gap-1">${unite.programlar_arasi_bilesenler.degerler.map(b => UI.beceridBadge(b, 'badge-green')).join('')}</div></div>` : ''}
          ${unite.programlar_arasi_bilesenler.okuryazarlik_becerileri?.length ? `<div class="mb-3"><h4 class="text-xs font-semibold text-slate-400 mb-1">Okuryazarlik</h4><div class="flex flex-wrap gap-1">${unite.programlar_arasi_bilesenler.okuryazarlik_becerileri.map(b => UI.beceridBadge(b, 'badge-purple')).join('')}</div></div>` : ''}
        ` : ''}
        ${unite.disiplinler_arasi_iliskiler?.length ? `<div class="mb-3"><h4 class="text-xs font-semibold text-slate-400 mb-1">Disiplinler Arasi</h4><p class="text-sm text-slate-600 dark:text-slate-300">${unite.disiplinler_arasi_iliskiler.join(', ')}</p></div>` : ''}
      `;
    } else {
      // Icerik
      tabContent = `
        ${unite.icerik_cercevesi?.length ? `<div class="mb-4"><h4 class="text-xs font-semibold text-slate-400 mb-2">Icerik Cercevesi</h4><ul class="space-y-1">${unite.icerik_cercevesi.map(i => `<li class="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2"><span class="text-primary mt-1">\u2022</span>${i}</li>`).join('')}</ul></div>` : ''}
        ${unite.anahtar_kavramlar?.length ? `<div><h4 class="text-xs font-semibold text-slate-400 mb-2">Anahtar Kavramlar</h4><div class="flex flex-wrap gap-1">${unite.anahtar_kavramlar.map(k => `<span class="badge badge-primary cursor-pointer" onclick="openKavramByName('${dersKodu}','${k.replace(/'/g, "\\'")}')">${k}</span>`).join('')}</div></div>` : ''}
      `;
    }

    const range = HaftaUtils.getUniteWeekRange(data.eslestirme.haftalik_plan, unite.unite_no);
    return `
      <div class="flex items-center gap-3 mb-3">
        <span class="text-sm text-slate-500">${unite.ders_saati} ders saati \u2022 %${unite.yuzde_orani || ''} \u2022 Hafta ${range.baslangic}-${range.bitis}</span>
      </div>
      ${unite.unite_aciklamasi ? `<p class="text-sm text-slate-600 dark:text-slate-300 mb-4">${unite.unite_aciklamasi}</p>` : ''}
      ${UI.tabs(['Ciktilar', 'Beceriler', 'Icerik'], activeTab, 'Pages.switchUniteTab')}
      <div class="animate-fade-in">${tabContent}</div>
    `;
  },

  switchUniteTab(idx) {
    APP.state.uniteTab = idx;
    APP.render();
  },

  // ==================== CIKTI DETAY (EN ONEMLI SAYFA) ====================
  ciktiDetay(dersKodu, uniteNo, ciktiKodu) {
    const data = APP.getData(dersKodu);
    if (!data) return UI.empty('Ders bulunamadi');
    const unite = data.program.uniteler.find(u => u.unite_no === parseInt(uniteNo));
    if (!unite) return UI.empty('Unite bulunamadi');
    const cikti = unite.ogrenme_ciktilari.find(c => c.kod === ciktiKodu);
    if (!cikti) return UI.empty('Cikti bulunamadi');

    const dk = dersKodu.toLowerCase();
    const activeTab = APP.state.ciktiTab || 0;
    const eslestirme = data.eslestirme;
    const ciktiKitap = (eslestirme.cikti_kitap || []).find(c => c.cikti_kodu === ciktiKodu);
    const uygulama = (unite.ogrenme_ogretme_yasantilari?.uygulamalar || []).find(u => u.cikti_kodu === ciktiKodu);
    const kanitlar = unite.ogrenme_kanitlari;

    // QR kodlari: hem kitap hem program QR'larini birlestir
    const kitapQrs = (data.kitap?.qr_kodlar || []).filter(q => q.iliskili_cikti_kodu === ciktiKodu || (q.iliskili_unite === parseInt(uniteNo) && !q.iliskili_cikti_kodu));
    const programQrs = (data.program_qr_kodlar || []).filter(q => q.iliskili_cikti_kodu === ciktiKodu || (q.iliskili_unite === parseInt(uniteNo) && !q.iliskili_cikti_kodu));
    const allQrs = [...kitapQrs, ...programQrs];

    const tabNames = ['Ne', 'Nasil', 'Olcme', 'Fark', '\u{1F517}'];
    let tabContent = '';

    if (activeTab === 0) {
      // === NE sekmesi ===
      tabContent = `
        <div class="space-y-4">
          <div><h4 class="font-semibold text-sm mb-2">\u{1F4CB} Surec Bilesenleri</h4>
            <div class="space-y-1">${(cikti.surec_bilesenleri || []).map(s => `<div class="text-sm flex items-start gap-2"><span class="font-semibold text-primary w-5">${s.harf})</span><span class="text-slate-600 dark:text-slate-300">${s.metin}</span></div>`).join('')}</div>
          </div>
          ${ciktiKitap ? `<div class="flex items-center gap-2"><span>\u{1F4D6}</span><a href="#/${dk}/kitap/${ciktiKitap.kitap_sayfa_araligi.split('-')[0]}" class="text-primary hover:underline text-sm">Kitap: s.${ciktiKitap.kitap_sayfa_araligi}</a></div>` : ''}
          ${unite.anahtar_kavramlar?.length ? `<div><h4 class="font-semibold text-sm mb-1">\u{1F511} Anahtar Kavramlar</h4><div class="flex flex-wrap gap-1">${unite.anahtar_kavramlar.map(k => `<span class="badge badge-primary cursor-pointer" onclick="openKavramByName('${dersKodu}','${k.replace(/'/g, "\\'")}')">${k}</span>`).join('')}</div></div>` : ''}
          ${unite.ogrenme_ogretme_yasantilari?.temel_kabuller ? `<div><h4 class="font-semibold text-sm mb-1">\u{1F4A1} Temel Kabuller</h4><p class="text-sm text-slate-600 dark:text-slate-300">${unite.ogrenme_ogretme_yasantilari.temel_kabuller}</p></div>` : ''}
          ${unite.ogrenme_ogretme_yasantilari?.kopru_kurma ? `<div><h4 class="font-semibold text-sm mb-1">\u{1F309} Kopru Kurma</h4><p class="text-sm text-slate-600 dark:text-slate-300">${unite.ogrenme_ogretme_yasantilari.kopru_kurma}</p></div>` : ''}
          ${unite.ogrenme_ogretme_yasantilari?.on_degerlendirme?.length ? `<div><h4 class="font-semibold text-sm mb-1">\u2753 On Degerlendirme</h4><ul class="space-y-1">${unite.ogrenme_ogretme_yasantilari.on_degerlendirme.map(o => `<li class="text-sm text-slate-600 dark:text-slate-300">\u2022 ${o}</li>`).join('')}</ul></div>` : ''}
        </div>`;

    } else if (activeTab === 1) {
      // === NASIL sekmesi ===
      let metinHtml = '';
      if (uygulama) {
        // Uygulama metnini isleme: teknik referanslarini tiklananilir yap
        let metin = uygulama.uygulama_metni || '';
        // Teknik referanslarini linkle
        (uygulama.kullanilan_teknikler || []).forEach(t => {
          const regex = new RegExp(t.ad.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
          metin = metin.replace(regex, `<span class="teknik-link" onclick="openTeknikByName('${dersKodu}','${t.ad.replace(/'/g, "\\'")}')">${t.ad}</span>`);
        });
        // Kod referanslarini badge yap
        const kodRegex = /\b([A-Z]{1,4}\d[\d.]*)\b/g;
        metin = metin.replace(kodRegex, '<span class="kod-badge badge-gray">$1</span>');
        metinHtml = `<div class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">${metin}</div>`;
      }

      const teknikler = uygulama?.kullanilan_teknikler || [];
      tabContent = `
        <div class="space-y-4">
          ${metinHtml ? `<div><h4 class="font-semibold text-sm mb-2">\u{1F4DD} Uygulama Adimlari</h4>${metinHtml}</div>` : ''}
          ${teknikler.length ? `<div><h4 class="font-semibold text-sm mb-2">\u{1F527} Kullanilan Teknikler</h4>${teknikler.map(t => `
            <div class="card p-3 mb-2 card-clickable cursor-pointer" onclick="openTeknikByName('${dersKodu}','${t.ad.replace(/'/g, "\\'")}')">
              <div class="flex items-center justify-between">
                <span class="font-medium text-sm">${t.ad}</span>
                <span class="text-xs text-slate-400">Nasil Uygulanir? \u2192</span>
              </div>
              ${t.nerede ? `<p class="text-xs text-slate-500 mt-1">${t.nerede}</p>` : ''}
            </div>`).join('')}</div>` : ''}
        </div>`;

    } else if (activeTab === 2) {
      // === OLCME sekmesi ===
      const olcmeOnerileri = uygulama?.olcme_onerileri || [];
      tabContent = `
        <div class="space-y-4">
          ${olcmeOnerileri.length ? `<div><h4 class="font-semibold text-sm mb-2">\u{1F4CA} Olcme Araclari</h4><ul class="space-y-1">${olcmeOnerileri.map(o => `<li class="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2"><span class="text-primary">\u2022</span>${o}</li>`).join('')}</ul></div>` : ''}
          ${kanitlar?.olcme_araclari?.length ? `<div><h4 class="font-semibold text-sm mb-2">Ogrenme Kanitlari</h4><ul class="space-y-1">${kanitlar.olcme_araclari.map(o => `<li class="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2"><span class="text-primary">\u2022</span>${o}</li>`).join('')}</ul></div>` : ''}
          ${kanitlar?.performans_gorevi ? `<div><h4 class="font-semibold text-sm mb-2">\u{1F3C6} Performans Gorevi</h4>
            <p class="text-sm text-slate-600 dark:text-slate-300 mb-2">${kanitlar.performans_gorevi.aciklama}</p>
            ${kanitlar.performans_gorevi.degerlendirme_olcutleri?.length ? `<div class="space-y-1">${kanitlar.performans_gorevi.degerlendirme_olcutleri.map(o => `<div class="text-sm flex items-start gap-2"><span class="text-green-500">\u2713</span>${o}</div>`).join('')}</div>` : ''}
            ${kanitlar.performans_gorevi.degerlendirme_araci ? `<p class="text-xs text-slate-400 mt-2">Arac: ${kanitlar.performans_gorevi.degerlendirme_araci}</p>` : ''}
          </div>` : ''}
        </div>`;

    } else if (activeTab === 3) {
      // === FARK sekmesi (Farklilastirma) ===
      const fark = unite.farklilarstirma || {};
      tabContent = `
        <div class="space-y-3">
          ${(fark.zenginlestirme || []).length ? UI.accordion('\u{1F680} Zenginlestirme', `<ul class="space-y-2">${fark.zenginlestirme.map(z => `<li class="text-sm">\u2022 ${z}</li>`).join('')}</ul>`, 'zengin') : ''}
          ${(fark.destekleme || []).length ? UI.accordion('\u{1F91D} Destekleme', `<ul class="space-y-2">${fark.destekleme.map(d => `<li class="text-sm">\u2022 ${d}</li>`).join('')}</ul>`, 'destek') : ''}
        </div>`;

    } else {
      // === LINK sekmesi (QR / Dijital Icerik) ===
      if (allQrs.length) {
        const videos = allQrs.filter(q => q.tur === 'video');
        const interaktif = allQrs.filter(q => q.tur === 'interaktif');
        const others = allQrs.filter(q => q.tur !== 'video' && q.tur !== 'interaktif');
        tabContent = `
          ${videos.length ? `<h4 class="font-semibold text-sm mb-2">\u{1F3AC} Video Icerikler</h4>${videos.map(q => UI.qrCard(q, dersKodu)).join('')}` : ''}
          ${interaktif.length ? `<h4 class="font-semibold text-sm mb-2 mt-4">\u{1F5A5} Interaktif Icerikler</h4>${interaktif.map(q => UI.qrCard(q, dersKodu)).join('')}` : ''}
          ${others.length ? `<h4 class="font-semibold text-sm mb-2 mt-4">\u{1F4CB} Diger Icerikler</h4>${others.map(q => UI.qrCard(q, dersKodu)).join('')}` : ''}
        `;
      } else {
        tabContent = UI.empty('Bu cikti icin dijital icerik bulunmuyor');
      }
    }

    return `
      <div class="mb-4">
        <span class="badge badge-primary mb-2">${ciktiKodu}</span>
        <h2 class="font-semibold text-base">${cikti.baslik}</h2>
      </div>
      ${UI.tabs(tabNames, activeTab, 'Pages.switchCiktiTab')}
      <div class="animate-fade-in">${tabContent}</div>
    `;
  },

  switchCiktiTab(idx) {
    APP.state.ciktiTab = idx;
    APP.render();
  },

  // ==================== KAVRAM SOZLUGU ====================
  kavramSozlugu(dersKodu) {
    const data = APP.getData(dersKodu);
    if (!data) return UI.empty('Ders bulunamadi');
    const kavramlar = data.eslestirme.kavram_sozlugu || [];
    const uniteler = data.program.uniteler;
    const filter = APP.state.kavramFilter || 0; // 0 = tumu

    const filtered = filter === 0 ? kavramlar : kavramlar.filter(k => (k.unite || []).includes(filter));
    const sorted = [...filtered].sort((a, b) => a.kavram.localeCompare(b.kavram, 'tr'));

    return `
      ${UI.searchBox('Kavram ara...', "Pages.filterKavramlar(this.value)")}
      <div class="flex gap-1 mb-4 overflow-x-auto pb-1">
        <button onclick="Pages.setKavramFilter(0)" class="badge ${filter === 0 ? 'badge-primary' : 'badge-gray'} cursor-pointer whitespace-nowrap">Tumu</button>
        ${uniteler.map(u => `<button onclick="Pages.setKavramFilter(${u.unite_no})" class="badge ${filter === u.unite_no ? 'badge-primary' : 'badge-gray'} cursor-pointer whitespace-nowrap">U${u.unite_no}</button>`).join('')}
      </div>
      <div id="kavram-list">
        ${sorted.length ? sorted.map(k => UI.kavramCard(k, dersKodu)).join('') : UI.empty('Kavram bulunamadi')}
      </div>`;
  },

  setKavramFilter(n) {
    APP.state.kavramFilter = n;
    APP.render();
  },

  filterKavramlar(q) {
    const list = document.getElementById('kavram-list');
    if (!list) return;
    const route = APP.parseRoute();
    const data = APP.getData(route.dersKodu);
    if (!data) return;
    const kavramlar = data.eslestirme.kavram_sozlugu || [];
    const filter = APP.state.kavramFilter || 0;
    const filtered = (filter === 0 ? kavramlar : kavramlar.filter(k => (k.unite || []).includes(filter)))
      .filter(k => !q || k.kavram.toLowerCase().includes(q.toLowerCase()) || k.tanim.toLowerCase().includes(q.toLowerCase()))
      .sort((a, b) => a.kavram.localeCompare(b.kavram, 'tr'));
    list.innerHTML = filtered.length ? filtered.map(k => UI.kavramCard(k, route.dersKodu)).join('') : UI.empty('Kavram bulunamadi');
  },

  // ==================== TEKNIK KUTUPHANESI ====================
  teknikler(dersKodu) {
    let teknikler = [];
    let title = 'Tum Teknikler';
    if (dersKodu) {
      const data = APP.getData(dersKodu);
      if (!data) return UI.empty('Ders bulunamadi');
      teknikler = data.eslestirme.teknikler_kutuphanesi || [];
      title = `${data.meta.ders_adi} Teknikleri`;
    } else {
      // Tum derslerden birlestir, tekrarlari kaldir
      const seen = new Set();
      Object.values(APP.data).forEach(d => {
        (d.eslestirme.teknikler_kutuphanesi || []).forEach(t => {
          if (!seen.has(t.ad)) { seen.add(t.ad); teknikler.push(t); }
        });
      });
    }
    teknikler.sort((a, b) => a.ad.localeCompare(b.ad, 'tr'));

    return `
      <h2 class="font-semibold text-base mb-3">${title} (${teknikler.length})</h2>
      ${UI.searchBox('Teknik ara...', "Pages.filterTeknikler(this.value)")}
      <div id="teknik-list">
        ${teknikler.length ? teknikler.map(t => UI.teknikCard(t)).join('') : UI.empty('Teknik bulunamadi')}
      </div>`;
  },

  filterTeknikler(q) {
    const list = document.getElementById('teknik-list');
    if (!list) return;
    const route = APP.parseRoute();
    let teknikler = [];
    if (route.dersKodu) {
      const data = APP.getData(route.dersKodu);
      if (data) teknikler = data.eslestirme.teknikler_kutuphanesi || [];
    } else {
      const seen = new Set();
      Object.values(APP.data).forEach(d => {
        (d.eslestirme.teknikler_kutuphanesi || []).forEach(t => {
          if (!seen.has(t.ad)) { seen.add(t.ad); teknikler.push(t); }
        });
      });
    }
    const filtered = teknikler.filter(t => !q || t.ad.toLowerCase().includes(q.toLowerCase()) || t.aciklama.toLowerCase().includes(q.toLowerCase()))
      .sort((a, b) => a.ad.localeCompare(b.ad, 'tr'));
    list.innerHTML = filtered.length ? filtered.map(t => UI.teknikCard(t)).join('') : UI.empty('Teknik bulunamadi');
  },

  // ==================== DEGER-BECERI MATRISI ====================
  matris(dersKodu) {
    const data = APP.getData(dersKodu);
    if (!data) return UI.empty('Ders bulunamadi');
    const matris = data.eslestirme.deger_beceri_matrisi;
    if (!matris) return UI.empty('Matris verisi bulunamadi');
    const uniteler = data.program.uniteler;
    const dk = dersKodu.toLowerCase();

    const renderSection = (title, items, badgeClass) => {
      if (!items || !Object.keys(items).length) return '';
      return `
        <h3 class="font-semibold text-sm mt-4 mb-2">${title}</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-xs border-collapse">
            <thead><tr>
              <th class="text-left p-2 border-b dark:border-slate-700 sticky left-0 bg-white dark:bg-slate-900 min-w-[120px]">Beceri/Deger</th>
              ${uniteler.map(u => `<th class="p-2 border-b dark:border-slate-700 text-center min-w-[60px]">U${u.unite_no}</th>`).join('')}
            </tr></thead>
            <tbody>
              ${Object.entries(items).map(([key, val]) => {
                const label = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                return `<tr class="hover:bg-slate-50 dark:hover:bg-slate-800">
                  <td class="p-2 border-b dark:border-slate-700 sticky left-0 bg-white dark:bg-slate-900">${label}</td>
                  ${uniteler.map(u => {
                    const inUnite = (val.uniteler || []).includes(u.unite_no);
                    const ciktis = (val.ciktilar || []).filter(c => c.includes(`.${u.unite_no}.`));
                    return `<td class="p-2 border-b dark:border-slate-700 text-center">
                      ${inUnite ? ciktis.map(c => `<a href="#/${dk}/unite/${u.unite_no}/cikti/${c}" class="badge ${badgeClass} text-[10px] block mb-0.5">${c.split('.').pop()}</a>`).join('') || '<span class="text-primary">\u2713</span>' : ''}
                    </td>`;
                  }).join('')}
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>`;
    };

    return `
      <h2 class="font-semibold text-base mb-1">Deger-Beceri Matrisi</h2>
      <p class="text-xs text-slate-400 mb-4">Satirlar: beceriler/degerler, Sutunlar: uniteler</p>
      ${renderSection('Egilimler (Beceriler)', matris.beceriler, 'badge-blue')}
      ${renderSection('Degerler', matris.degerler, 'badge-green')}
    `;
  },

  // ==================== PDF GORUNTULEME ====================
  pdfViewer(dersKodu, tur, sayfa) {
    const data = APP.getData(dersKodu);
    if (!data) return UI.empty('Ders bulunamadi');
    const dk = dersKodu.toLowerCase();
    const sinif = data.meta.sinif;
    const pdfFile = `pdfs/${dersKodu}_${sinif}_${tur}.pdf`;
    const title = tur === 'kitap' ? 'Ders Kitabi' : 'Ogretim Programi';

    // Iliskili ciktilar (kitap viewer icin)
    let relatedInfo = '';
    if (tur === 'kitap' && sayfa) {
      const pageNum = parseInt(sayfa);
      const ciktilar = (data.eslestirme.cikti_kitap || []).filter(c => {
        const [start, end] = c.kitap_sayfa_araligi.split('-').map(Number);
        return pageNum >= start && pageNum <= end;
      });
      if (ciktilar.length) {
        relatedInfo = `<div class="mt-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <p class="text-xs text-slate-400 mb-1">\u{1F4CD} Bu sayfa ile iliskili ciktilar:</p>
          <div class="flex flex-wrap gap-1">${ciktilar.map(c => `<a href="#/${dk}/unite/${c.cikti_kodu.split('.')[2]}/cikti/${c.cikti_kodu}" class="badge badge-blue cursor-pointer hover:opacity-80">${c.cikti_kodu}</a>`).join('')}</div>
        </div>`;
      }
    }

    // PDF render sonrasi cagrilacak
    setTimeout(() => PDFViewer.open(pdfFile, parseInt(sayfa) || 1), 100);

    return `
      <div class="flex items-center justify-between mb-3">
        <h2 class="font-semibold text-base">${title}</h2>
        <a href="${pdfFile}" download class="text-sm text-primary hover:underline">\u2B07 Indir</a>
      </div>
      <div class="flex items-center gap-2 mb-3">
        <button onclick="PDFViewer.prev()" class="p-2 rounded-lg border dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <span class="text-sm">Sayfa <span id="pdf-page-num">-</span> / <span id="pdf-page-total">-</span></span>
        <button onclick="PDFViewer.next()" class="p-2 rounded-lg border dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
        </button>
        <div class="flex-1"></div>
        <input id="pdf-page-input" type="number" min="1" class="w-16 text-center text-sm border dark:border-slate-700 rounded-lg p-1 bg-white dark:bg-slate-800" onchange="PDFViewer.jumpToPage()">
        <button onclick="PDFViewer.jumpToPage()" class="text-xs text-primary hover:underline">Git</button>
      </div>
      <div id="pdf-container" class="pdf-canvas-wrapper border dark:border-slate-700 rounded-lg overflow-auto bg-slate-100 dark:bg-slate-800 min-h-[400px]">
        <canvas id="pdf-canvas"></canvas>
      </div>
      ${relatedInfo}
    `;
  },

  // ==================== AYARLAR ====================
  ayarlar() {
    const s = HaftaUtils.getSettings();
    return `
      <h2 class="font-semibold text-base mb-4">\u2699\uFE0F Ayarlar</h2>
      <div class="space-y-4">
        <div class="card p-4">
          <label class="text-sm font-medium block mb-1">Donem Baslangic</label>
          <input type="date" id="set-donem-bas" value="${s.donem_baslangic}" class="w-full p-2 border dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800">
        </div>
        <div class="card p-4">
          <label class="text-sm font-medium block mb-1">Donem Bitis</label>
          <input type="date" id="set-donem-bit" value="${s.donem_bitis}" class="w-full p-2 border dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800">
        </div>
        <div class="card p-4">
          <label class="text-sm font-medium block mb-1">Haftalik Ders Saati</label>
          <input type="number" id="set-ders-saat" value="${s.haftalik_ders_saati}" min="1" max="10" class="w-full p-2 border dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800">
        </div>
        <div class="card p-4">
          <label class="text-sm font-medium block mb-1">Tema</label>
          <select id="set-tema" class="w-full p-2 border dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800">
            <option value="light" ${s.tema === 'light' ? 'selected' : ''}>Acik</option>
            <option value="dark" ${s.tema === 'dark' ? 'selected' : ''}>Koyu</option>
            <option value="auto" ${s.tema === 'auto' ? 'selected' : ''}>Otomatik</option>
          </select>
        </div>
        <div class="card p-4">
          <label class="text-sm font-medium block mb-1">Varsayilan Ders</label>
          <select id="set-varsayilan" class="w-full p-2 border dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800">
            <option value="">Secilmedi</option>
            ${Object.values(APP.data).map(d => `<option value="${d.meta.ders_kodu}" ${s.varsayilan_ders === d.meta.ders_kodu ? 'selected' : ''}>${d.meta.ders_adi} (${d.meta.sinif})</option>`).join('')}
          </select>
        </div>
        <button onclick="Pages.saveAyarlar()" class="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition">Kaydet</button>
      </div>
      <div class="mt-6 text-center text-xs text-slate-400">
        <p>Program Rehberim v1.0</p>
        <p class="mt-1">Turkiye Yuzyili Maarif Modeli</p>
      </div>`;
  },

  saveAyarlar() {
    const s = {
      donem_baslangic: document.getElementById('set-donem-bas').value,
      donem_bitis: document.getElementById('set-donem-bit').value,
      haftalik_ders_saati: parseInt(document.getElementById('set-ders-saat').value) || 2,
      tema: document.getElementById('set-tema').value,
      varsayilan_ders: document.getElementById('set-varsayilan').value
    };
    HaftaUtils.saveSettings(s);
    APP.applyTheme(s.tema);
    APP.showToast('Ayarlar kaydedildi');
  }
};
