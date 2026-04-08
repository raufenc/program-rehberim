/* ===== UI Bilesenleri ===== */

const UI = {
  // Ders ikon/emoji
  dersIcon(kod) {
    const icons = { FKH: '\u{1F4D7}', HDS: '\u{1F4D8}', SYR: '\u{1F4D9}', TDB: '\u{1F4D5}', TFS: '\u{1F4D3}', AKD: '\u{1F4D4}', KLM: '\u{1F4D2}', ARP: '\u{1F4DA}' };
    return icons[kod] || '\u{1F4D6}';
  },

  dersBgClass(kod) {
    const cls = ['FKH','HDS','SYR','TDB','TFS','AKD','KLM','ARP'];
    return cls.includes(kod) ? `ders-bg-${kod}` : 'ders-bg-default';
  },

  // QR ikon
  qrIcon(tur) {
    const m = { video: '\u25B6\uFE0F', interaktif: '\u{1F504}', ses: '\u{1F50A}', dokuman: '\u{1F4C4}', web_sayfasi: '\u{1F310}', ogretmen_yansitma: '\u{1F4DD}', diger: '\u{1F517}' };
    return m[tur] || '\u{1F517}';
  },

  // Arama kutusu
  searchBox(placeholder, oninput) {
    return `<div class="relative mb-4">
      <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
      <input type="text" class="search-input" placeholder="${placeholder}" oninput="${oninput}">
    </div>`;
  },

  // Tab navigasyonu
  tabs(items, activeIdx, onclickBase) {
    return `<div class="flex border-b dark:border-slate-700 mb-4 overflow-x-auto no-scrollbar">
      ${items.map((t, i) => `<button onclick="${onclickBase}(${i})" class="px-4 py-2.5 text-sm whitespace-nowrap transition ${i === activeIdx ? 'tab-active' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}">${t}</button>`).join('')}
    </div>`;
  },

  // Ders karti (ana sayfa)
  dersCard(data) {
    const m = data.meta;
    const uniteCount = data.program.uniteler.length;
    return `<div class="card card-clickable cursor-pointer overflow-hidden" onclick="location.hash='#/${m.ders_kodu.toLowerCase()}'">
      <div class="${this.dersBgClass(m.ders_kodu)} text-white p-4 flex items-center gap-3">
        <span class="text-3xl">${this.dersIcon(m.ders_kodu)}</span>
        <div>
          <h3 class="font-semibold text-base">${m.ders_adi}</h3>
          <p class="text-sm opacity-90">${m.sinif}. Sinif</p>
        </div>
      </div>
      <div class="p-3 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <span>${uniteCount} Unite</span>
        <span>${m.toplam_ders_saati} saat</span>
      </div>
    </div>`;
  },

  // Bu Hafta karti
  buHaftaKarti(dersKodu, haftalikPlan) {
    const currentWeek = HaftaUtils.getCurrentWeek();
    const plan = haftalikPlan.find(h => h.hafta === currentWeek);
    if (!plan) return `<div class="card p-4 border-l-4 border-primary mb-4">
      <p class="text-sm text-slate-500">Donem disi</p>
    </div>`;
    const dateRange = HaftaUtils.formatDateRange(currentWeek);
    return `<div class="card p-4 border-l-4 border-primary mb-4 card-clickable cursor-pointer" onclick="location.hash='#/${dersKodu.toLowerCase()}/haftalik/${currentWeek}'">
      <div class="flex items-center justify-between mb-2">
        <span class="badge badge-primary">\u{1F4C5} Bu Hafta: ${currentWeek}. hafta</span>
        <span class="text-xs text-slate-400">${dateRange}</span>
      </div>
      <h3 class="font-semibold mb-1">Unite ${plan.unite_no} - ${plan.unite_adi}</h3>
      <div class="text-sm text-slate-600 dark:text-slate-300 space-y-1">
        ${plan.cikti_kodlari.map(k => `<span class="badge badge-blue mr-1">${k}</span>`).join('')}
      </div>
      <div class="mt-2 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
        ${plan.kitap_sayfalari ? `<span>\u{1F4D6} s.${plan.kitap_sayfalari}</span>` : ''}
        ${plan.onerilen_teknikler.length ? `<span>\u{1F527} ${plan.onerilen_teknikler.slice(0, 2).join(', ')}</span>` : ''}
      </div>
      ${plan.hazirlik_notu ? `<div class="mt-2 text-xs bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 p-2 rounded-lg">\u26A0\uFE0F ${plan.hazirlik_notu}</div>` : ''}
    </div>`;
  },

  // Unite karti
  uniteCard(dersKodu, unite, haftalikPlan) {
    const progress = HaftaUtils.getUniteProgress(haftalikPlan, unite.unite_no);
    const range = HaftaUtils.getUniteWeekRange(haftalikPlan, unite.unite_no);
    const ciktiCount = unite.ogrenme_ciktilari.length;
    return `<div class="card p-4 mb-3 card-clickable cursor-pointer" onclick="location.hash='#/${dersKodu.toLowerCase()}/unite/${unite.unite_no}'">
      <div class="flex items-start justify-between mb-2">
        <h3 class="font-semibold text-sm flex-1">${unite.unite_no}. ${unite.unite_adi}</h3>
      </div>
      <div class="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-2">
        <span>${unite.ders_saati} saat</span>
        <span>${ciktiCount} cikti</span>
        <span>Hafta ${range.baslangic}-${range.bitis}</span>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:${progress}%"></div></div>
      <div class="text-right text-xs text-slate-400 mt-1">%${progress}</div>
    </div>`;
  },

  // Cikti karti
  ciktiCard(dersKodu, uniteNo, cikti, ciktiKitap) {
    const kitapInfo = ciktiKitap ? ciktiKitap.find(c => c.cikti_kodu === cikti.kod) : null;
    const sayfaAraligi = kitapInfo ? kitapInfo.kitap_sayfa_araligi : '';
    return `<div class="card p-4 mb-3 card-clickable cursor-pointer" onclick="location.hash='#/${dersKodu.toLowerCase()}/unite/${uniteNo}/cikti/${cikti.kod}'">
      <div class="flex items-start justify-between">
        <span class="badge badge-primary text-xs">${cikti.kod}</span>
        ${sayfaAraligi ? `<span class="text-xs text-slate-400">\u{1F4D6} s.${sayfaAraligi}</span>` : ''}
      </div>
      <p class="text-sm mt-2">${cikti.baslik}</p>
    </div>`;
  },

  // Haftalik plan karti
  haftalikKart(dersKodu, plan, isActive) {
    const dateRange = HaftaUtils.formatDateRange(plan.hafta);
    return `<div class="card p-4 mb-3 ${isActive ? 'ring-2 ring-primary' : ''}">
      <div class="flex items-center justify-between mb-2">
        <span class="font-semibold text-sm">Hafta ${plan.hafta}</span>
        <span class="text-xs text-slate-400">${dateRange}</span>
      </div>
      <div class="text-sm font-medium text-primary dark:text-primary-light mb-1">Unite ${plan.unite_no}: ${plan.unite_adi}</div>
      <div class="mb-2">${plan.cikti_kodlari.map(k => `<a href="#/${dersKodu.toLowerCase()}/unite/${plan.unite_no}/cikti/${k}" class="badge badge-blue mr-1 mb-1 cursor-pointer hover:opacity-80">${k}</a>`).join('')}</div>
      <div class="text-sm text-slate-600 dark:text-slate-300 mb-2">${plan.konu_ozeti}</div>
      <div class="grid grid-cols-2 gap-2 text-xs">
        ${plan.kitap_sayfalari ? `<div class="flex items-center gap-1"><span>\u{1F4D6}</span><a href="#/${dersKodu.toLowerCase()}/kitap/${plan.kitap_sayfalari.split('-')[0]}" class="text-primary hover:underline">s.${plan.kitap_sayfalari}</a></div>` : ''}
        ${plan.onerilen_teknikler.length ? `<div class="flex items-center gap-1 flex-wrap"><span>\u{1F527}</span>${plan.onerilen_teknikler.map(t => `<span class="teknik-link" onclick="event.stopPropagation();openTeknikByName('${dersKodu}','${t.replace(/'/g, "\\'")}')">${t}</span>`).join(', ')}</div>` : ''}
      </div>
      ${plan.hazirlik_notu ? `<div class="mt-2 text-xs bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 p-2 rounded-lg">\u26A0\uFE0F ${plan.hazirlik_notu}</div>` : ''}
    </div>`;
  },

  // Teknik karti
  teknikCard(teknik) {
    return `<div class="card p-4 mb-3 card-clickable cursor-pointer" onclick="openTeknikById('${teknik.id}')">
      <div class="flex items-start justify-between">
        <h3 class="font-semibold text-sm">\u{1F527} ${teknik.ad}</h3>
        ${teknik.sure_tahmini ? `<span class="text-xs text-slate-400">\u23F1 ${teknik.sure_tahmini}</span>` : ''}
      </div>
      <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">${teknik.aciklama}</p>
      <div class="mt-2 flex flex-wrap gap-1">
        ${(teknik.kullanildigi_ciktilar || []).slice(0, 3).map(k => `<span class="badge badge-gray text-xs">${k}</span>`).join('')}
      </div>
    </div>`;
  },

  // Kavram karti
  kavramCard(kavram, dersKodu) {
    return `<div class="card p-4 mb-3">
      <div class="flex items-start justify-between">
        <h3 class="font-semibold text-sm">${kavram.kavram}</h3>
        ${kavram.kitap_sayfa ? `<a href="#/${dersKodu.toLowerCase()}/kitap/${kavram.kitap_sayfa}" class="text-xs text-primary hover:underline">\u{1F4D6} s.${kavram.kitap_sayfa}</a>` : ''}
      </div>
      <p class="text-sm text-slate-600 dark:text-slate-300 mt-1">${kavram.tanim}</p>
      <div class="flex items-center gap-2 mt-2 flex-wrap">
        <span class="text-xs text-slate-400">Unite ${(kavram.unite || []).join(', ')}</span>
        ${(kavram.iliskili_kavramlar || []).map(k => `<span class="badge badge-primary text-xs cursor-pointer" onclick="openKavramByName('${dersKodu}','${k.replace(/'/g, "\\'")}')">${k}</span>`).join('')}
      </div>
    </div>`;
  },

  // QR / Dijital icerik karti
  qrCard(qr, dersKodu) {
    const icon = this.qrIcon(qr.tur);
    return `<div class="card p-3 mb-2">
      <div class="flex items-start gap-3">
        <span class="text-xl mt-0.5">${icon}</span>
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-medium truncate">${qr.baslik || qr.aciklama}</h4>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">${qr.tur.replace(/_/g, ' ')} ${qr.sayfa ? '\u2022 s.' + qr.sayfa : ''}</p>
          <div class="mt-2 flex gap-2">
            ${qr.url_tespit_edildi && qr.url ? `<a href="${qr.url}" target="_blank" rel="noopener" class="text-xs text-primary hover:underline" onclick="event.stopPropagation()">Ac \u2197</a>` : `<span class="text-xs text-slate-400">Link tespit edilemedi${qr.sayfa ? ` - kitaptaki QR kodu okutun` : ''}</span>`}
            ${qr.sayfa ? `<a href="#/${dersKodu.toLowerCase()}/kitap/${qr.sayfa}" class="text-xs text-slate-500 hover:text-primary">\u{1F4D6} s.${qr.sayfa}</a>` : ''}
          </div>
        </div>
      </div>
    </div>`;
  },

  // Beceri/deger badge
  beceridBadge(item, badgeClass) {
    return `<span class="badge ${badgeClass} text-xs mr-1 mb-1" title="${item.ad || ''}">${item.kod ? item.kod + ' ' : ''}${item.ad || item}</span>`;
  },

  // Accordion
  accordion(title, content, id) {
    return `<div class="border dark:border-slate-700 rounded-lg mb-2 overflow-hidden">
      <button class="w-full flex items-center justify-between p-3 text-sm font-medium text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition" onclick="toggleAccordion('${id}')">
        <span>${title}</span>
        <svg id="acc-icon-${id}" class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
      </button>
      <div id="acc-${id}" class="accordion-content">
        <div class="p-3 pt-0 text-sm text-slate-600 dark:text-slate-300">${content}</div>
      </div>
    </div>`;
  },

  // Bos durum
  empty(msg) {
    return `<div class="text-center py-12 text-slate-400"><p>${msg}</p></div>`;
  }
};

// Global yardimci fonksiyonlar
function toggleAccordion(id) {
  const el = document.getElementById('acc-' + id);
  const icon = document.getElementById('acc-icon-' + id);
  if (el) {
    el.classList.toggle('open');
    if (icon) icon.style.transform = el.classList.contains('open') ? 'rotate(180deg)' : '';
  }
}

function openTeknikByName(dersKodu, ad) {
  const data = APP.getData(dersKodu);
  if (!data) return;
  const teknik = (data.eslestirme.teknikler_kutuphanesi || []).find(t => t.ad === ad);
  if (teknik) showTeknikModal(teknik, dersKodu);
}

function openTeknikById(id) {
  for (const [kod, data] of Object.entries(APP.data)) {
    const teknik = (data.eslestirme.teknikler_kutuphanesi || []).find(t => t.id === id);
    if (teknik) { showTeknikModal(teknik, kod); return; }
  }
}

function showTeknikModal(teknik, dersKodu) {
  const modal = document.getElementById('teknik-modal');
  document.getElementById('teknik-modal-title').textContent = teknik.ad;
  const ciktilar = (teknik.kullanildigi_ciktilar || []).map(k =>
    `<a href="#/${dersKodu.toLowerCase()}/unite/${k.split('.')[2]}/cikti/${k}" class="badge badge-blue mr-1 mb-1 cursor-pointer hover:opacity-80" onclick="closeTeknikModal()">${k}</a>`
  ).join('');
  document.getElementById('teknik-modal-body').innerHTML = `
    <div class="space-y-4">
      <div><h4 class="font-semibold text-sm mb-1">\u{1F4DD} Nedir?</h4><p class="text-sm text-slate-600 dark:text-slate-300">${teknik.aciklama}</p></div>
      <div><h4 class="font-semibold text-sm mb-1">\u{1F4CB} Nasil Uygulanir?</h4><div class="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line">${teknik.nasil_uygulanir}</div></div>
      <div class="flex flex-wrap gap-4 text-sm">
        ${teknik.sure_tahmini ? `<div><span class="text-slate-400">\u23F1 Sure:</span> ${teknik.sure_tahmini}</div>` : ''}
        ${teknik.gerekli_materyal ? `<div><span class="text-slate-400">\u{1F4E6} Materyal:</span> ${teknik.gerekli_materyal}</div>` : ''}
      </div>
      ${teknik.uygun_oldugu_durumlar ? `<div><h4 class="font-semibold text-sm mb-1">\u{1F3AF} Uygun Durumlar</h4><p class="text-sm text-slate-600 dark:text-slate-300">${teknik.uygun_oldugu_durumlar}</p></div>` : ''}
      ${ciktilar ? `<div><h4 class="font-semibold text-sm mb-1">\u{1F4CD} Kullanildigi Ciktilar</h4><div>${ciktilar}</div></div>` : ''}
    </div>`;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeTeknikModal() {
  document.getElementById('teknik-modal').classList.add('hidden');
  document.body.style.overflow = '';
}

function openKavramByName(dersKodu, ad) {
  const data = APP.getData(dersKodu);
  if (!data) return;
  const kavram = (data.eslestirme.kavram_sozlugu || []).find(k => k.kavram === ad);
  if (kavram) showKavramModal(kavram, dersKodu);
}

function showKavramModal(kavram, dersKodu) {
  const modal = document.getElementById('kavram-modal');
  document.getElementById('kavram-modal-title').textContent = kavram.kavram;
  document.getElementById('kavram-modal-body').innerHTML = `
    <p class="text-sm text-slate-600 dark:text-slate-300 mb-3">${kavram.tanim}</p>
    <div class="flex items-center gap-2 flex-wrap text-xs">
      <span class="text-slate-400">Unite ${(kavram.unite || []).join(', ')}</span>
      ${kavram.kitap_sayfa ? `<a href="#/${dersKodu.toLowerCase()}/kitap/${kavram.kitap_sayfa}" class="text-primary hover:underline" onclick="closeKavramModal()">\u{1F4D6} s.${kavram.kitap_sayfa}</a>` : ''}
    </div>
    ${(kavram.iliskili_kavramlar || []).length ? `<div class="mt-3 flex flex-wrap gap-1">${kavram.iliskili_kavramlar.map(k => `<span class="badge badge-primary text-xs cursor-pointer" onclick="closeKavramModal();setTimeout(()=>openKavramByName('${dersKodu}','${k.replace(/'/g, "\\'")}'),300)">${k}</span>`).join('')}</div>` : ''}`;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeKavramModal() {
  document.getElementById('kavram-modal').classList.add('hidden');
  document.body.style.overflow = '';
}
