import { Link } from '@inertiajs/react';
import { useTranslations } from '@/lib/i18n';
import { Paginated } from '@/types';

function labelText(label: string, t: (key: string) => string): string {
    if (label.includes('Previous')) return t('pagination.previous');
    if (label.includes('Next')) return t('pagination.next');

    return label;
}

export default function Pagination<T>({ data }: { data: Paginated<T> }) {
    const t = useTranslations();

    if (data.last_page <= 1) return null;

    return (
        <nav className="flex flex-wrap items-center justify-center gap-1 pt-6">
            {data.links.map((link, index) => (
                <Link
                    key={index}
                    href={link.url ?? '#'}
                    preserveScroll
                    className={
                        'min-w-9 rounded-md px-3 py-1.5 text-center text-sm ' +
                        (link.active
                            ? 'bg-primary text-primary-foreground'
                            : link.url
                              ? 'text-muted-foreground hover:bg-muted'
                              : 'pointer-events-none text-muted-foreground/40')
                    }
                >
                    {labelText(link.label, t)}
                </Link>
            ))}
        </nav>
    );
}
