/* ===== Hafta Hesaplama Fonksiyonlari ===== */
/* 2025-2026 MEB Egitim Ogretim Yili Takvimi */

const HaftaUtils = {

  // 2025-2026 MEB Tatil Takvimi
  // Kaynak: meb.gov.tr 2025-2026 calisma takvimi
  tatilHaftalari: [
    // 1. Ara Tatil: 10-14 Kasim 2025 (Hafta: donem basindan 10. hafta civari)
    { baslangic: '2025-11-10', bitis: '2025-11-14', ad: '1. Ara Tatil' },
    // Yariyil Tatili: 19-30 Ocak 2026
    { baslangic: '2026-01-19', bitis: '2026-01-30', ad: 'Yariyil Tatili' },
    // 2. Ara Tatil: 16-20 Mart 2026 (Ramazan Bayrami ile cakisiyor)
    { baslangic: '2026-03-16', bitis: '2026-03-20', ad: '2. Ara Tatil' },
  ],

  // Resmi tatil gunleri (tek gun veya kisa araliklarda ders yapilmayan gunler)
  resmiTatiller: [
    { tarih: '2025-10-29', ad: 'Cumhuriyet Bayrami' },
    { tarih: '2026-01-01', ad: 'Yilbasi' },
    { tarih: '2026-04-23', ad: '23 Nisan' },
    { tarih: '2026-05-01', ad: '1 Mayis' },
    { tarih: '2026-05-19', ad: '19 Mayis' },
    // Kurban Bayrami: 26-30 Mayis 2026 (arefe dahil)
    { tarih: '2026-05-26', ad: 'Kurban Bayrami Arefe' },
    { tarih: '2026-05-27', ad: 'Kurban Bayrami 1. Gun' },
    { tarih: '2026-05-28', ad: 'Kurban Bayrami 2. Gun' },
    { tarih: '2026-05-29', ad: 'Kurban Bayrami 3. Gun' },
    { tarih: '2026-05-30', ad: 'Kurban Bayrami 4. Gun' },
  ],

  // Donem tarihleri
  donemler: {
    donem1_baslangic: '2025-09-08',
    donem1_bitis: '2026-01-16',
    donem2_baslangic: '2026-02-02',
    donem2_bitis: '2026-06-26'
  },

  getSettings() {
    const defaults = {
      donem_baslangic: '2025-09-08',
      donem_bitis: '2026-06-26',
      haftalik_ders_saati: 2,
      tema: 'light',
      varsayilan_ders: ''
    };
    try {
      const s = JSON.parse(localStorage.getItem('pr_settings') || '{}');
      return { ...defaults, ...s };
    } catch { return defaults; }
  },

  saveSettings(s) {
    localStorage.setItem('pr_settings', JSON.stringify(s));
  },

  // Pazartesi gununu bul
  getMonday(d) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    date.setDate(diff);
    date.setHours(0, 0, 0, 0);
    return date;
  },

  // Bir tarih tatil haftasinda mi?
  isHolidayWeek(monday) {
    const friday = new Date(monday);
    friday.setDate(friday.getDate() + 4);
    for (const tatil of this.tatilHaftalari) {
      const tBas = new Date(tatil.baslangic);
      const tBit = new Date(tatil.bitis);
      tBas.setHours(0, 0, 0, 0);
      tBit.setHours(0, 0, 0, 0);
      // Hafta tatil araligina giriyorsa
      if (monday <= tBit && friday >= tBas) return tatil.ad;
    }
    return null;
  },

  // Tum ders haftalarini hesapla (tatiller haric)
  getDersHaftalari() {
    const s = this.getSettings();
    const start = this.getMonday(new Date(s.donem_baslangic));
    const end = new Date(s.donem_bitis);
    const haftalari = [];
    let current = new Date(start);
    let dersHaftaNo = 0;

    while (current <= end) {
      const monday = new Date(current);
      const friday = new Date(monday);
      friday.setDate(friday.getDate() + 4);
      const tatil = this.isHolidayWeek(monday);

      if (tatil) {
        haftalari.push({
          takvimHafta: haftalari.length + 1,
          dersHaftaNo: null,
          monday: new Date(monday),
          friday: new Date(friday),
          tatil: tatil
        });
      } else {
        dersHaftaNo++;
        haftalari.push({
          takvimHafta: haftalari.length + 1,
          dersHaftaNo: dersHaftaNo,
          monday: new Date(monday),
          friday: new Date(friday),
          tatil: null
        });
      }
      current.setDate(current.getDate() + 7);
    }
    return haftalari;
  },

  // Bugunun tarihine gore kacinci DERS haftasinda (tatiller haric)
  getCurrentWeek() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const haftalari = this.getDersHaftalari();
    const todayMonday = this.getMonday(today);

    for (const h of haftalari) {
      if (h.monday.getTime() === todayMonday.getTime()) {
        return h.dersHaftaNo || (h.tatil ? this.findNearestDersHafta(haftalari, h.takvimHafta) : 1);
      }
    }
    // Donem disi: en yakin haftayi dondur
    const s = this.getSettings();
    if (today < new Date(s.donem_baslangic)) return 1;
    return haftalari.filter(h => h.dersHaftaNo).length || 36;
  },

  findNearestDersHafta(haftalari, takvimHafta) {
    // Tatil haftasindaysak, bir sonraki ders haftasini bul
    for (let i = takvimHafta; i < haftalari.length; i++) {
      if (haftalari[i].dersHaftaNo) return haftalari[i].dersHaftaNo;
    }
    // Bulunamazsa bir oncekini bul
    for (let i = takvimHafta - 2; i >= 0; i--) {
      if (haftalari[i].dersHaftaNo) return haftalari[i].dersHaftaNo;
    }
    return 1;
  },

  // Belirli bir ders haftasinin tarih araligini dondur
  getWeekDateRange(dersHaftaNo) {
    const haftalari = this.getDersHaftalari();
    const hafta = haftalari.find(h => h.dersHaftaNo === dersHaftaNo);
    if (hafta) return { start: hafta.monday, end: hafta.friday };
    // Fallback
    const s = this.getSettings();
    const start = this.getMonday(new Date(s.donem_baslangic));
    const weekStart = new Date(start);
    weekStart.setDate(weekStart.getDate() + (dersHaftaNo - 1) * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 4);
    return { start: weekStart, end: weekEnd };
  },

  // Tarih formatlama
  formatDate(d) {
    const date = new Date(d);
    const months = ['Ocak', 'Subat', 'Mart', 'Nisan', 'Mayis', 'Haziran',
                    'Temmuz', 'Agustos', 'Eylul', 'Ekim', 'Kasim', 'Aralik'];
    return `${date.getDate()} ${months[date.getMonth()]}`;
  },

  formatDateRange(dersHaftaNo) {
    const r = this.getWeekDateRange(dersHaftaNo);
    return `${this.formatDate(r.start)} - ${this.formatDate(r.end)}`;
  },

  // Bir unitenin hangi haftalarda islenecegini hesapla
  getUniteWeekRange(haftalikPlan, uniteNo) {
    const weeks = haftalikPlan.filter(h => h.unite_no === uniteNo).map(h => h.hafta);
    if (weeks.length === 0) return { baslangic: 0, bitis: 0 };
    return { baslangic: Math.min(...weeks), bitis: Math.max(...weeks) };
  },

  // Unite ilerleme yuzdesi (takvime gore)
  getUniteProgress(haftalikPlan, uniteNo) {
    const current = this.getCurrentWeek();
    const range = this.getUniteWeekRange(haftalikPlan, uniteNo);
    if (range.baslangic === 0) return 0;
    if (current < range.baslangic) return 0;
    if (current > range.bitis) return 100;
    const total = range.bitis - range.baslangic + 1;
    const done = current - range.baslangic + 1;
    return Math.round((done / total) * 100);
  },

  // Tatil bilgisini goster (haftalik planda)
  getTatilInfo(dersHaftaNo) {
    const haftalari = this.getDersHaftalari();
    const hafta = haftalari.find(h => h.dersHaftaNo === dersHaftaNo);
    if (!hafta) return null;
    // Bu haftanin hemen oncesinde veya sonrasinda tatil var mi?
    const idx = haftalari.indexOf(hafta);
    const onceki = idx > 0 ? haftalari[idx - 1] : null;
    const sonraki = idx < haftalari.length - 1 ? haftalari[idx + 1] : null;
    const info = [];
    if (onceki?.tatil) info.push(`Onceki hafta: ${onceki.tatil}`);
    if (sonraki?.tatil) info.push(`Sonraki hafta: ${sonraki.tatil}`);
    // Resmi tatil bu haftada mi?
    for (const rt of this.resmiTatiller) {
      const td = new Date(rt.tarih);
      if (td >= hafta.monday && td <= hafta.friday) {
        info.push(`${rt.ad} (${this.formatDate(td)})`);
      }
    }
    return info.length ? info : null;
  }
};
