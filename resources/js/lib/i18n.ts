import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

export function useTranslations() {
    const { props } = usePage<PageProps>();

    return function t(key: string, replacements: Record<string, string | number> = {}): string {
        let translation = props.translations[key] ?? key;

        for (const [search, value] of Object.entries(replacements)) {
            translation = translation.replace(`:${search}`, String(value));
        }

        return translation;
    };
}

export function useLocale() {
    const { props } = usePage<PageProps>();

    return props.locale;
}

export function pickTranslation<T extends { locale: string }>(
    translations: T[] | undefined,
    locale: string,
): T | undefined {
    if (!translations || translations.length === 0) return undefined;

    return translations.find((t) => t.locale === locale) ?? translations[0];
}
