/* ===== Hafta Hesaplama Fonksiyonlari ===== */

const HaftaUtils = {
  getSettings() {
    const defaults = {
      donem_baslangic: '2025-09-15',
      donem_bitis: '2026-06-12',
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

  // Pazartesi gununu bul (haftanin baslangici)
  getMonday(d) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  },

  // Bugunun tarihine gore kacinci ders haftasinda oldugunu hesapla
  getCurrentWeek() {
    const s = this.getSettings();
    const today = new Date();
    const start = new Date(s.donem_baslangic);
    if (today < start) return 1;
    const startMonday = this.getMonday(start);
    const todayMonday = this.getMonday(today);
    const diff = Math.floor((todayMonday - startMonday) / (7 * 24 * 60 * 60 * 1000));
    return Math.max(1, Math.min(diff + 1, 36));
  },

  // Belirli bir haftanin tarih araligini dondur
  getWeekDateRange(hafta) {
    const s = this.getSettings();
    const start = this.getMonday(new Date(s.donem_baslangic));
    const weekStart = new Date(start);
    weekStart.setDate(weekStart.getDate() + (hafta - 1) * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 4); // Cuma
    return { start: weekStart, end: weekEnd };
  },

  // Tarih formatlama
  formatDate(d) {
    const date = new Date(d);
    const months = ['Ocak','Subat','Mart','Nisan','Mayis','Haziran',
                    'Temmuz','Agustos','Eylul','Ekim','Kasim','Aralik'];
    return `${date.getDate()} ${months[date.getMonth()]}`;
  },

  formatDateRange(hafta) {
    const r = this.getWeekDateRange(hafta);
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
  }
};
