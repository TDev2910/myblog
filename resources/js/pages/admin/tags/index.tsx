import { router } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import AppLayout from '@/layouts/app-layout';
import Pagination from '@/components/pagination';
import TagForm from '@/components/admin/tag-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslations } from '@/lib/i18n';
import { Paginated, Tag } from '@/types';

export default function AdminTagsIndex({ tags }: { tags: Paginated<Tag> }) {
    const t = useTranslations();
    const [editing, setEditing] = useState<Tag | 'new' | null>(null);

    function destroy(tag: Tag) {
        if (!confirm(t('common.confirm_delete'))) return;

        router.delete(route('admin.tags.destroy', tag.id), {
            preserveScroll: true,
            onSuccess: () => toast.success(t('toast.deleted')),
            onError: () => toast.error(t('toast.error')),
        });
    }

    return (
        <AppLayout>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-xl font-semibold">{t('nav.subjects')}</h1>
                <Button onClick={() => setEditing('new')}>
                    <PlusIcon />
                    {t('admin.new')}
                </Button>
            </div>

            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                        <th className="py-2">VI</th>
                        <th className="py-2">EN</th>
                        <th className="py-2">Slug</th>
                        <th className="py-2">{t('common.actions')}</th>
                    </tr>
                </thead>
                <tbody>
                    {tags.data.map((tag) => (
                        <tr key={tag.id} className="border-b border-border">
                            <td className="py-2">{tag.name_vi}</td>
                            <td className="py-2">{tag.name_en}</td>
                            <td className="py-2 text-muted-foreground">{tag.slug}</td>
                            <td className="py-2">
                                <div className="flex gap-3">
                                    <button onClick={() => setEditing(tag)} className="text-primary hover:underline">
                                        {t('common.edit')}
                                    </button>
                                    <button onClick={() => destroy(tag)} className="text-destructive hover:underline">
                                        {t('common.delete')}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Pagination data={tags} />

            <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editing === 'new' ? t('common.create') : t('common.edit')}</DialogTitle>
                    </DialogHeader>

                    {editing !== null && (
                        <TagForm
                            tag={editing === 'new' ? undefined : editing}
                            submitUrl={editing === 'new' ? route('admin.tags.store') : route('admin.tags.update', editing.id)}
                            method={editing === 'new' ? 'post' : 'put'}
                            onSuccess={() => setEditing(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
