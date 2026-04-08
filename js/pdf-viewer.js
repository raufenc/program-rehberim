/* ===== PDF Goruntuleme ===== */

const PDFViewer = {
  lib: null,
  loadingPromise: null,

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

  currentDoc: null,
  currentPage: 1,
  totalPages: 0,
  scale: 1.5,

  async open(pdfPath, page) {
    const lib = await this.loadLib();
    try {
      this.currentDoc = await lib.getDocument(pdfPath).promise;
      this.totalPages = this.currentDoc.numPages;
      this.currentPage = Math.max(1, Math.min(page || 1, this.totalPages));
      await this.renderPage();
    } catch (e) {
      const container = document.getElementById('pdf-container');
      if (container) container.innerHTML = `<div class="text-center py-12 text-slate-400"><p>PDF yuklenemedi</p><p class="text-xs mt-1">${e.message || ''}</p></div>`;
    }
  },

  async renderPage() {
    if (!this.currentDoc) return;
    const page = await this.currentDoc.getPage(this.currentPage);
    const viewport = page.getViewport({ scale: this.scale });
    const canvas = document.getElementById('pdf-canvas');
    if (!canvas) return;
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
    // Update controls
    const pageNum = document.getElementById('pdf-page-num');
    const pageTotal = document.getElementById('pdf-page-total');
    const pageInput = document.getElementById('pdf-page-input');
    if (pageNum) pageNum.textContent = this.currentPage;
    if (pageTotal) pageTotal.textContent = this.totalPages;
    if (pageInput) pageInput.value = this.currentPage;
  },

  async goToPage(n) {
    this.currentPage = Math.max(1, Math.min(n, this.totalPages));
    await this.renderPage();
    // Scroll to top
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
