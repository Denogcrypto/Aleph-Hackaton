/* global localStorage */
/**
 * @fileoverview Paygent Global Theme Manager (Dark / Light Mode)
 * Default Mode: Dark (#0B1326 / #0F172A)
 * Light Mode: Clean Paper (#F8FAFC / #FFFFFF)
 */

(function () {
  // 1. Inmediata ejecución antes de renderizar el DOM para evitar flash
  const savedTheme = localStorage.getItem('paygent_theme') || 'dark'
  if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark')
    document.documentElement.classList.add('light')
  } else {
    document.documentElement.classList.add('dark')
    document.documentElement.classList.remove('light')
  }

  // 2. Global Object
  window.PaygentTheme = {
    currentTheme: savedTheme,

    get isDark () {
      return this.currentTheme === 'dark'
    },

    setTheme (mode) {
      if (mode !== 'dark' && mode !== 'light') mode = 'dark'
      this.currentTheme = mode
      localStorage.setItem('paygent_theme', mode)

      if (mode === 'dark') {
        document.documentElement.classList.add('dark')
        document.documentElement.classList.remove('light')
      } else {
        document.documentElement.classList.remove('dark')
        document.documentElement.classList.add('light')
      }

      this.updateTogglesUI()
      this.updateLogosUI()
    },

    toggleTheme () {
      const next = this.currentTheme === 'dark' ? 'light' : 'dark'
      this.setTheme(next)
    },

    renderToggle (container) {
      if (!container) return
      const isDark = this.currentTheme === 'dark'
      container.innerHTML = `
        <button onclick="window.PaygentTheme.toggleTheme()" 
                title="${isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}"
                class="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-500 text-slate-700 dark:text-slate-300 transition-all group">
          <span class="material-symbols-outlined text-[18px] text-amber-500 dark:text-amber-400 group-hover:scale-110 transition-transform">
            ${isDark ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
      `
    },

    updateTogglesUI () {
      document.querySelectorAll('[data-theme-toggle], #themeToggleContainer, #topThemeToggle').forEach(el => {
        this.renderToggle(el)
      })
    },

    updateLogosUI () {
      // Ajustar logo si es necesario
      const logos = document.querySelectorAll('.brand-logo-img')
      logos.forEach(logo => {
        if (this.currentTheme === 'light') {
          logo.src = '/assets/logos/paygent-mark-light.svg'
        } else {
          logo.src = '/paygent-logo.svg'
        }
      })
    },

    init () {
      this.updateTogglesUI()
      this.updateLogosUI()
    }
  }

  // Auto initialize when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.PaygentTheme.init())
  } else {
    window.PaygentTheme.init()
  }
})()
