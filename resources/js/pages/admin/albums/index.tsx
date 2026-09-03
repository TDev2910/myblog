import { router, usePage } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import AppLayout from '@/layouts/app-layout';
import Pagination from '@/components/pagination';
import AlbumForm from '@/components/admin/album-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { fetchInertiaProps } from '@/lib/inertia-fetch';
import { pickTranslation, useLocale, useTranslations } from '@/lib/i18n';
import { Album, Paginated, Tag } from '@/types';

type DialogState = { mode: 'create' } | { mode: 'edit'; album: Album } | { mode: 'loading' } | null;

export default function AdminAlbumsIndex({ albums, tags }: { albums: Paginated<Album>; tags: Tag[] }) {
    const t = useTranslations();
    const locale = useLocale();
    const { version } = usePage();
    const [dialog, setDialog] = useState<DialogState>(null);

    async function openEdit(album: Album) {
        setDialog({ mode: 'loading' });

        try {
            const props = await fetchInertiaProps<{ album: Album }>(route('admin.albums.edit', album.id), version);
            setDialog({ mode: 'edit', album: props.album });
        } catch {
            toast.error(t('toast.error'));
            setDialog(null);
        }
    }

    function destroy(album: Album) {
        if (!confirm(t('common.confirm_delete'))) return;

        router.delete(route('admin.albums.destroy', album.id), {
            preserveScroll: true,
            onSuccess: () => toast.success(t('toast.deleted')),
            onError: () => toast.error(t('toast.error')),
        });
    }

    return (
        <AppLayout>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-xl font-semibold">{t('nav.albums')}</h1>
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
                    {albums.data.map((album) => {
                        const translation = pickTranslation(album.translations, locale);

                        return (
                            <tr key={album.id} className="border-b border-border">
                                <td className="py-2">{translation?.title}</td>
                                <td className="py-2">{t(`post.status.${album.status}`)}</td>
                                <td className="py-2">
                                    <div className="flex gap-3">
                                        <button onClick={() => openEdit(album)} className="text-primary hover:underline">
                                            {t('common.edit')}
                                        </button>
                                        <button onClick={() => destroy(album)} className="text-destructive hover:underline">
                                            {t('common.delete')}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <Pagination data={albums} />

            <Dialog open={dialog !== null} onOpenChange={(open) => !open && setDialog(null)}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>{dialog?.mode === 'edit' ? t('common.edit') : t('common.create')}</DialogTitle>
                    </DialogHeader>

                    {dialog?.mode === 'create' && (
                        <AlbumForm tags={tags} submitUrl={route('admin.albums.store')} method="post" onSuccess={() => setDialog(null)} />
                    )}
                    {dialog?.mode === 'edit' && (
                        <AlbumForm
                            album={dialog.album}
                            tags={tags}
                            submitUrl={route('admin.albums.update', dialog.album.id)}
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
