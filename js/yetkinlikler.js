/* ===== Yetkinlik Sozlugu — Beceri/Deger/Egilim Lookup + Modal ===== */

const Yetkinlikler = {
  data: null,

  async load() {
    try {
      const resp = await fetch('data/yetkinlikler.json');
      if (!resp.ok) return;
      const json = await resp.json();
      this.data = json.yetkinlikler || {};
    } catch { this.data = {}; }
  },

  get(kod) {
    if (!this.data) return null;
    // Tam eslesme
    if (this.data[kod]) return this.data[kod];
    // Noktali alt kod dene: "E1.1" icin "E1" parent'i bul
    const parts = kod.split('.');
    if (parts.length > 1 && this.data[parts[0]]) return this.data[parts[0]];
    // Rakamsiz base dene: "SDB2" icin "SDB" bul
    const base = kod.replace(/[\d.]+$/, '');
    if (base && this.data[base]) return this.data[base];
    return null;
  },

  getColor(kod) {
    const y = this.get(kod);
    return y ? y.renk || 'gray' : 'gray';
  },

  getBadgeClass(kod) {
    const color = this.getColor(kod);
    return `badge-${color}`;
  },

  // Aile ikonlari
  getAileIcon(aile) {
    const icons = {
      'Egilimler': '\u{1F9ED}',
      'Erdem-Deger-Eylem': '\u{1F48E}',
      'Sosyal-Duygusal Ogrenme Becerileri': '\u{1F91D}',
      'Kavramsal Beceriler': '\u{1F9E0}',
      'Okuryazarlik Becerileri': '\u{1F4DA}',
      'Din Egitimi ve Ogretimi Alan Becerileri': '\u{1F54C}',
      'Sosyal Bilimler Alan Becerileri': '\u{1F30D}',
    };
    // Turkce karakter normalize
    for (const [key, icon] of Object.entries(icons)) {
      if (aile && aile.toLowerCase().includes(key.toLowerCase().substring(0, 8))) return icon;
    }
    return '\u{1F4CC}';
  },

  // Bu yetkinligin hangi ciktilarda kullanildigini bul
  findUsages(kod) {
    const usages = [];
    for (const [dersKodu, dersData] of Object.entries(APP.data)) {
      for (const unite of dersData.program.uniteler) {
        // alan_becerileri, kavramsal_beceriler, egilimler icinde ara
        const allBeceriler = [
          ...(unite.alan_becerileri || []),
          ...(unite.kavramsal_beceriler || []),
          ...(unite.egilimler || [])
        ];
        const pab = unite.programlar_arasi_bilesenler || {};
        for (const sub of ['sosyal_duygusal_ogrenme', 'degerler', 'okuryazarlik_becerileri']) {
          allBeceriler.push(...(pab[sub] || []));
        }
        // Bu unite bu kodu kullaniyor mu?
        const found = allBeceriler.some(b => b.kod === kod);

        // iliskilendirilen_kodlar icinde ara
        const yoy = unite.ogrenme_ogretme_yasantilari || {};
        const uygulamalar = yoy.uygulamalar || [];
        const ciktiKodlari = [];
        for (const uyg of uygulamalar) {
          if ((uyg.iliskilendirilen_kodlar || []).includes(kod)) {
            ciktiKodlari.push(uyg.cikti_kodu);
          }
        }

        if (found || ciktiKodlari.length) {
          usages.push({
            dersKodu,
            dersAdi: dersData.meta.ders_adi,
            uniteNo: unite.unite_no,
            uniteAdi: unite.unite_adi,
            ciktiKodlari
          });
        }
      }
    }
    return usages;
  },

  showModal(kod) {
    const y = this.get(kod);
    if (!y) return;

    const modal = document.getElementById('yetkinlik-modal');
    if (!modal) return;

    const icon = this.getAileIcon(y.aile);
    document.getElementById('yetkinlik-modal-title').innerHTML = `${icon} ${y.ad}`;

    // Kullanim yerleri
    const usages = this.findUsages(kod);
    let usageHtml = '';
    if (usages.length) {
      usageHtml = `<div class="mt-4"><h4 class="font-semibold text-sm mb-2">\u{1F4CD} Kullanildigi Yerler</h4><div class="space-y-1">`;
      for (const u of usages) {
        const dk = u.dersKodu.toLowerCase();
        usageHtml += `<div class="text-sm"><span class="text-slate-400">${u.dersAdi}</span> \u203A <a href="#/${dk}/unite/${u.uniteNo}" class="text-primary hover:underline" onclick="closeYetkinlikModal()">Unite ${u.uniteNo}: ${u.uniteAdi}</a>`;
        if (u.ciktiKodlari.length) {
          usageHtml += `<div class="flex flex-wrap gap-1 mt-1">${u.ciktiKodlari.map(c => `<a href="#/${dk}/unite/${u.uniteNo}/cikti/${c}" class="badge badge-blue text-xs cursor-pointer" onclick="closeYetkinlikModal()">${c}</a>`).join('')}</div>`;
        }
        usageHtml += `</div>`;
      }
      usageHtml += `</div></div>`;
    }

    // Surec bilesenleri
    let sbHtml = '';
    if (y.surec_bilesenleri && y.surec_bilesenleri.length) {
      const harfler = ['a', 'b', 'c', '\u00e7', 'd', 'e', 'f', 'g', 'h'];
      sbHtml = `<div class="mt-3"><h4 class="font-semibold text-sm mb-2">\u{1F4CB} Surec Bilesenleri</h4><div class="space-y-1">`;
      y.surec_bilesenleri.forEach((sb, i) => {
        const harf = harfler[i] || (i + 1);
        sbHtml += `<div class="text-sm flex items-start gap-2"><span class="font-semibold text-primary w-5">${harf})</span><span class="text-slate-600 dark:text-slate-300">${sb.metin}</span></div>`;
      });
      sbHtml += `</div></div>`;
    }

    document.getElementById('yetkinlik-modal-body').innerHTML = `
      <div class="space-y-3">
        <div class="flex flex-wrap gap-2 text-xs">
          <span class="badge badge-${y.renk}">${y.aile}</span>
          ${y.alt_aile ? `<span class="badge badge-gray">${y.alt_aile}</span>` : ''}
          <span class="badge badge-gray font-mono">${y.kod}</span>
        </div>
        ${y.aciklama ? `<p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">${y.aciklama}</p>` : ''}
        ${sbHtml}
        ${usageHtml}
      </div>`;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
};

function closeYetkinlikModal() {
  const modal = document.getElementById('yetkinlik-modal');
  if (modal) modal.classList.add('hidden');
  document.body.style.overflow = '';
}
