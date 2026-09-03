import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { pickTranslation, useLocale, useTranslations } from '@/lib/i18n';
import { Post } from '@/types';
import TagPill from '@/components/tag-pill';

export default function PostCard({ post }: { post: Post }) {
    const locale = useLocale();
    const t = useTranslations();
    const translation = pickTranslation(post.translations, locale);

    if (!translation) return null;

    const isFallback = translation.locale !== locale;

    return (
        <article className="flex flex-col gap-2 border-b border-border pb-6">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
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

            <Link href={route('posts.show', translation.slug)} className="text-xl font-semibold hover:underline">
                {translation.title}
            </Link>

            {translation.excerpt && <p className="text-sm text-muted-foreground">{translation.excerpt}</p>}

            {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                        <TagPill key={tag.id} tag={tag} locale={locale} />
                    ))}
                </div>
            )}
        </article>
    );
}
