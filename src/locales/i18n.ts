import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en/translation.json'
import fr from './fr/translation.json'
import es from './es/translation.json'

const saved = localStorage.getItem('lang') as 'en'|'fr'|'es' | null

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, fr: { translation: fr }, es: { translation: es } },
  lng: saved || 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n