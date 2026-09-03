import { Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import PostCardGrid from '@/components/post-card-grid';
import AlbumCardGrid from '@/components/album-card-grid';
import BentoTile from '@/components/bento-tile';
import { useTranslations } from '@/lib/i18n';
import { Album, BentoItem, Post } from '@/types';

export default function Home({ bento, posts, albums }: { bento: BentoItem[]; posts: Post[]; albums: Album[] }) {
    const t = useTranslations();

    return (
        <PublicLayout>
            {bento.length > 0 && (
                <section className="mb-14">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold">{t('home.recent')}</h1>
                        <p className="text-sm text-muted-foreground">{t('home.recent_hint')}</p>
                    </div>

                    <div className="grid auto-rows-[9rem] grid-cols-1 gap-3 sm:grid-cols-4">
                        {bento.map((entry, index) => (
                            <BentoTile key={`${entry.type}-${entry.item.id}`} bento={entry} index={index} />
                        ))}
                    </div>
                </section>
            )}

            <section className="mb-14">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">{t('post.latest')}</h2>
                    <Link href={route('posts.index')} className="text-sm font-medium text-primary hover:underline">
                        {t('common.view_all')} &rarr;
                    </Link>
                </div>

                {posts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{t('post.no_posts')}</p>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post) => (
                            <PostCardGrid key={post.id} post={post} />
                        ))}
                    </div>
                )}
            </section>

            <section>
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">{t('album.latest')}</h2>
                    <Link href={route('albums.index')} className="text-sm font-medium text-primary hover:underline">
                        {t('common.view_all')} &rarr;
                    </Link>
                </div>

                {albums.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{t('album.no_albums')}</p>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {albums.map((album) => (
                            <AlbumCardGrid key={album.id} album={album} />
                        ))}
                    </div>
                )}
            </section>
        </PublicLayout>
    );
}
