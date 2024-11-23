// src/i18n/index.ts
import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import zh from './locales/zh.json'

type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
      ? RecursivePartial<T[P]>
      : T[P]
}

type MessageValue = string | string[] | { [key: string]: MessageValue }
type MessageSchema = { [key: string]: MessageValue }

export type LocaleFamily = 'en' | 'zh'

const getUserLocaleFamily = (): LocaleFamily => {
  const savedLocale = localStorage.getItem('user-locale')
  if (savedLocale && (savedLocale === 'en' || savedLocale === 'zh')) {
    return savedLocale
  }

  const browserLocale = navigator.language.split('-')[0] as LocaleFamily
  return browserLocale === 'zh' ? 'zh' : 'en'
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
