(() => {
  'use strict'

  const root = document.documentElement
  const stored = localStorage.getItem('theme')

  const systemPrefersDark = () =>
    window.matchMedia('(prefers-color-scheme: dark)').matches

  const resolveInitial = () => {
    if (stored === 'light' || stored === 'dark') return stored
    return systemPrefersDark() ? 'dark' : 'light'
  }

  const themeColors = { light: '#fdfbf5', dark: '#14110a' }

  const apply = (theme) => {
    root.setAttribute('data-theme', theme)
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', themeColors[theme])
  }

  apply(resolveInitial())

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      apply(e.matches ? 'dark' : 'light')
    }
  })

  window.addEventListener('DOMContentLoaded', () => {
    const year = new Date().getFullYear()
    document.querySelectorAll('[data-year]').forEach((el) => {
      el.textContent = year
    })

    const btn = document.getElementById('theme-toggle')
    if (btn) {
      btn.addEventListener('click', () => {
        const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
        localStorage.setItem('theme', next)
        apply(next)
      })
    }

    const browser = document.getElementById('browser')
    const slides = document.querySelectorAll('#browser .browser-body .slide')
    const dots = document.querySelectorAll('#browser-dots button')
    const browserTitle = document.getElementById('browser-title')
    if (browser && slides.length && dots.length) {
      let current = 0
      let timer = null

      const show = (n) => {
        slides[current].classList.remove('active')
        dots[current].classList.remove('active')
        current = (n + slides.length) % slides.length
        slides[current].classList.add('active')
        dots[current].classList.add('active')
        if (browserTitle) browserTitle.textContent = slides[current].dataset.title
      }
      const start = () => { timer = setInterval(() => show(current + 1), 5000) }
      const stop = () => { clearInterval(timer) }

      dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => { stop(); show(idx); start() })
      })
      browser.addEventListener('mouseenter', stop)
      browser.addEventListener('mouseleave', start)

      start()
    }

    const navToggle = document.getElementById('nav-toggle')
    const nav = document.getElementById('primary-nav')
    if (navToggle && nav) {
      const setOpen = (open) => {
        navToggle.setAttribute('aria-expanded', open ? 'true' : 'false')
        navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
        nav.dataset.open = open ? 'true' : 'false'
      }
      setOpen(false)
      navToggle.addEventListener('click', () => {
        setOpen(navToggle.getAttribute('aria-expanded') !== 'true')
      })
      nav.addEventListener('click', (e) => {
        if (e.target.closest('a')) setOpen(false)
      })
      document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !nav.contains(e.target)) setOpen(false)
      })
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
          setOpen(false)
          navToggle.focus()
        }
      })
    }
  })
})()
