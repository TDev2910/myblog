import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/lib/i18n';

export default function DeleteUserForm({ className = '' }: { className?: string }) {
    const t = useTranslations();
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm({
        password: '',
    });

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    function closeModal() {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    }

    return (
        <section className={className}>
            <header className="mb-4">
                <h2 className="text-lg font-medium">{t('profile.delete_title')}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{t('profile.delete_desc')}</p>
            </header>

            <Button type="button" variant="destructive" onClick={() => setConfirmingUserDeletion(true)}>
                {t('profile.delete_button')}
            </Button>

            <Dialog open={confirmingUserDeletion} onOpenChange={(open) => !open && closeModal()}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t('profile.delete_confirm_title')}</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={deleteUser} className="flex flex-col gap-4">
                        <p className="text-sm text-muted-foreground">{t('profile.delete_confirm_desc')}</p>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="delete-password" className="sr-only">
                                {t('profile.password_placeholder')}
                            </Label>
                            <Input
                                id="delete-password"
                                type="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder={t('profile.password_placeholder')}
                                autoFocus
                            />
                            {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={closeModal}>
                                {t('common.cancel')}
                            </Button>
                            <Button type="submit" variant="destructive" disabled={processing}>
                                {t('profile.delete_button')}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </section>
    );
}
