import PublicLayout from '@/layouts/public-layout';
import PostCardGrid from '@/components/post-card-grid';
import AlbumCardGrid from '@/components/album-card-grid';
import { useTranslations } from '@/lib/i18n';
import { Album, Post } from '@/types';

export default function BookmarksIndex({ posts, albums }: { posts: Post[]; albums: Album[] }) {
    const t = useTranslations();
    const isEmpty = posts.length === 0 && albums.length === 0;

    return (
        <PublicLayout>
            <h1 className="mb-8 text-2xl font-bold">{t('nav.bookmarks')}</h1>

            {isEmpty && <p className="text-sm text-muted-foreground">{t('bookmark.empty')}</p>}

            {posts.length > 0 && (
                <section className="mb-12">
                    <h2 className="mb-4 text-lg font-semibold">{t('bookmark.posts')}</h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post) => (
                            <PostCardGrid key={post.id} post={post} />
                        ))}
                    </div>
                </section>
            )}

            {albums.length > 0 && (
                <section>
                    <h2 className="mb-4 text-lg font-semibold">{t('bookmark.albums')}</h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {albums.map((album) => (
                            <AlbumCardGrid key={album.id} album={album} />
                        ))}
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}
