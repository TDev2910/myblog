import PublicLayout from '@/layouts/public-layout';
import PostCard from '@/components/post-card';
import Pagination from '@/components/pagination';
import { useTranslations } from '@/lib/i18n';
import { Paginated, Post, User } from '@/types';

export default function AuthorShow({ author, posts }: { author: User; posts: Paginated<Post> }) {
    const t = useTranslations();

    return (
        <PublicLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-semibold">
                    {t('author.posts_by')} {author.name}
                </h1>
                {author.bio && <p className="mt-2 text-muted-foreground">{author.bio}</p>}
            </div>

            {posts.data.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t('post.no_posts')}</p>
            ) : (
                <div className="flex flex-col gap-6">
                    {posts.data.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            )}

            <Pagination data={posts} />
        </PublicLayout>
    );
}
