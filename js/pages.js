/* ===== Sayfa Render Fonksiyonlari ===== */

// ==================== OLCME ARACLARI SOZLUGU ====================
const OLCME_ARACLARI = {
  'acik uclu sorular':            { icon: '\u{1F4DD}', aciklama: 'Ogrencinin ozgurce fikirlerini ifade ettigi sorular.', nasil: 'Neden/nasil ile baslayan sorular sorun.', sure: '10-15 dk' },
  'kisa cevapli sorular':         { icon: '\u{270F}\uFE0F', aciklama: '1-3 cumle ile cevap verilen sorular.', nasil: '3-5 soru hazirlayin, sinifta tartisin.', sure: '5-10 dk' },
  'kavram haritasi':              { icon: '\u{1F5FA}\uFE0F', aciklama: 'Kavramlar arasi iliskileri gosteren sema.', nasil: 'Merkeze ana kavrami yazin, dallari eklettirin.', sure: '15-20 dk' },
  'cikis karti':                  { icon: '\u{1F3AB}', aciklama: 'Ders sonunda ogrencinin ogrendiklerini yazdigi kart.', nasil: 'Ders sonunda 1 soru sorun, kagitta yazdirin.', sure: '3-5 dk' },
  'oz degerlendirme formu':       { icon: '\u{1FA9E}', aciklama: 'Ogrencinin kendi ogrenme surecini degerlendirdigi form.', nasil: 'Likert olcekli form dagitip doldurtun.', sure: '5-10 dk' },
  'performans gorevi':            { icon: '\u{1F3C6}', aciklama: 'Gercek hayat problemine dayali uygulama gorevi.', nasil: 'Rubrik ile degerlendirin.', sure: 'Degisken' },
  'kontrol listesi':              { icon: '\u2705', aciklama: 'Belirli davranis veya becerilerin gozlemlendigi liste.', nasil: 'Gozlem sirasinda isaretleyin.', sure: '5-10 dk' },
  'gozlem formu':                 { icon: '\u{1F441}\uFE0F', aciklama: 'Ogretmenin ogrenci davranislarini kaydettigi form.', nasil: 'Ders sirasinda notlar alin.', sure: 'Ders boyunca' },
  'akran degerlendirmesi':        { icon: '\u{1F465}', aciklama: 'Ogrencilerin birbirlerini degerlendirmesi.', nasil: 'Olcut listesi dagitip eslestirin.', sure: '10-15 dk' },
  'bosluk doldurma':              { icon: '\u{1F4CB}', aciklama: 'Eksik kelimelerin tamamlandigi test.', nasil: 'Temel kavramlari bosluklarla hazirlayin.', sure: '5-10 dk' },
  'eslestirme':                   { icon: '\u{1F517}', aciklama: 'Iliskili kavramlarin eslestirildigi etkinlik.', nasil: 'Iki sutunlu liste hazirlayin.', sure: '5-10 dk' },
  'anlam cozumleme tablosu':      { icon: '\u{1F4CA}', aciklama: 'Kavramlarin ozelliklerinin tablo seklinde karsilastirilmasi.', nasil: 'Satirlara kavram, sutunlara ozellik yazin.', sure: '15-20 dk' },
  'tanilayici dallanmis agac':    { icon: '\u{1F333}', aciklama: 'Evet/hayir sorulariyla kavram anlayisini olcen arac.', nasil: 'Sorulari dallandirilmis sekilde hazirlayin.', sure: '10-15 dk' },
  'cumle tamamlama sorulari':     { icon: '\u{1F4AC}', aciklama: 'Baslangic cumlelerinin tamamlandigi etkinlik.', nasil: 'Acik uclu cumle baslangiclarini hazirlayin.', sure: '5-10 dk' },
  'frayer diyagrami':             { icon: '\u{1F532}', aciklama: 'Kavram, tanim, ornek, ornek olmayan 4 bolumlu sema.', nasil: 'Sablonu dagitip 4 bolumu doldurun.', sure: '15-20 dk' },
  'bilgi kartlari':               { icon: '\u{1F0CF}', aciklama: 'Ogrencilerin bilgileri kartlara yazdigi etkinlik.', nasil: 'Bos kartlar dagitip yazdirin.', sure: '10-15 dk' },
  'ogrenme gunlugu':              { icon: '\u{1F4D3}', aciklama: 'Ogrencinin ogrenme surecini yazdigi gunluk.', nasil: 'Her dersten sonra not tutturun.', sure: '5-10 dk' },
  'coklu cevapli sorular':        { icon: '\u{1F518}', aciklama: 'Secenekli test sorulari.', nasil: '4-5 secenekli sorular hazirlayin.', sure: '10-15 dk' },
  'evet-hayir kartlari':          { icon: '\u{1F7E2}', aciklama: 'Dogru/yanlis ifadelerle hizli kontrol.', nasil: 'Ifadeleri okuyun, kart kaldirtin.', sure: '5-10 dk' },
  'yansitici yazi':               { icon: '\u{270D}\uFE0F', aciklama: 'Ogrencinin konuyu kendi bakis acisiyla yazmasi.', nasil: 'Yonlendirici sorularla yazdirin.', sure: '10-15 dk' },
};

