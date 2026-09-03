import { router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import PublicLayout from '@/layouts/public-layout';
import PostCard from '@/components/post-card';
import Pagination from '@/components/pagination';
import { useTranslations } from '@/lib/i18n';
import { Paginated, Post } from '@/types';

export default function PostsIndex({
    posts,
    activeTag,
    query,
}: {
    posts: Paginated<Post>;
    activeTag: string | null;
    query: string | null;
}) {
    const t = useTranslations();
    const [term, setTerm] = useState(query ?? '');

    function handleSearch(e: FormEvent) {
        e.preventDefault();
        router.get(route('posts.index'), { q: term || undefined, tag: activeTag || undefined }, { preserveState: true });
    }

    return (
        <PublicLayout>
            <h1 className="mb-6 text-2xl font-semibold">
                {t('nav.articles')}
                {activeTag && <span className="ml-2 text-base text-muted-foreground">#{activeTag}</span>}
            </h1>

            <form onSubmit={handleSearch} className="mb-6 flex gap-2">
                <input
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder={t('common.search')}
                    className="w-full max-w-sm rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">
                    {t('common.search')}
                </button>
            </form>

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
