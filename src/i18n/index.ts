// src/i18n/index.ts
import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import zh from './locales/zh.json'
import { DEFAULT_LOCALE, detectLocale } from './locales'

type MessageValue = string | string[] | { [key: string]: MessageValue }
type MessageSchema = { [key: string]: MessageValue }

/**
 * Every language's messages, keyed by the code in `locales.ts`.
 *
 * English is the fallback, so a language whose file is missing a key shows the
 * English string rather than the key itself — which is what makes it safe to
 * add a translation before it is complete.
 */
const messages: Record<string, MessageSchema> = { en, zh }

export default createI18n<[MessageSchema], string>({
    legacy: false,
    locale: detectLocale(),
    fallbackLocale: DEFAULT_LOCALE,
    messages,
})
