import { Link } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';
import { pickTranslation, useLocale, useTranslations } from '@/lib/i18n';
import { Album } from '@/types';

export default function AlbumCardGrid({ album }: { album: Album }) {
    const locale = useLocale();
    const t = useTranslations();
    const translation = pickTranslation(album.translations, locale);

    if (!translation) return null;

    const dateLocale = locale === 'vi' ? vi : enUS;

    return (
        <article className="flex flex-col overflow-hidden rounded-lg border border-border bg-card">
            {album.cover_photo?.medium_url && (
                <Link href={route('albums.show', translation.slug)} className="block aspect-video overflow-hidden bg-muted">
                    <img
                        src={album.cover_photo.medium_url}
                        alt={translation.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition hover:scale-105"
                    />
                </Link>
            )}

            <div className="flex flex-1 flex-col gap-2 p-4">
                <Link href={route('albums.show', translation.slug)} className="line-clamp-2 font-semibold hover:underline">
                    {translation.title}
                </Link>

                <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                    {album.published_at && (
                        <span>
                            {t('post.published_at')}{' '}
                            {formatDistanceToNow(new Date(album.published_at), { addSuffix: true, locale: dateLocale })}
                        </span>
                    )}
                    {album.author && (
                        <>
                            <span>&middot;</span>
                            <span>{album.author.name}</span>
                        </>
                    )}
                    {album.photos && album.photos.length > 0 && (
                        <>
                            <span>&middot;</span>
                            <span>
                                {album.photos.length} {t('album.photo_count')}
                            </span>
                        </>
                    )}
                </div>

                {translation.description && (
                    <p className="line-clamp-2 text-sm text-muted-foreground">{translation.description}</p>
                )}
            </div>
        </article>
    );
}
