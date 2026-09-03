import { format } from 'date-fns';
import PublicLayout from '@/layouts/public-layout';
import BookmarkButton from '@/components/bookmark-button';
import CommentTree from '@/components/comment-tree';
import ReactionPicker from '@/components/reaction-picker';
import PostCard from '@/components/post-card';
import TagPill from '@/components/tag-pill';
import { pickTranslation, useLocale, useTranslations } from '@/lib/i18n';
import { Post } from '@/types';

export default function PostShow({ post, related }: { post: Post; related: Post[] }) {
    const locale = useLocale();
    const t = useTranslations();
    const translation = pickTranslation(post.translations, locale);

    if (!translation) return null;

    const isFallback = translation.locale !== locale;

    return (
        <PublicLayout>
            <article className="mx-auto max-w-3xl">
                <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                    {post.published_at && <span>{format(new Date(post.published_at), 'dd/MM/yyyy')}</span>}
                    {post.author && (
                        <span>
                            {t('post.by')} {post.author.name}
                        </span>
                    )}
                    {isFallback && (
                        <span className="rounded bg-muted px-1.5 py-0.5">🌐 {t('i18n.missing_translation')}</span>
                    )}
                </div>

                <h1 className="mb-6 text-3xl font-bold">{translation.title}</h1>

                <div
                    className="prose prose-neutral dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: translation.body_html }}
                />

                {post.tags && post.tags.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-1.5">
                        {post.tags.map((tag) => (
                            <TagPill key={tag.id} tag={tag} locale={locale} />
                        ))}
                    </div>
                )}

                <div className="mt-6 flex flex-wrap items-center gap-3">
                    <ReactionPicker
                        likeableType="post"
                        likeableId={post.id}
                        counts={post.reaction_counts ?? {}}
                        myReaction={post.my_reaction ?? null}
                    />
                    <BookmarkButton bookmarkableType="post" bookmarkableId={post.id} bookmarked={post.is_bookmarked ?? false} />
                </div>

                {related.length > 0 && (
                    <section className="mt-12">
                        <h2 className="mb-4 text-lg font-semibold">{t('post.related')}</h2>
                        <div className="flex flex-col gap-6">
                            {related.map((p) => (
                                <PostCard key={p.id} post={p} />
                            ))}
                        </div>
                    </section>
                )}

                <div className="mt-12 border-t border-border pt-8">
                    <CommentTree comments={post.comments ?? []} commentableType="post" commentableId={post.id} />
                </div>
            </article>
        </PublicLayout>
    );
}
