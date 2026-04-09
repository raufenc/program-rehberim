/* ===== Program Rehberim - Ana Uygulama ===== */

const APP = {
  data: {},
  state: { ciktiTab: 0, uniteTab: 0, kavramFilter: 0 },

  // Veri dosyalari
  dataFiles: [
    'data/FKH_10_database.json',
    'data/HDS_10_database.json',
    'data/SYR_10_database.json',
    'data/TDB_9_database.json'
  ],

  async init() {
    // Tema uygula
    const s = HaftaUtils.getSettings();
    this.applyTheme(s.tema);

    // Verileri yukle
    await Promise.all([this.loadData(), Yetkinlikler.load()]);

    // Router baslat
    window.addEventListener('hashchange', () => this.route());
    this.route();

    // Service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  },

  async loadData() {
    const promises = this.dataFiles.map(async (file) => {
      try {
        const resp = await fetch(file);
        if (!resp.ok) return null;
        const json = await resp.json();
        return json;
      } catch { return null; }
    });
    const results = await Promise.all(promises);
    results.forEach(d => {
      if (d && d.meta) {
        this.data[d.meta.ders_kodu] = d;
      }
    });
  },

  getData(dersKodu) {
    return this.data[dersKodu.toUpperCase()] || null;
  },

  applyTheme(tema) {
    const html = document.documentElement;
    if (tema === 'dark') {
      html.setAttribute('data-theme', 'dark');
      html.classList.add('dark');
    } else if (tema === 'auto') {
      const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      html.setAttribute('data-theme', dark ? 'dark' : 'light');
      html.classList.toggle('dark', dark);
    } else {
      html.setAttribute('data-theme', 'light');
      html.classList.remove('dark');
    }
  },

  parseRoute() {
    const hash = location.hash.replace('#/', '').replace('#', '');
    const parts = hash.split('/').filter(Boolean);
    if (parts.length === 0) return { page: 'home' };

    // Genel teknikler
    if (parts[0] === 'teknikler') return { page: 'teknikler-genel' };
    if (parts[0] === 'ayarlar') return { page: 'ayarlar' };

    const dersKodu = parts[0].toUpperCase();
    if (parts.length === 1) return { page: 'ders', dersKodu };
    if (parts[1] === 'haftalik') return { page: 'haftalik', dersKodu, hafta: parts[2] ? parseInt(parts[2]) : null };
    if (parts[1] === 'kavramlar') return { page: 'kavramlar', dersKodu };
    if (parts[1] === 'materyaller') return { page: 'materyaller', dersKodu, matType: parts[2] || null };
    if (parts[1] === 'teknikler') return { page: 'teknikler', dersKodu };
    if (parts[1] === 'matris') return { page: 'matris', dersKodu };
    if (parts[1] === 'kitap') return { page: 'pdf', dersKodu, pdfTur: 'kitap', sayfa: parts[2] || null };
    if (parts[1] === 'program') return { page: 'pdf', dersKodu, pdfTur: 'program', sayfa: parts[2] || null };
    if (parts[1] === 'unite' && parts[2]) {
      if (parts[3] === 'cikti' && parts[4]) {
        return { page: 'cikti', dersKodu, uniteNo: parts[2], ciktiKodu: decodeURIComponent(parts[4]) };
      }
      return { page: 'unite', dersKodu, uniteNo: parts[2] };
    }
    return { page: 'home' };
  },

  route() {
    const r = this.parseRoute();
    // Tablar sifirla (sayfa degisince)
    if (r.page !== 'cikti') this.state.ciktiTab = 0;
    if (r.page !== 'unite') this.state.uniteTab = 0;
    if (r.page !== 'kavramlar') this.state.kavramFilter = 0;
    this.render();
  },

  render() {
    const r = this.parseRoute();
    const app = document.getElementById('app');
    const header = document.getElementById('header-title');
    const backBtn = document.getElementById('btn-back');
    let content = '';
    let title = 'Program Rehberim';
    let showBack = true;

    switch (r.page) {
      case 'home':
        content = Pages.home();
        title = 'Program Rehberim';
        showBack = false;
        break;
      case 'ders': {
        const data = this.getData(r.dersKodu);
        title = data ? `${data.meta.ders_adi} (${data.meta.sinif})` : r.dersKodu;
        content = Pages.dersAnaSayfa(r.dersKodu);
        break;
      }
      case 'haftalik': {
        const data = this.getData(r.dersKodu);
        title = data ? `${data.meta.ders_adi} - Haftalik Plan` : 'Haftalik Plan';
        content = Pages.haftalikPlan(r.dersKodu, r.hafta);
        break;
      }
      case 'unite': {
        const data = this.getData(r.dersKodu);
        const unite = data?.program.uniteler.find(u => u.unite_no === parseInt(r.uniteNo));
        title = unite ? `Unite ${unite.unite_no}: ${unite.unite_adi}` : `Unite ${r.uniteNo}`;
        content = Pages.uniteDetay(r.dersKodu, r.uniteNo);
        break;
      }
      case 'cikti':
        title = r.ciktiKodu;
        content = Pages.ciktiDetay(r.dersKodu, r.uniteNo, r.ciktiKodu);
        break;
      case 'kavramlar': {
        const data = this.getData(r.dersKodu);
        title = data ? `${data.meta.ders_adi} - Kavramlar` : 'Kavramlar';
        content = Pages.kavramSozlugu(r.dersKodu);
        break;
      }
      case 'materyaller': {
        const data = this.getData(r.dersKodu);
        title = data ? `${data.meta.ders_adi} - Materyaller` : 'Materyaller';
        content = Pages.materyalKutuphanesi(r.dersKodu, r.matType);
        break;
      }
      case 'teknikler': {
        const data = this.getData(r.dersKodu);
        title = data ? `${data.meta.ders_adi} - Teknikler` : 'Teknikler';
        content = Pages.teknikler(r.dersKodu);
        break;
      }
      case 'teknikler-genel':
        title = 'Tum Teknikler';
        content = Pages.teknikler(null);
        break;
      case 'matris': {
        const data = this.getData(r.dersKodu);
        title = data ? `${data.meta.ders_adi} - Matris` : 'Matris';
        content = Pages.matris(r.dersKodu);
        break;
      }
      case 'pdf': {
        const data = this.getData(r.dersKodu);
        const pdfTitle = r.pdfTur === 'kitap' ? 'Ders Kitabi' : 'Program';
        title = data ? `${data.meta.ders_adi} - ${pdfTitle}` : pdfTitle;
        content = Pages.pdfViewer(r.dersKodu, r.pdfTur, r.sayfa);
        break;
      }
      case 'ayarlar':
        title = 'Ayarlar';
        content = Pages.ayarlar();
        break;
      default:
        content = UI.empty('Sayfa bulunamadi');
    }

    header.textContent = title;
    backBtn.classList.toggle('hidden', !showBack);
    app.innerHTML = `<div class="animate-fade-in">${content}</div>`;
    window.scrollTo(0, 0);
  },

  showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.pointerEvents = 'auto';
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.pointerEvents = 'none';
    }, 2000);
  }
};

// Uygulama baslatma
document.addEventListener('DOMContentLoaded', () => APP.init());
