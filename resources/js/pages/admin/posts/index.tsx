import { router, usePage } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import AppLayout from '@/layouts/app-layout';
import Pagination from '@/components/pagination';
import PostForm from '@/components/admin/post-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { fetchInertiaProps } from '@/lib/inertia-fetch';
import { pickTranslation, useLocale, useTranslations } from '@/lib/i18n';
import { Paginated, Post, Tag } from '@/types';

type DialogState = { mode: 'create' } | { mode: 'edit'; post: Post } | { mode: 'loading' } | null;

export default function AdminPostsIndex({ posts, tags }: { posts: Paginated<Post>; tags: Tag[] }) {
    const t = useTranslations();
    const locale = useLocale();
    const { version } = usePage();
    const [dialog, setDialog] = useState<DialogState>(null);

    async function openEdit(post: Post) {
        setDialog({ mode: 'loading' });

        try {
            const props = await fetchInertiaProps<{ post: Post }>(route('admin.posts.edit', post.id), version);
            setDialog({ mode: 'edit', post: props.post });
        } catch {
            toast.error(t('toast.error'));
            setDialog(null);
        }
    }

    function destroy(post: Post) {
        if (!confirm(t('common.confirm_delete'))) return;

        router.delete(route('admin.posts.destroy', post.id), {
            preserveScroll: true,
            onSuccess: () => toast.success(t('toast.deleted')),
            onError: () => toast.error(t('toast.error')),
        });
    }

    return (
        <AppLayout>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-xl font-semibold">{t('nav.articles')}</h1>
                <Button onClick={() => setDialog({ mode: 'create' })}>
                    <PlusIcon />
                    {t('admin.new')}
                </Button>
            </div>

            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                        <th className="py-2">{t('post.title')}</th>
                        <th className="py-2">{t('common.status')}</th>
                        <th className="py-2">{t('common.actions')}</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.data.map((post) => {
                        const translation = pickTranslation(post.translations, locale);

                        return (
                            <tr key={post.id} className="border-b border-border">
                                <td className="py-2">{translation?.title}</td>
                                <td className="py-2">{t(`post.status.${post.status}`)}</td>
                                <td className="py-2">
                                    <div className="flex gap-3">
                                        <button onClick={() => openEdit(post)} className="text-primary hover:underline">
                                            {t('common.edit')}
                                        </button>
                                        <button onClick={() => destroy(post)} className="text-destructive hover:underline">
                                            {t('common.delete')}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <Pagination data={posts} />

            <Dialog open={dialog !== null} onOpenChange={(open) => !open && setDialog(null)}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>{dialog?.mode === 'edit' ? t('common.edit') : t('common.create')}</DialogTitle>
                    </DialogHeader>

                    {dialog?.mode === 'create' && (
                        <PostForm tags={tags} submitUrl={route('admin.posts.store')} method="post" onSuccess={() => setDialog(null)} />
                    )}
                    {dialog?.mode === 'edit' && (
                        <PostForm
                            post={dialog.post}
                            tags={tags}
                            submitUrl={route('admin.posts.update', dialog.post.id)}
                            method="put"
                            onSuccess={() => setDialog(null)}
                        />
                    )}
                    {dialog?.mode === 'loading' && (
                        <p className="py-8 text-center text-sm text-muted-foreground">{t('common.loading')}</p>
                    )}
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
