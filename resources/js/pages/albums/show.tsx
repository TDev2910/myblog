import PublicLayout from '@/layouts/public-layout';
import BookmarkButton from '@/components/bookmark-button';
import CommentTree from '@/components/comment-tree';
import ReactionPicker from '@/components/reaction-picker';
import Lightbox from '@/components/lightbox';
import TagPill from '@/components/tag-pill';
import { pickTranslation, useLocale, useTranslations } from '@/lib/i18n';
import { Album } from '@/types';

export default function AlbumShow({ album }: { album: Album }) {
    const locale = useLocale();
    const t = useTranslations();
    const translation = pickTranslation(album.translations, locale);

    if (!translation) return null;

    return (
        <PublicLayout>
            <div className="mx-auto max-w-4xl">
                <h1 className="mb-2 text-3xl font-bold">{translation.title}</h1>
                {album.author && (
                    <p className="mb-6 text-sm text-muted-foreground">
                        {t('post.by')} {album.author.name}
                    </p>
                )}

                {translation.description && (
                    <p className="mb-6 text-muted-foreground">{translation.description}</p>
                )}

                {album.tags && album.tags.length > 0 && (
                    <div className="mb-6 flex flex-wrap gap-1.5">
                        {album.tags.map((tag) => (
                            <TagPill key={tag.id} tag={tag} locale={locale} />
                        ))}
                    </div>
                )}

                <Lightbox photos={album.photos ?? []} />

                <div className="mt-6 flex flex-wrap items-center gap-3">
                    <ReactionPicker
                        likeableType="album"
                        likeableId={album.id}
                        counts={album.reaction_counts ?? {}}
                        myReaction={album.my_reaction ?? null}
                    />
                    <BookmarkButton bookmarkableType="album" bookmarkableId={album.id} bookmarked={album.is_bookmarked ?? false} />
                </div>

                <div className="mt-12 border-t border-border pt-8">
                    <CommentTree
                        comments={album.comments ?? []}
                        commentableType="album"
                        commentableId={album.id}
                    />
                </div>
            </div>
        </PublicLayout>
    );
}