// Olcme araci normalize edesme
function matchOlcmeAraci(name) {
  if (!name) return null;
  const normalized = name.toLowerCase()
    .replace(/[ıİ]/g, 'i').replace(/[öÖ]/g, 'o').replace(/[üÜ]/g, 'u')
    .replace(/[çÇ]/g, 'c').replace(/[şŞ]/g, 's').replace(/[ğĞ]/g, 'g')
    .replace(/[âÂ]/g, 'a').replace(/[î]/g, 'i').replace(/[ûÛ]/g, 'u')
    .replace(/\s+/g, ' ').trim();
  // Tam eslesme
  if (OLCME_ARACLARI[normalized]) return OLCME_ARACLARI[normalized];
  // Kismen eslesme
  for (const [key, val] of Object.entries(OLCME_ARACLARI)) {
    if (normalized.includes(key) || key.includes(normalized)) return val;
  }
  return null;
}

// Ders akisi bolum bileseni
function lessonFlowSection(icon, title, content, id, expanded = false) {
  if (!content || content.trim() === '' || content.trim() === '<div class="pb-4 text-sm text-slate-600 dark:text-slate-300 space-y-3"></div>') return '';
  return `<div class="border-l-4 ${expanded ? 'border-primary' : 'border-slate-200 dark:border-slate-700'} pl-4 mb-4">
    <button class="w-full flex items-center gap-2 py-2 text-left group" onclick="toggleAccordion('lf-${id}')">
      <span class="text-lg">${icon}</span>
      <span class="font-semibold text-sm flex-1">${title}</span>
      <svg id="acc-icon-lf-${id}" class="w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
    </button>
    <div id="acc-lf-${id}" class="accordion-content ${expanded ? 'open' : ''}">
      <div class="pb-4 text-sm text-slate-600 dark:text-slate-300 space-y-3">${content}</div>
    </div>
  </div>`;
}


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
      <div class="grid grid-cols-3 sm:grid-cols-7 gap-2 mb-4">
        <a href="#/${dk}/haftalik" class="card p-3 text-center text-xs hover:bg-slate-50 dark:hover:bg-slate-800">\u{1F4C5}<br>Haftalik Plan</a>
        <a href="#/${dk}/kavramlar" class="card p-3 text-center text-xs hover:bg-slate-50 dark:hover:bg-slate-800">\u{1F4D6}<br>Kavramlar</a>
        <a href="#/${dk}/teknikler" class="card p-3 text-center text-xs hover:bg-slate-50 dark:hover:bg-slate-800">\u{1F527}<br>Teknikler</a>
        <a href="#/${dk}/kitap" class="card p-3 text-center text-xs hover:bg-slate-50 dark:hover:bg-slate-800">\u{1F4D5}<br>Ders Kitabi</a>
        <a href="#/${dk}/program" class="card p-3 text-center text-xs hover:bg-slate-50 dark:hover:bg-slate-800">\u{1F4C4}<br>Program PDF</a>
        <a href="#/${dk}/matris" class="card p-3 text-center text-xs hover:bg-slate-50 dark:hover:bg-slate-800">\u{1F4CA}<br>Matris</a>
        <a href="#/${dk}/materyaller" class="card p-3 text-center text-xs hover:bg-slate-50 dark:hover:bg-slate-800">\u{1F4E6}<br>Materyaller</a>
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

  // ==================== CIKTI DETAY — KRONOLOJIK DERS AKISI ====================
  ciktiDetay(dersKodu, uniteNo, ciktiKodu) {
    const data = APP.getData(dersKodu);
    if (!data) return UI.empty('Ders bulunamadi');
    const unite = data.program.uniteler.find(u => u.unite_no === parseInt(uniteNo));
    if (!unite) return UI.empty('Unite bulunamadi');
    const cikti = unite.ogrenme_ciktilari.find(c => c.kod === ciktiKodu);
    if (!cikti) return UI.empty('Cikti bulunamadi');

    const dk = dersKodu.toLowerCase();
    const eslestirme = data.eslestirme;
    const ciktiKitap = (eslestirme.cikti_kitap || []).find(c => c.cikti_kodu === ciktiKodu);
    const uygulama = (unite.ogrenme_ogretme_yasantilari?.uygulamalar || []).find(u => u.cikti_kodu === ciktiKodu);
    const kanitlar = unite.ogrenme_kanitlari;
    const fark = unite.farklilarstirma || {};

    // Haftalik plan bu ciktiyi iceren haftalari bul
    const ilgiliHaftalar = (eslestirme.haftalik_plan || []).filter(h => (h.cikti_kodlari || []).includes(ciktiKodu));

    // Kitap materyalleri bu cikti icin
    const allMateryaller = data.kitap?.materyaller || [];
    const ciktiMatIds = ciktiKitap?.iliskili_materyaller || [];
    const ciktiMateryaller = allMateryaller.filter(m => ciktiMatIds.includes(m.id));

    // QR kodlari
    const kitapQrs = (data.kitap?.qr_kodlar || []).filter(q => q.iliskili_cikti_kodu === ciktiKodu || (q.iliskili_unite === parseInt(uniteNo) && !q.iliskili_cikti_kodu));
    const programQrs = (data.program_qr_kodlar || []).filter(q => q.iliskili_cikti_kodu === ciktiKodu || (q.iliskili_unite === parseInt(uniteNo) && !q.iliskili_cikti_kodu));
    const allQrs = [...kitapQrs, ...programQrs];

    // Teknikler - kullanilan_teknikler'den detaylari bul
    const teknikRefs = uygulama?.kullanilan_teknikler || [];
    const teknikKutuphane = eslestirme.teknikler_kutuphanesi || [];

    // ===== 1. DERS ONCESI =====
    let dersOncesiContent = '';
    // Hazirlik notu
    if (ilgiliHaftalar.length) {
      const notlar = ilgiliHaftalar.filter(h => h.hazirlik_notu).map(h => h.hazirlik_notu);
      if (notlar.length) {
        dersOncesiContent += `<div class="bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 p-3 rounded-lg">
          <span class="font-semibold">\u26A0\uFE0F Hazirlik Notu:</span> ${notlar.join(' ')}
        </div>`;
      }
    }
    // Materyal checklist
    const materyalSet = new Set();
    teknikRefs.forEach(t => {
      const full = teknikKutuphane.find(tk => tk.ad.toLowerCase() === t.ad.toLowerCase() || tk.ad.toLowerCase().includes(t.ad.toLowerCase()) || t.ad.toLowerCase().includes(tk.ad.toLowerCase()));
      if (full?.gerekli_materyal) materyalSet.add(full.gerekli_materyal);
    });
    // Kitap materyalleri de ekle (tablo, gorsel turu olanlar hazirlik gerektirir)
    ciktiMateryaller.filter(m => m.tur === 'tablo' || m.tur === 'gorsel').forEach(m => {
      materyalSet.add(`${m.baslik} (s.${m.sayfa})`);
    });
    if (materyalSet.size) {
      dersOncesiContent += `<div>
        <h4 class="font-semibold text-xs text-slate-500 uppercase tracking-wide mb-1">\u{1F4E6} Hazirlanacak Materyaller</h4>
        <div class="space-y-1">${[...materyalSet].map(m => `<label class="flex items-start gap-2 text-sm"><input type="checkbox" class="mt-0.5 rounded border-slate-300 dark:border-slate-600"> <span>${m}</span></label>`).join('')}</div>
      </div>`;
    }
    // Kitap sayfasi link
    if (ciktiKitap) {
      dersOncesiContent += `<div class="flex items-center gap-2">
        <span>\u{1F4D6}</span>
        <a href="#/${dk}/kitap/${ciktiKitap.kitap_sayfa_araligi.split('-')[0]}" class="text-primary hover:underline text-sm font-medium">Ders Kitabi: Sayfa ${ciktiKitap.kitap_sayfa_araligi}</a>
      </div>`;
    }
    // Hafta bilgisi
    if (ilgiliHaftalar.length) {
      dersOncesiContent += `<div class="text-xs text-slate-400">\u{1F4C5} ${ilgiliHaftalar.map(h => `Hafta ${h.hafta}`).join(', ')} \u2022 ${ilgiliHaftalar.reduce((s, h) => s + (h.ders_saati || 0), 0)} ders saati</div>`;
    }

    // ===== 2. GIRIS / ISINMA =====
    let girisContent = '';
    const ooy = unite.ogrenme_ogretme_yasantilari || {};
    if (ooy.temel_kabuller) {
      girisContent += `<div><h4 class="font-semibold text-xs text-slate-500 uppercase tracking-wide mb-1">\u{1F4A1} Temel Kabuller</h4><p class="text-sm">${ooy.temel_kabuller}</p></div>`;
    }
    if (ooy.kopru_kurma) {
      girisContent += `<div><h4 class="font-semibold text-xs text-slate-500 uppercase tracking-wide mb-1">\u{1F309} Kopru Kurma</h4><p class="text-sm">${ooy.kopru_kurma}</p></div>`;
    }
    if (ooy.on_degerlendirme?.length) {
      girisContent += `<div><h4 class="font-semibold text-xs text-slate-500 uppercase tracking-wide mb-1">\u2753 On Degerlendirme Sorulari</h4>
        <ul class="space-y-1">${ooy.on_degerlendirme.map(o => `<li class="flex items-start gap-2"><span class="text-primary mt-0.5">\u25B8</span><span>${o}</span></li>`).join('')}</ul>
      </div>`;
    }

    // ===== 3. OGRETIM =====
    let ogretimContent = '';
    // Surec bilesenleri
    if (cikti.surec_bilesenleri?.length) {
      ogretimContent += `<div>
        <h4 class="font-semibold text-xs text-slate-500 uppercase tracking-wide mb-2">\u{1F4CB} Surec Bilesenleri</h4>
        <div class="space-y-2">${cikti.surec_bilesenleri.map(s => `<div class="flex items-start gap-2">
          <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex-shrink-0">${s.harf}</span>
          <span class="text-sm">${s.metin}</span>
        </div>`).join('')}</div>
      </div>`;
    }
    // Uygulama metni
    if (uygulama?.uygulama_metni) {
      let metin = uygulama.uygulama_metni;
      // Teknik referanslarini tiklananilir yap
      teknikRefs.forEach(t => {
        const regex = new RegExp(t.ad.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        metin = metin.replace(regex, `<span class="teknik-link" onclick="openTeknikByName('${dersKodu}','${t.ad.replace(/'/g, "\\'")}')">${t.ad}</span>`);
      });
      // Yetkinlik kodlarini badge yap
      const kodRegex = /\b([A-Z]{1,4}\d[\d.]*)\b/g;
      metin = metin.replace(kodRegex, (match) => {
        const y = typeof Yetkinlikler !== 'undefined' ? Yetkinlikler.get(match) : null;
        if (y) {
          const cls = Yetkinlikler.getBadgeClass(match);
          return `<span class="badge ${cls} text-xs cursor-pointer hover:ring-2 ring-offset-1" onclick="event.stopPropagation();Yetkinlikler.showModal('${match}')">${match}</span>`;
        }
        return `<span class="kod-badge badge-gray">${match}</span>`;
      });
      ogretimContent += `<div>
        <h4 class="font-semibold text-xs text-slate-500 uppercase tracking-wide mb-2">\u{1F4DD} Uygulama Rehberi</h4>
        <div class="text-sm leading-relaxed whitespace-pre-line">${metin}</div>
      </div>`;
    }
    // Teknik mini-kartlari
    if (teknikRefs.length) {
      ogretimContent += `<div>
        <h4 class="font-semibold text-xs text-slate-500 uppercase tracking-wide mb-2">\u{1F527} Kullanilacak Teknikler</h4>
        <div class="grid gap-2">${teknikRefs.map(t => {
          const full = teknikKutuphane.find(tk => tk.ad.toLowerCase() === t.ad.toLowerCase() || tk.ad.toLowerCase().includes(t.ad.toLowerCase()) || t.ad.toLowerCase().includes(tk.ad.toLowerCase()));
          return `<div class="card p-3 card-clickable cursor-pointer" onclick="openTeknikByName('${dersKodu}','${t.ad.replace(/'/g, "\\'")}')">
            <div class="flex items-center justify-between mb-1">
              <span class="font-medium text-sm">\u{1F527} ${t.ad}</span>
              ${full?.sure_tahmini ? `<span class="text-xs text-slate-400">\u23F1 ${full.sure_tahmini}</span>` : ''}
            </div>
            ${t.nerede ? `<p class="text-xs text-slate-500 dark:text-slate-400 mb-1"><span class="font-medium">Nerede:</span> ${t.nerede}</p>` : ''}
            ${full?.gerekli_materyal ? `<p class="text-xs text-slate-400"><span class="font-medium">\u{1F4E6}</span> ${full.gerekli_materyal}</p>` : ''}
          </div>`;
        }).join('')}</div>
      </div>`;
    }
    // Kitap materyalleri (tablo, gorsel, bilgi kutusu)
    const ogretimMats = ciktiMateryaller.filter(m => ['tablo', 'gorsel', 'bilgi_kutusu', 'okuma_metni'].includes(m.tur));
    if (ogretimMats.length) {
      ogretimContent += `<div>
        <h4 class="font-semibold text-xs text-slate-500 uppercase tracking-wide mb-2">\u{1F4D5} Kitap Kaynaklari</h4>
        <div class="space-y-1">${ogretimMats.map(m => {
          const turIcon = { tablo: '\u{1F4CA}', gorsel: '\u{1F5BC}\uFE0F', bilgi_kutusu: '\u{1F4E6}', okuma_metni: '\u{1F4D6}' }[m.tur] || '\u{1F4C4}';
          return `<a href="#/${dk}/kitap/${m.sayfa}" class="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition">
            <span>${turIcon}</span>
            <span class="text-sm flex-1">${m.baslik}</span>
            <span class="text-xs text-slate-400">s.${m.sayfa}</span>
          </a>`;
        }).join('')}</div>
      </div>`;
    }

    // ===== 4. UYGULAMA / PRATIK =====
    let uygulamaContent = '';
    // Etkinlik materyalleri
    const etkinlikMats = ciktiMateryaller.filter(m => ['etkinlik', 'proje_gorevi'].includes(m.tur));
    if (etkinlikMats.length) {
      uygulamaContent += `<div>
        <h4 class="font-semibold text-xs text-slate-500 uppercase tracking-wide mb-2">\u{1F3AF} Etkinlikler</h4>
        <div class="space-y-2">${etkinlikMats.map(m => `<a href="#/${dk}/kitap/${m.sayfa}" class="card p-3 block hover:bg-slate-50 dark:hover:bg-slate-800 transition">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">${m.tur === 'proje_gorevi' ? '\u{1F3C6}' : '\u{1F3AE}'} ${m.baslik}</span>
            <span class="text-xs text-slate-400">s.${m.sayfa}</span>
          </div>
          ${m.aciklama ? `<p class="text-xs text-slate-500 mt-1">${m.aciklama}</p>` : ''}
        </a>`).join('')}</div>
      </div>`;
    }
    // Iliskilendirilen kodlar (yetkinlik badgeleri)
    const kodlar = uygulama?.iliskilendirilen_kodlar || [];
    if (kodlar.length) {
      uygulamaContent += `<div>
        <h4 class="font-semibold text-xs text-slate-500 uppercase tracking-wide mb-2">\u{1F517} Iliskilendirilen Yetkinlikler</h4>
        <div class="flex flex-wrap gap-1">${kodlar.map(k => {
          const y = typeof Yetkinlikler !== 'undefined' ? Yetkinlikler.get(k) : null;
          const label = y ? `${k} ${y.ad}` : k;
          const cls = y ? Yetkinlikler.getBadgeClass(k) : 'badge-gray';
          return `<span class="badge ${cls} text-xs mr-1 mb-1 cursor-pointer hover:ring-2 ring-offset-1" onclick="event.stopPropagation();Yetkinlikler.showModal('${k}')">${label}</span>`;
        }).join('')}</div>
      </div>`;
    }
    // Anahtar kavramlar
    if (unite.anahtar_kavramlar?.length) {
      uygulamaContent += `<div>
        <h4 class="font-semibold text-xs text-slate-500 uppercase tracking-wide mb-2">\u{1F511} Anahtar Kavramlar</h4>
        <div class="flex flex-wrap gap-1">${unite.anahtar_kavramlar.map(k => `<span class="badge badge-primary cursor-pointer" onclick="openKavramByName('${dersKodu}','${k.replace(/'/g, "\\'")}')">${k}</span>`).join('')}</div>
      </div>`;
    }

    // ===== 5. OLCME / DEGERLENDIRME =====
    let olcmeContent = '';
    // Olcme onerileri - OLCME_ARACLARI ile zenginlestir
    const olcmeOnerileri = uygulama?.olcme_onerileri || [];
    if (olcmeOnerileri.length) {
      olcmeContent += `<div>
        <h4 class="font-semibold text-xs text-slate-500 uppercase tracking-wide mb-2">\u{1F4CA} Onerilen Olcme Araclari</h4>
        <div class="grid gap-2">${olcmeOnerileri.map(o => {
          const info = matchOlcmeAraci(o);
          if (info) {
            return `<div class="card p-3">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-lg">${info.icon}</span>
                <span class="font-medium text-sm">${o}</span>
                <span class="text-xs text-slate-400 ml-auto">\u23F1 ${info.sure}</span>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">${info.aciklama}</p>
              <p class="text-xs text-primary/80"><span class="font-medium">Uygulama:</span> ${info.nasil}</p>
            </div>`;
          }
          return `<div class="card p-3 flex items-center gap-2"><span>\u{1F4CC}</span><span class="text-sm">${o}</span></div>`;
        }).join('')}</div>
      </div>`;
    }
    // Ogrenme kanitlari - unite seviyesi olcme araclari
    if (kanitlar?.olcme_araclari?.length) {
      olcmeContent += `<div>
        <h4 class="font-semibold text-xs text-slate-500 uppercase tracking-wide mb-2">Unite Olcme Araclari</h4>
        <div class="flex flex-wrap gap-1">${kanitlar.olcme_araclari.map(o => {
          const info = matchOlcmeAraci(o);
          const icon = info ? info.icon : '\u{1F4CC}';
          return `<span class="badge badge-gray text-xs">${icon} ${o}</span>`;
        }).join('')}</div>
      </div>`;
    }
    // Performans gorevi
    if (kanitlar?.performans_gorevi) {
      const pg = kanitlar.performans_gorevi;
      olcmeContent += `<div>
        <h4 class="font-semibold text-xs text-slate-500 uppercase tracking-wide mb-2">\u{1F3C6} Performans Gorevi</h4>
        <div class="card p-3">
          <p class="text-sm mb-2">${pg.aciklama}</p>
          ${pg.degerlendirme_olcutleri?.length ? `<div class="mb-2"><span class="text-xs font-medium text-slate-400">Olcutler:</span><div class="flex flex-wrap gap-1 mt-1">${pg.degerlendirme_olcutleri.map(o => `<span class="badge badge-green text-xs">\u2713 ${o}</span>`).join('')}</div></div>` : ''}
          ${pg.degerlendirme_araci ? `<p class="text-xs text-slate-400">Arac: ${pg.degerlendirme_araci}</p>` : ''}
        </div>
      </div>`;
    }
    // Degerlendirme sorusu materyalleri
    const degerMats = ciktiMateryaller.filter(m => m.tur === 'degerlendirme_sorusu');
    if (degerMats.length) {
      olcmeContent += `<div>
        <h4 class="font-semibold text-xs text-slate-500 uppercase tracking-wide mb-2">\u{1F4DD} Kitaptaki Degerlendirme Sorulari</h4>
        <div class="space-y-1">${degerMats.map(m => `<a href="#/${dk}/kitap/${m.sayfa}" class="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition">
          <span>\u{1F4CB}</span>
          <span class="text-sm flex-1">${m.baslik}</span>
          <span class="text-xs text-slate-400">s.${m.sayfa}</span>
        </a>`).join('')}</div>
      </div>`;
    }

    // ===== 6. KAPAN / ZENGINLESTIRME =====
    let kapanContent = '';
    if (fark.zenginlestirme?.length) {
      kapanContent += `<div>
        <h4 class="font-semibold text-xs text-slate-500 uppercase tracking-wide mb-2">\u{1F680} Zenginlestirme</h4>
        <ul class="space-y-2">${fark.zenginlestirme.map(z => `<li class="flex items-start gap-2"><span class="text-green-500 mt-0.5">\u25B8</span><span class="text-sm">${z}</span></li>`).join('')}</ul>
      </div>`;
    }
    if (fark.destekleme?.length) {
      kapanContent += `<div>
        <h4 class="font-semibold text-xs text-slate-500 uppercase tracking-wide mb-2">\u{1F91D} Destekleme</h4>
        <ul class="space-y-2">${fark.destekleme.map(d => `<li class="flex items-start gap-2"><span class="text-blue-500 mt-0.5">\u25B8</span><span class="text-sm">${d}</span></li>`).join('')}</ul>
      </div>`;
    }
    // QR / Dijital icerik
    if (allQrs.length) {
      kapanContent += `<div>
        <h4 class="font-semibold text-xs text-slate-500 uppercase tracking-wide mb-2">\u{1F4F1} Dijital Icerikler</h4>
        <div class="space-y-2">${allQrs.map(q => {
          const icon = UI.qrIcon(q.tur);
          const title = q.baslik || q.aciklama || q.tur;
          return `<div class="card p-3 flex items-center gap-3">
            <span class="text-xl">${icon}</span>
            <div class="flex-1 min-w-0">
              <span class="text-sm font-medium block truncate">${title}</span>
              <span class="text-xs text-slate-400">${q.tur.replace(/_/g, ' ')}${q.sayfa ? ' \u2022 s.' + q.sayfa : ''}</span>
            </div>
            ${q.url_tespit_edildi && q.url ? `<a href="${q.url}" target="_blank" rel="noopener" class="text-xs text-primary hover:underline flex-shrink-0" onclick="event.stopPropagation()">Ac \u2197</a>` : ''}
          </div>`;
        }).join('')}</div>
      </div>`;
    }

    // ===== SAYFAYI OLUSTUR =====
    return `
      <div class="mb-4">
        <span class="badge badge-primary mb-2">${ciktiKodu}</span>
        <h2 class="font-semibold text-base">${cikti.baslik}</h2>
      </div>
      <div class="space-y-1">
        ${lessonFlowSection('\u{1F4CB}', 'Ders Oncesi', dersOncesiContent, `dersoncesi-${ciktiKodu}`, true)}
        ${lessonFlowSection('\u{1F514}', 'Giris / Isinma', girisContent, `giris-${ciktiKodu}`, false)}
        ${lessonFlowSection('\u{1F4D6}', 'Ogretim', ogretimContent, `ogretim-${ciktiKodu}`, true)}
        ${lessonFlowSection('\u{1F3AF}', 'Uygulama / Pratik', uygulamaContent, `uygulama-${ciktiKodu}`, false)}
        ${lessonFlowSection('\u{1F4CA}', 'Olcme / Degerlendirme', olcmeContent, `olcme-${ciktiKodu}`, false)}
        ${lessonFlowSection('\u{1F680}', 'Kapan / Zenginlestirme', kapanContent, `kapan-${ciktiKodu}`, false)}
      </div>
    `;
  },

  // ==================== MATERYAL KUTUPHANESI ====================
  materyalKutuphanesi(dersKodu, matType) {
    const data = APP.getData(dersKodu);
    if (!data) return UI.empty('Ders bulunamadi');
    const dk = dersKodu.toLowerCase();
    const allMat = data.kitap?.materyaller || [];
    const uniteler = data.program.uniteler;
    const activeType = matType || APP.state.matFilter || 'tumu';
    const activeUnite = APP.state.matUniteFilter || 0;
    const query = APP.state.matSearchQuery || '';

    // Materyal turlerini belirle
    const turler = [
      { key: 'tumu', label: 'Tumu' },
      { key: 'etkinlik', label: 'Etkinlik' },
      { key: 'tablo', label: 'Tablo' },
      { key: 'gorsel', label: 'Gorsel' },
      { key: 'okuma_metni', label: 'Okuma Metni' },
      { key: 'degerlendirme_sorusu', label: 'Degerlendirme' },
      { key: 'bilgi_kutusu', label: 'Bilgi Kutusu' },
      { key: 'proje_gorevi', label: 'Proje' }
    ];

    // Filtrele
    let filtered = allMat;
    if (activeType !== 'tumu') {
      filtered = filtered.filter(m => m.tur === activeType);
    }
    if (activeUnite > 0) {
      // Cikti kodundan unite_no cikart
      filtered = filtered.filter(m => {
        if (!m.iliskili_cikti_kodu) return false;
        const kodlar = m.iliskili_cikti_kodu.split(',').map(k => k.trim());
        return kodlar.some(k => {
          const parts = k.split('.');
          return parts.length >= 3 && parseInt(parts[2]) === activeUnite;
        });
      });
    }
    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(m => m.baslik.toLowerCase().includes(q) || (m.aciklama || '').toLowerCase().includes(q));
    }

    const turIcons = { etkinlik: '\u{1F3AE}', tablo: '\u{1F4CA}', gorsel: '\u{1F5BC}\uFE0F', okuma_metni: '\u{1F4D6}', degerlendirme_sorusu: '\u{1F4DD}', bilgi_kutusu: '\u{1F4E6}', proje_gorevi: '\u{1F3C6}' };

    return `
      <h2 class="font-semibold text-base mb-3">\u{1F4E6} Materyal Kutuphanesi (${allMat.length})</h2>
      ${UI.searchBox('Materyal ara...', "Pages.filterMateryaller(this.value)")}
      <div class="flex gap-1 mb-3 overflow-x-auto pb-1 no-scrollbar">
        ${turler.map(t => `<button onclick="Pages.setMatFilter('${t.key}')" class="badge ${activeType === t.key ? 'badge-primary' : 'badge-gray'} cursor-pointer whitespace-nowrap text-xs">${t.label}</button>`).join('')}
      </div>
      <div class="flex gap-1 mb-4 overflow-x-auto pb-1 no-scrollbar">
        <button onclick="Pages.setMatUniteFilter(0)" class="badge ${activeUnite === 0 ? 'badge-blue' : 'badge-gray'} cursor-pointer whitespace-nowrap text-xs">Tum Uniteler</button>
        ${uniteler.map(u => `<button onclick="Pages.setMatUniteFilter(${u.unite_no})" class="badge ${activeUnite === u.unite_no ? 'badge-blue' : 'badge-gray'} cursor-pointer whitespace-nowrap text-xs">U${u.unite_no}</button>`).join('')}
      </div>
      <p class="text-xs text-slate-400 mb-3">${filtered.length} materyal listeleniyor</p>
      <div id="materyal-list" class="space-y-2">
        ${filtered.length ? filtered.map(m => {
          const icon = turIcons[m.tur] || '\u{1F4C4}';
          const turLabel = (turler.find(t => t.key === m.tur) || {}).label || m.tur;
          // Iliskili cikti kodlarini ayristir
          const ciktiKodlari = m.iliskili_cikti_kodu ? m.iliskili_cikti_kodu.split(',').map(k => k.trim()) : [];
          return `<div class="card p-3">
            <div class="flex items-start gap-3">
              <span class="text-xl mt-0.5">${icon}</span>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <h4 class="text-sm font-medium truncate flex-1">${m.baslik}</h4>
                  <a href="#/${dk}/kitap/${m.sayfa}" class="text-xs text-primary hover:underline flex-shrink-0 ml-2">s.${m.sayfa}</a>
                </div>
                ${m.aciklama ? `<p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">${m.aciklama}</p>` : ''}
                <div class="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span class="badge badge-gray text-[10px]">${turLabel}</span>
                  ${ciktiKodlari.slice(0, 3).map(k => {
                    const uniteN = k.split('.').length >= 3 ? k.split('.')[2] : '';
                    return `<a href="#/${dk}/unite/${uniteN}/cikti/${k}" class="badge badge-blue text-[10px] cursor-pointer hover:opacity-80">${k}</a>`;
                  }).join('')}
                  ${ciktiKodlari.length > 3 ? `<span class="text-[10px] text-slate-400">+${ciktiKodlari.length - 3}</span>` : ''}
                </div>
              </div>
            </div>
          </div>`;
        }).join('') : UI.empty('Materyal bulunamadi')}
      </div>`;
  },

  setMatFilter(type) {
    APP.state.matFilter = type;
    APP.render();
  },

  setMatUniteFilter(uniteNo) {
    APP.state.matUniteFilter = uniteNo;
    APP.render();
  },

  filterMateryaller(q) {
    APP.state.matSearchQuery = q;
    const list = document.getElementById('materyal-list');
    if (!list) return;
    const route = APP.parseRoute();
    const data = APP.getData(route.dersKodu);
    if (!data) return;
    const dk = route.dersKodu.toLowerCase();
    const allMat = data.kitap?.materyaller || [];
    const activeType = APP.state.matFilter || 'tumu';
    const activeUnite = APP.state.matUniteFilter || 0;
    const turIcons = { etkinlik: '\u{1F3AE}', tablo: '\u{1F4CA}', gorsel: '\u{1F5BC}\uFE0F', okuma_metni: '\u{1F4D6}', degerlendirme_sorusu: '\u{1F4DD}', bilgi_kutusu: '\u{1F4E6}', proje_gorevi: '\u{1F3C6}' };
    const turLabels = { etkinlik: 'Etkinlik', tablo: 'Tablo', gorsel: 'Gorsel', okuma_metni: 'Okuma Metni', degerlendirme_sorusu: 'Degerlendirme', bilgi_kutusu: 'Bilgi Kutusu', proje_gorevi: 'Proje' };

    let filtered = allMat;
    if (activeType !== 'tumu') filtered = filtered.filter(m => m.tur === activeType);
    if (activeUnite > 0) {
      filtered = filtered.filter(m => {
        if (!m.iliskili_cikti_kodu) return false;
        return m.iliskili_cikti_kodu.split(',').map(k => k.trim()).some(k => {
          const parts = k.split('.');
          return parts.length >= 3 && parseInt(parts[2]) === activeUnite;
        });
      });
    }
    if (q) {
      const ql = q.toLowerCase();
      filtered = filtered.filter(m => m.baslik.toLowerCase().includes(ql) || (m.aciklama || '').toLowerCase().includes(ql));
    }
    list.innerHTML = filtered.length ? filtered.map(m => {
      const icon = turIcons[m.tur] || '\u{1F4C4}';
      const turLabel = turLabels[m.tur] || m.tur;
      const ciktiKodlari = m.iliskili_cikti_kodu ? m.iliskili_cikti_kodu.split(',').map(k => k.trim()) : [];
      return `<div class="card p-3">
        <div class="flex items-start gap-3">
          <span class="text-xl mt-0.5">${icon}</span>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <h4 class="text-sm font-medium truncate flex-1">${m.baslik}</h4>
              <a href="#/${dk}/kitap/${m.sayfa}" class="text-xs text-primary hover:underline flex-shrink-0 ml-2">s.${m.sayfa}</a>
            </div>
            ${m.aciklama ? `<p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">${m.aciklama}</p>` : ''}
            <div class="flex items-center gap-2 mt-1.5 flex-wrap">
              <span class="badge badge-gray text-[10px]">${turLabel}</span>
              ${ciktiKodlari.slice(0, 3).map(k => {
                const uniteN = k.split('.').length >= 3 ? k.split('.')[2] : '';
                return `<a href="#/${dk}/unite/${uniteN}/cikti/${k}" class="badge badge-blue text-[10px] cursor-pointer hover:opacity-80">${k}</a>`;
              }).join('')}
              ${ciktiKodlari.length > 3 ? `<span class="text-[10px] text-slate-400">+${ciktiKodlari.length - 3}</span>` : ''}
            </div>
          </div>
        </div>
      </div>`;
    }).join('') : UI.empty('Materyal bulunamadi');
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
