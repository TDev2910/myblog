import { Link } from '@inertiajs/react';
import { BentoItem } from '@/types';
import { pickTranslation, useLocale, useTranslations } from '@/lib/i18n';
import { cn } from '@/lib/utils';

/** Deterministic size pattern so the grid reads as an intentional bento
 * layout rather than a plain uniform grid — the first (most recent) item
 * is the featured tile. */
function sizeClass(index: number): string {
    const pattern = [
        'sm:col-span-2 sm:row-span-2', // 0 — featured
        'sm:col-span-1 sm:row-span-1',
        'sm:col-span-1 sm:row-span-2', // tall
        'sm:col-span-1 sm:row-span-1',
        'sm:col-span-2 sm:row-span-1', // wide
        'sm:col-span-1 sm:row-span-1',
        'sm:col-span-1 sm:row-span-1',
        'sm:col-span-1 sm:row-span-1',
    ];

    return pattern[index % pattern.length];
}

function coverImage(bento: BentoItem): string | undefined {
    if (bento.type === 'post') return bento.item.cover_photo?.medium_url;
    if (bento.type === 'album') return bento.item.cover_photo?.medium_url ?? bento.item.photos?.[0]?.medium_url;
    return bento.item.photos?.[0]?.medium_url;
}

function href(bento: BentoItem, locale: 'vi' | 'en'): string {
    if (bento.type === 'post') {
        const t = pickTranslation(bento.item.translations, locale);
        return t ? route('posts.show', t.slug) : route('posts.index');
    }
    if (bento.type === 'album') {
        const t = pickTranslation(bento.item.translations, locale);
        return t ? route('albums.show', t.slug) : route('albums.index');
    }
    return route('moments.index');
}

export default function BentoTile({ bento, index }: { bento: BentoItem; index: number }) {
    const locale = useLocale();
    const t = useTranslations();
    const image = coverImage(bento);

    let title = '';
    let subtitle: string | null = null;
    let badge: string | null = null;

    if (bento.type === 'post') {
        const translation = pickTranslation(bento.item.translations, locale);
        title = translation?.title ?? '';
        subtitle = t('nav.articles');
    } else if (bento.type === 'album') {
        const translation = pickTranslation(bento.item.translations, locale);
        title = translation?.title ?? '';
        subtitle = t('nav.albums');
    } else {
        title = bento.item.caption ?? t('nav.moments');
        subtitle = bento.item.location;
        badge = bento.item.mood ? t(`moment.mood.${bento.item.mood}`) : null;
    }

    return (
        <Link
            href={href(bento, locale)}
            className={cn(
                'group relative flex min-h-[9rem] flex-col justify-end overflow-hidden rounded-xl border border-border p-4',
                sizeClass(index),
                !image && 'bg-secondary',
            )}
        >
            {image && (
                <>
                    <img
                        src={image}
                        alt=""
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                </>
            )}

            <div className={cn('relative z-10 flex flex-col gap-1', image ? 'text-white' : 'text-foreground')}>
                {badge && (
                    <span
                        className={cn(
                            'mb-1 w-fit rounded-full px-2 py-0.5 text-xs',
                            image ? 'bg-white/20 backdrop-blur-sm' : 'bg-primary/10 text-primary',
                        )}
                    >
                        {badge}
                    </span>
                )}
                <p className={cn('line-clamp-3 font-semibold', index === 0 ? 'text-lg' : 'text-sm')}>{title}</p>
                {subtitle && (
                    <p className={cn('text-xs', image ? 'text-white/80' : 'text-muted-foreground')}>{subtitle}</p>
                )}
            </div>
        </Link>
    );
}
