/* ═══════════════════════════════════════════════
   i18n engine — shared across all pages

   Usage in each page:
     <script src="/js/main.js"></script>   (or ../js/main.js for subpages)
     <script>
       initI18n({
         pt: { 'page-title': '...', 'my-key': '...' },
         en: { 'page-title': '...', 'my-key': '...' }
       });
     </script>

   Language persists via localStorage key 'site-lang'.
   ═══════════════════════════════════════════════ */

let _i18nMerged = {};

const _sharedI18n = {
  pt: {
    'nav-home':        'Home',
    'nav-resume':      'Currículo',
    'label-view-repo': 'Ver repositório',
    'label-back-home': '← Home',
  },
  en: {
    'nav-home':        'Home',
    'nav-resume':      'Resume',
    'label-view-repo': 'View repository',
    'label-back-home': '← Home',
  }
};

/**
 * Initialize i18n for a page.
 * @param {{ pt: Object, en: Object }} pageI18n - page-specific translation strings
 */
function initI18n(pageI18n) {
  pageI18n = pageI18n || { pt: {}, en: {} };

  _i18nMerged = {
    pt: { ..._sharedI18n.pt, ...(pageI18n.pt || {}) },
    en: { ..._sharedI18n.en, ...(pageI18n.en || {}) }
  };

  window.applyLang = function(lang) {
    if (lang !== 'pt' && lang !== 'en') lang = 'en';

    localStorage.setItem('site-lang', lang);
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';

    if (_i18nMerged[lang]['page-title']) {
      document.title = _i18nMerged[lang]['page-title'];
    }

    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      const key = el.dataset.i18n;
      if (_i18nMerged[lang][key] !== undefined) {
        el.innerHTML = _i18nMerged[lang][key];
      }
    });

    document.querySelectorAll('.btn-lang').forEach(function(btn) {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Move sliding indicator on all toggles
    document.querySelectorAll('.lang-toggle').forEach(function(toggle) {
      toggle.dataset.active = lang;
    });
  };

  const urlLang = new URLSearchParams(location.search).get('lang');
  const saved = urlLang || localStorage.getItem('site-lang') || 'en';
  window.applyLang(saved);
}

// Event delegation for language toggle buttons — removes need for inline onclick
document.addEventListener('click', function(e) {
  const btn = e.target.closest('.btn-lang');
  if (btn && typeof window.applyLang === 'function') {
    window.applyLang(btn.dataset.lang);
  }
});
