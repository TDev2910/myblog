import { Link } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';
import { pickTranslation, useLocale, useTranslations } from '@/lib/i18n';
import { Post } from '@/types';
import TagPill from '@/components/tag-pill';

export default function PostCardGrid({ post }: { post: Post }) {
    const locale = useLocale();
    const t = useTranslations();
    const translation = pickTranslation(post.translations, locale);

    if (!translation) return null;

    const isFallback = translation.locale !== locale;
    const dateLocale = locale === 'vi' ? vi : enUS;

    return (
        <article className="flex flex-col overflow-hidden rounded-lg border border-border bg-card">
            {post.cover_photo?.medium_url && (
                <Link href={route('posts.show', translation.slug)} className="block aspect-video overflow-hidden bg-muted">
                    <img
                        src={post.cover_photo.medium_url}
                        alt={translation.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition hover:scale-105"
                    />
                </Link>
            )}

            <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="flex items-start justify-between gap-2">
                    <Link href={route('posts.show', translation.slug)} className="line-clamp-2 font-semibold hover:underline">
                        {translation.title}
                    </Link>
                    {isFallback && (
                        <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                            🌐 {t('i18n.missing_translation')}
                        </span>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                    {post.published_at && (
                        <span>
                            {t('post.published_at')}{' '}
                            {formatDistanceToNow(new Date(post.published_at), { addSuffix: true, locale: dateLocale })}
                        </span>
                    )}
                    {post.author && (
                        <>
                            <span>&middot;</span>
                            <Link
                                href={route('authors.show', post.author.username ?? '')}
                                className="flex items-center gap-1 hover:text-foreground"
                            >
                                {post.author.avatar_path ? (
                                    <img src={post.author.avatar_path} alt="" className="size-4 rounded-full object-cover" />
                                ) : (
                                    <span className="flex size-4 items-center justify-center rounded-full bg-primary/10 text-[9px] font-medium text-primary">
                                        {post.author.name.charAt(0).toUpperCase()}
                                    </span>
                                )}
                                {post.author.name}
                            </Link>
                        </>
                    )}
                </div>

                {translation.excerpt && (
                    <p className="line-clamp-2 text-sm text-muted-foreground">{translation.excerpt}</p>
                )}

                {post.tags && post.tags.length > 0 && (
                    <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                        {post.tags.slice(0, 4).map((tag) => (
                            <TagPill key={tag.id} tag={tag} locale={locale} />
                        ))}
                    </div>
                )}
            </div>
        </article>
    );
}
