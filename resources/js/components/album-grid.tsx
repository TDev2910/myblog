import { Link } from '@inertiajs/react';
import { pickTranslation, useLocale, useTranslations } from '@/lib/i18n';
import { Album } from '@/types';

export default function AlbumGrid({ albums }: { albums: Album[] }) {
    const locale = useLocale();
    const t = useTranslations();

    if (albums.length === 0) {
        return <p className="text-sm text-muted-foreground">{t('album.no_albums')}</p>;
    }

    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {albums.map((album) => {
                const translation = pickTranslation(album.translations, locale);
                if (!translation) return null;

                return (
                    <Link
                        key={album.id}
                        href={route('albums.show', translation.slug)}
                        className="group flex flex-col gap-2"
                    >
                        <div className="aspect-square overflow-hidden rounded-md bg-muted">
                            {album.cover_photo?.thumb_url && (
                                <img
                                    src={album.cover_photo.thumb_url}
                                    alt={translation.title}
                                    className="h-full w-full object-cover transition group-hover:scale-105"
                                />
                            )}
                        </div>
                        <span className="text-sm font-medium group-hover:underline">{translation.title}</span>
                    </Link>
                );
            })}
        </div>
    );
}
