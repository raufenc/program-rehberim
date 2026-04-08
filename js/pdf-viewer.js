/* ===== PDF Goruntuleme ===== */

const PDFViewer = {
  lib: null,
  loadingPromise: null,
  currentDoc: null,
  currentPage: 1,
  totalPages: 0,
  rendering: false,
  pendingPage: null,

  async loadLib() {
    if (this.lib) return this.lib;
    if (this.loadingPromise) return this.loadingPromise;
    this.loadingPromise = new Promise((resolve, reject) => {
      if (window.pdfjsLib) { this.lib = window.pdfjsLib; resolve(this.lib); return; }
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        this.lib = window.pdfjsLib;
        resolve(this.lib);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
    return this.loadingPromise;
  },

  getScale() {
    const container = document.getElementById('pdf-container');
    if (!container) return 1.0;
    const w = container.clientWidth - 16;
    // Hedef: container genisligine sigdir, max 1.5
    return Math.min(1.5, w / 595); // A4 = 595pt
  },

  async open(pdfPath, page) {
    const container = document.getElementById('pdf-container');
    if (container) {
      container.innerHTML = '<div class="flex items-center justify-center h-64"><div class="animate-pulse text-slate-400">PDF yukleniyor...</div></div>';
    }
    try {
      const lib = await this.loadLib();
      this.currentDoc = await lib.getDocument({ url: pdfPath, disableAutoFetch: true, disableStream: false }).promise;
      this.totalPages = this.currentDoc.numPages;
      this.currentPage = Math.max(1, Math.min(page || 1, this.totalPages));
      // Canvas'i geri koy
      if (container) container.innerHTML = '<canvas id="pdf-canvas"></canvas>';
      await this.renderPage();
    } catch (e) {
      if (container) container.innerHTML = '<div class="text-center py-12 text-slate-400"><p>PDF yuklenemedi</p><p class="text-xs mt-1">' + (e.message || '') + '</p></div>';
    }
  },

  async renderPage() {
    if (!this.currentDoc) return;
    if (this.rendering) {
      this.pendingPage = this.currentPage;
      return;
    }
    this.rendering = true;
    try {
      const page = await this.currentDoc.getPage(this.currentPage);
      const scale = this.getScale();
      const viewport = page.getViewport({ scale });
      const canvas = document.getElementById('pdf-canvas');
      if (!canvas) { this.rendering = false; return; }
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvasContext: ctx, viewport }).promise;
    } catch (e) {
      // Render hatasi - sessizce gec
    }
    this.rendering = false;
    // Kontrolleri guncelle
    const pageNum = document.getElementById('pdf-page-num');
    const pageTotal = document.getElementById('pdf-page-total');
    const pageInput = document.getElementById('pdf-page-input');
    if (pageNum) pageNum.textContent = this.currentPage;
    if (pageTotal) pageTotal.textContent = this.totalPages;
    if (pageInput) pageInput.value = this.currentPage;
    // Bekleyen sayfa varsa render et
    if (this.pendingPage !== null && this.pendingPage !== this.currentPage) {
      this.currentPage = this.pendingPage;
      this.pendingPage = null;
      await this.renderPage();
    } else {
      this.pendingPage = null;
    }
  },

  async goToPage(n) {
    if (!this.currentDoc) return;
    this.currentPage = Math.max(1, Math.min(n, this.totalPages));
    await this.renderPage();
    const wrapper = document.querySelector('.pdf-canvas-wrapper');
    if (wrapper) wrapper.scrollTop = 0;
  },

  prev() { this.goToPage(this.currentPage - 1); },
  next() { this.goToPage(this.currentPage + 1); },

  jumpToPage() {
    const input = document.getElementById('pdf-page-input');
    if (input) this.goToPage(parseInt(input.value) || 1);
  }
};
