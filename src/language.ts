import type { Language } from './content'

const eventName = 'emho-language-change'
let currentLanguage: Language | undefined
export function readLanguage(): Language {
  if (currentLanguage) return currentLanguage
  try {
    const saved = localStorage.getItem('emho-language')
    if (saved === 'en' || saved === 'es') return saved
  } catch (error) { console.warn('Language preference storage is unavailable.', error) }
  return navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en'
}

export function subscribeLanguage(callback: () => void) {
  const synchronize = (event: StorageEvent) => {
    if (event.key === 'emho-language' || event.key === null) {
      currentLanguage = undefined
      callback()
    }
  }
  window.addEventListener(eventName, callback)
  window.addEventListener('storage', synchronize)
  return () => {
    window.removeEventListener(eventName, callback)
    window.removeEventListener('storage', synchronize)
  }
}

export function saveLanguage(language: Language) {
  currentLanguage = language
  try { localStorage.setItem('emho-language', language) }
  catch (error) { console.warn('Language preference could not be saved.', error) }
  window.dispatchEvent(new CustomEvent(eventName))
}
