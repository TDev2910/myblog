import { router, usePage } from '@inertiajs/react';
import { Bookmark } from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { PageProps } from '@/types';

export default function BookmarkButton({
    bookmarkableType,
    bookmarkableId,
    bookmarked,
}: {
    bookmarkableType: 'post' | 'album' | 'moment';
    bookmarkableId: number;
    bookmarked: boolean;
}) {
    const { auth } = usePage<PageProps>().props;
    const t = useTranslations();
    const [saved, setSaved] = useState(bookmarked);
    const [pending, setPending] = useState(false);

    function toggle() {
        if (!auth.user || pending) return;

        const next = !saved;
        setSaved(next);
        setPending(true);

        router.post(
            route('bookmarks.toggle'),
            { bookmarkable_type: bookmarkableType, bookmarkable_id: bookmarkableId },
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => setPending(false),
                onError: () => setSaved(!next),
            },
        );
    }

    return (
        <button
            type="button"
            onClick={toggle}
            disabled={!auth.user}
            title={saved ? t('bookmark.saved') : t('bookmark.save')}
            className={cn(
                'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60',
                saved ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-muted',
            )}
        >
            <Bookmark className="size-4" fill={saved ? 'currentColor' : 'none'} />
            {saved ? t('bookmark.saved') : t('bookmark.save')}
        </button>
    );
}
