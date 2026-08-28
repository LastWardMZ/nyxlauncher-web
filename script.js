const REPO = 'LastWardMZ/nyxlauncher'

async function wireDownloadLinks() {
  const buttons = document.querySelectorAll('[data-download-btn]')
  const versionEls = document.querySelectorAll('[data-version]')
  const labelEls = document.querySelectorAll('[data-download-label]')
  const subEls = document.querySelectorAll('[data-download-sub]')

  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`)
    if (!res.ok) throw new Error(`GitHub API respondió ${res.status}`)
    const release = await res.json()

    const asset = (release.assets || []).find((a) => a.name.endsWith('-setup.exe'))
    if (!asset) throw new Error('No se encontró el instalador en la última release')

    const version = (release.tag_name || '').replace(/^v/, '')
    const sizeMb = (asset.size / (1024 * 1024)).toFixed(0)

    buttons.forEach((btn) => {
      btn.href = asset.browser_download_url
    })
    versionEls.forEach((el) => {
      el.textContent = version
    })
    labelEls.forEach((el) => {
      el.textContent = `Descargar v${version} para Windows`
    })
    subEls.forEach((el) => {
      el.textContent = `${sizeMb} MB · instalador .exe`
    })
  } catch (err) {
    // Network hiccup or API rate limit — the buttons already point at
    // /releases/latest, which GitHub itself redirects to the newest
    // release page, so the download link still works either way.
    console.warn('No se pudo resolver el enlace directo de descarga:', err)
  }
}

wireDownloadLinks()
