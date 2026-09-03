import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslations } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { PageProps, Reaction } from '@/types';

const REACTIONS: { type: Reaction; emoji: string }[] = [
    { type: 'coffee', emoji: '☕' },
    { type: 'peaceful', emoji: '🌿' },
    { type: 'empathy', emoji: '🫂' },
    { type: 'love', emoji: '✨' },
];

export default function ReactionPicker({
    likeableType,
    likeableId,
    counts,
    myReaction,
}: {
    likeableType: 'post' | 'album' | 'moment';
    likeableId: number;
    counts: Partial<Record<Reaction, number>>;
    myReaction: Reaction | null;
}) {
    const { auth } = usePage<PageProps>().props;
    const t = useTranslations();
    const [active, setActive] = useState<Reaction | null>(myReaction);
    const [localCounts, setLocalCounts] = useState(counts);
    const [pending, setPending] = useState(false);

    function toggle(type: Reaction) {
        if (!auth.user || pending) return;

        const previousActive = active;
        const nextActive = active === type ? null : type;

        setActive(nextActive);
        setLocalCounts((current) => {
            const next = { ...current };
            if (previousActive) next[previousActive] = Math.max(0, (next[previousActive] ?? 0) - 1);
            if (nextActive) next[nextActive] = (next[nextActive] ?? 0) + 1;
            return next;
        });
        setPending(true);

        router.post(
            route('likes.toggle'),
            { likeable_type: likeableType, likeable_id: likeableId, reaction: type },
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => setPending(false),
                onError: () => {
                    setActive(previousActive);
                    setLocalCounts(counts);
                },
            },
        );
    }

    return (
        <div className="flex flex-wrap items-center gap-2">
            {REACTIONS.map(({ type, emoji }) => {
                const isActive = active === type;
                const count = localCounts[type] ?? 0;

                return (
                    <button
                        key={type}
                        type="button"
                        title={t(`reaction.${type}`)}
                        onClick={() => toggle(type)}
                        disabled={!auth.user}
                        className={cn(
                            'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60',
                            isActive
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border text-muted-foreground hover:bg-muted',
                        )}
                    >
                        <span>{emoji}</span>
                        {count > 0 && <span>{count}</span>}
                    </button>
                );
            })}
        </div>
    );
}
