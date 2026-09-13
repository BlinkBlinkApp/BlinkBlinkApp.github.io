/**
 * The languages the site is offered in.
 *
 * One entry per file in `./locales`. Adding a language is this list plus the
 * JSON beside it — nothing in the picker or the detection needs touching.
 *
 * `name` is what speakers call the language in that language, never the English
 * exonym: someone looking for their own language scans for 日本語, not
 * "Japanese". `short` is what fits in the collapsed button.
 */
export interface Language {
    /** BCP 47 tag, and the basename of the file in `./locales`. */
    code: string
    /** The language's own name for itself. */
    name: string
    /** One or two characters for the collapsed button. */
    short: string
}

export const LANGUAGES: readonly Language[] = [
    { code: 'en', name: 'English', short: 'EN' },
    { code: 'zh', name: '中文', short: '中' },
]

export const DEFAULT_LOCALE = 'en'

const STORAGE_KEY = 'user-locale'

const isKnown = (code: string | null | undefined): boolean => Boolean(code) && LANGUAGES.some((language) => language.code === code)

/** Reads the remembered choice, tolerating a browser that refuses storage. */
export function storedLocale(): string | null {
    try {
        const saved = localStorage.getItem(STORAGE_KEY)
        return isKnown(saved) ? saved : null
    } catch {
        return null
    }
}

export function rememberLocale(code: string): void {
    try {
        localStorage.setItem(STORAGE_KEY, code)
    } catch {
        // Private browsing, or storage switched off. The choice still applies
        // for this visit; it just will not survive a reload.
    }
}

/**
 * The language to open in.
 *
 * A remembered choice wins. Otherwise the browser's own preference order is
 * walked — `navigator.languages` is a ranked list, so someone who reads Chinese
 * first and English second gets Chinese rather than whichever we checked first.
 * Each entry is tried as an exact tag and then as its base, so `zh-TW` finds
 * `zh` without the list having to name every region.
 */
export function detectLocale(): string {
    const remembered = storedLocale()
    if (remembered) return remembered

    const preferences = navigator.languages?.length ? navigator.languages : [navigator.language]

    for (const tag of preferences) {
        if (!tag) continue
        const wanted = tag.toLowerCase()

        const exact = LANGUAGES.find((language) => language.code.toLowerCase() === wanted)
        if (exact) return exact.code

        const base = wanted.split('-')[0]
        const family = LANGUAGES.find((language) => language.code.toLowerCase().split('-')[0] === base)
        if (family) return family.code
    }

    return DEFAULT_LOCALE
}
