import PublicLayout from '@/layouts/public-layout';
import PostCard from '@/components/post-card';
import Pagination from '@/components/pagination';
import TagPill from '@/components/tag-pill';
import { useLocale, useTranslations } from '@/lib/i18n';
import { Paginated, Post, Tag } from '@/types';

interface TagRow extends Tag {
    posts_count: number;
}

export default function SubjectsIndex({
    tags,
    activeTag,
    posts,
}: {
    tags: TagRow[];
    activeTag: string | null;
    posts: Paginated<Post> | null;
}) {
    const locale = useLocale();
    const t = useTranslations();

    return (
        <PublicLayout>
            <h1 className="mb-6 text-2xl font-semibold">{t('nav.subjects')}</h1>

            <div className="mb-8 flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <TagPill key={tag.id} tag={tag} locale={locale} active={tag.slug === activeTag} />
                ))}
            </div>

            {posts && (
                <>
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
                </>
            )}
        </PublicLayout>
    );
}
