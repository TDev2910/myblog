import { formatDistanceToNow } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';
import { MapPin, Music } from 'lucide-react';
import { useState } from 'react';
import BookmarkButton from '@/components/bookmark-button';
import CommentTree from '@/components/comment-tree';
import ReactionPicker from '@/components/reaction-picker';
import { useLocale, useTranslations } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { Moment } from '@/types';

function PhotoGrid({ photos }: { photos: Moment['photos'] }) {
    if (!photos || photos.length === 0) return null;

    return (
        <div
            className={cn(
                'grid gap-1 overflow-hidden rounded-lg',
                photos.length === 1 && 'grid-cols-1',
                photos.length === 2 && 'grid-cols-2',
                photos.length === 3 && 'grid-cols-2 grid-rows-2',
                photos.length >= 4 && 'grid-cols-2 grid-rows-2',
            )}
        >
            {photos.slice(0, 4).map((photo, index) => (
                <img
                    key={photo.id}
                    src={photo.medium_url}
                    alt={photo.caption ?? ''}
                    loading="lazy"
                    className={cn(
                        'h-full w-full object-cover',
                        photos.length === 1 ? 'aspect-video' : 'aspect-square',
                        photos.length === 3 && index === 0 && 'row-span-2 aspect-auto',
                    )}
                />
            ))}
        </div>
    );
}

export default function MomentCard({ moment }: { moment: Moment }) {
    const locale = useLocale();
    const t = useTranslations();
    const [showComments, setShowComments] = useState(false);
    const dateLocale = locale === 'vi' ? vi : enUS;

    return (
        <article className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                    <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        {moment.author?.name.charAt(0).toUpperCase()}
                    </span>
                    <span className="font-medium">{moment.author?.name}</span>
                    {moment.published_at && (
                        <span className="text-xs text-muted-foreground">
                            &middot; {formatDistanceToNow(new Date(moment.published_at), { addSuffix: true, locale: dateLocale })}
                        </span>
                    )}
                </div>
                {moment.mood && (
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
                        {t(`moment.mood.${moment.mood}`)}
                    </span>
                )}
            </div>

            {moment.caption && <p className="whitespace-pre-line text-sm">{moment.caption}</p>}

            <PhotoGrid photos={moment.photos} />

            {(moment.location || moment.song) && (
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {moment.location && (
                        <span className="flex items-center gap-1">
                            <MapPin className="size-3.5" />
                            {moment.location}
                        </span>
                    )}
                    {moment.song && (
                        <span className="flex items-center gap-1">
                            <Music className="size-3.5" />
                            {moment.song}
                        </span>
                    )}
                </div>
            )}

            <div className="flex flex-wrap items-center gap-3 border-t border-border pt-3">
                <ReactionPicker
                    likeableType="moment"
                    likeableId={moment.id}
                    counts={moment.reaction_counts ?? {}}
                    myReaction={moment.my_reaction ?? null}
                />
                <BookmarkButton bookmarkableType="moment" bookmarkableId={moment.id} bookmarked={moment.is_bookmarked ?? false} />
                <button
                    type="button"
                    onClick={() => setShowComments((v) => !v)}
                    className="text-sm text-muted-foreground hover:text-foreground"
                >
                    {t('post.comments')} ({moment.comments_count ?? 0})
                </button>
            </div>

            {showComments && (
                <div className="border-t border-border pt-3">
                    <CommentTree comments={moment.comments ?? []} commentableType="moment" commentableId={moment.id} />
                </div>
            )}
        </article>
    );
}
