import { router, usePage } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import AppLayout from '@/layouts/app-layout';
import Pagination from '@/components/pagination';
import MomentForm from '@/components/admin/moment-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { fetchInertiaProps } from '@/lib/inertia-fetch';
import { useTranslations } from '@/lib/i18n';
import { Moment, Paginated } from '@/types';

type DialogState = { mode: 'create' } | { mode: 'edit'; moment: Moment } | { mode: 'loading' } | null;

export default function AdminMomentsIndex({ moments }: { moments: Paginated<Moment> }) {
    const t = useTranslations();
    const { version } = usePage();
    const [dialog, setDialog] = useState<DialogState>(null);

    async function openEdit(moment: Moment) {
        setDialog({ mode: 'loading' });

        try {
            const props = await fetchInertiaProps<{ moment: Moment }>(route('admin.moments.edit', moment.id), version);
            setDialog({ mode: 'edit', moment: props.moment });
        } catch {
            toast.error(t('toast.error'));
            setDialog(null);
        }
    }

    function destroy(moment: Moment) {
        if (!confirm(t('common.confirm_delete'))) return;

        router.delete(route('admin.moments.destroy', moment.id), {
            preserveScroll: true,
            onSuccess: () => toast.success(t('toast.deleted')),
            onError: () => toast.error(t('toast.error')),
        });
    }

    return (
        <AppLayout>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-xl font-semibold">{t('nav.moments')}</h1>
                <Button onClick={() => setDialog({ mode: 'create' })}>
                    <PlusIcon />
                    {t('admin.new')}
                </Button>
            </div>

            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                        <th className="py-2">{t('moment.caption')}</th>
                        <th className="py-2">{t('common.status')}</th>
                        <th className="py-2">{t('common.actions')}</th>
                    </tr>
                </thead>
                <tbody>
                    {moments.data.map((moment) => (
                        <tr key={moment.id} className="border-b border-border">
                            <td className="max-w-xs truncate py-2">{moment.caption || `(${moment.photos?.length ?? 0} photos)`}</td>
                            <td className="py-2">{t(`post.status.${moment.status}`)}</td>
                            <td className="py-2">
                                <div className="flex gap-3">
                                    <button onClick={() => openEdit(moment)} className="text-primary hover:underline">
                                        {t('common.edit')}
                                    </button>
                                    <button onClick={() => destroy(moment)} className="text-destructive hover:underline">
                                        {t('common.delete')}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Pagination data={moments} />

            <Dialog open={dialog !== null} onOpenChange={(open) => !open && setDialog(null)}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{dialog?.mode === 'edit' ? t('common.edit') : t('common.create')}</DialogTitle>
                    </DialogHeader>

                    {dialog?.mode === 'create' && (
                        <MomentForm submitUrl={route('admin.moments.store')} method="post" onSuccess={() => setDialog(null)} />
                    )}
                    {dialog?.mode === 'edit' && (
                        <MomentForm
                            moment={dialog.moment}
                            submitUrl={route('admin.moments.update', dialog.moment.id)}
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
