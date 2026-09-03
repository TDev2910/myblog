import { router, usePage } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { format } from 'date-fns';
import { useTranslations } from '@/lib/i18n';
import { Comment, PageProps } from '@/types';

function CommentForm({
    onSubmit,
    placeholder,
    autoFocus = false,
}: {
    onSubmit: (body: string) => void;
    placeholder: string;
    autoFocus?: boolean;
}) {
    const [body, setBody] = useState('');
    const t = useTranslations();

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!body.trim()) return;
        onSubmit(body);
        setBody('');
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={placeholder}
                autoFocus={autoFocus}
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <button
                type="submit"
                className="self-end rounded-md bg-primary px-4 py-1.5 text-sm text-primary-foreground"
            >
                {t('common.submit')}
            </button>
        </form>
    );
}

function CommentItem({
    comment,
    commentableType,
    commentableId,
}: {
    comment: Comment;
    commentableType: 'post' | 'album' | 'moment';
    commentableId: number;
}) {
    const { auth } = usePage<PageProps>().props;
    const [replying, setReplying] = useState(false);
    const t = useTranslations();

    const canDelete = auth.user && (auth.user.id === comment.user_id || auth.user.is_admin);

    function submitReply(body: string) {
        router.post(
            route('comments.store'),
            {
                commentable_type: commentableType,
                commentable_id: commentableId,
                parent_id: comment.id,
                body,
            },
            { preserveScroll: true, onSuccess: () => setReplying(false) },
        );
    }

    function destroy() {
        if (!confirm(t('common.confirm_delete'))) return;
        router.delete(route('comments.destroy', comment.id), { preserveScroll: true });
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="rounded-md bg-muted/50 p-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{comment.user?.name}</span>
                    <span>{format(new Date(comment.created_at), 'dd/MM/yyyy HH:mm')}</span>
                </div>
                <p className="mt-1 text-sm whitespace-pre-line">{comment.body}</p>

                <div className="mt-2 flex gap-3 text-xs">
                    {auth.user && (
                        <button onClick={() => setReplying((v) => !v)} className="text-muted-foreground hover:text-foreground">
                            {t('common.reply')}
                        </button>
                    )}
                    {canDelete && (
                        <button onClick={destroy} className="text-destructive hover:opacity-80">
                            {t('common.delete')}
                        </button>
                    )}
                </div>

                {replying && (
                    <div className="mt-2">
                        <CommentForm onSubmit={submitReply} placeholder={t('comment.placeholder')} autoFocus />
                    </div>
                )}
            </div>

            {comment.replies && comment.replies.length > 0 && (
                <div className="ml-6 flex flex-col gap-2 border-l border-border pl-4">
                    {comment.replies.map((reply) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            commentableType={commentableType}
                            commentableId={commentableId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function CommentTree({
    comments,
    commentableType,
    commentableId,
}: {
    comments: Comment[];
    commentableType: 'post' | 'album' | 'moment';
    commentableId: number;
}) {
    const { auth } = usePage<PageProps>().props;
    const t = useTranslations();

    function submitTopLevel(body: string) {
        router.post(
            route('comments.store'),
            { commentable_type: commentableType, commentable_id: commentableId, body },
            { preserveScroll: true },
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">{t('post.comments')}</h2>

            {auth.user ? (
                <CommentForm onSubmit={submitTopLevel} placeholder={t('comment.placeholder')} />
            ) : (
                <p className="text-sm text-muted-foreground">{t('nav.login')}</p>
            )}

            {comments.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t('comment.no_comments')}</p>
            ) : (
                <div className="flex flex-col gap-4">
                    {comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            commentableType={commentableType}
                            commentableId={commentableId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
