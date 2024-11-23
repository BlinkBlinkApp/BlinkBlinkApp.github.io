// src/i18n/index.ts
import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import zh from './locales/zh.json'

type MessageSchema = {
  [key: string]: string | MessageSchema
}

export type LocaleFamily = 'en' | 'zh'

const getUserLocaleFamily = (): LocaleFamily => {
  const savedLocale = localStorage.getItem('user-locale')
  if (savedLocale) {
    return savedLocale.split('-')[0] as LocaleFamily
  }

  return navigator.language.split('-')[0] as LocaleFamily
}

export default createI18n<[MessageSchema], LocaleFamily>({
  legacy: false,
  locale: getUserLocaleFamily(),
  fallbackLocale: 'en',
  messages: {
    en,
    zh,
  },
})
