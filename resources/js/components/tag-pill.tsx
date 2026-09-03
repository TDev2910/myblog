import { Link } from '@inertiajs/react';
import { Tag, Locale } from '@/types';

export default function TagPill({ tag, locale, active = false }: { tag: Tag; locale: Locale; active?: boolean }) {
    const label = locale === 'vi' ? tag.name_vi : tag.name_en;

    return (
        <Link
            href={route('subjects.index', { tag: tag.slug })}
            className={
                active
                    ? 'rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground'
                    : 'rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground hover:opacity-80'
            }
        >
            {label}
        </Link>
    );
}
