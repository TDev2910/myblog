import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/lib/i18n';

export default function UpdatePasswordForm({ className = '' }: { className?: string }) {
    const t = useTranslations();
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header className="mb-4">
                <h2 className="text-lg font-medium">{t('profile.password_title')}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{t('profile.password_desc')}</p>
            </header>

            <form onSubmit={updatePassword} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="current_password">{t('profile.current_password')}</Label>
                    <Input
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        type="password"
                        autoComplete="current-password"
                    />
                    {errors.current_password && <p className="text-xs text-destructive">{errors.current_password}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="password">{t('profile.new_password')}</Label>
                    <Input
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        autoComplete="new-password"
                    />
                    {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="password_confirmation">{t('profile.confirm_password')}</Label>
                    <Input
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        type="password"
                        autoComplete="new-password"
                    />
                    {errors.password_confirmation && (
                        <p className="text-xs text-destructive">{errors.password_confirmation}</p>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <Button type="submit" disabled={processing}>
                        {t('common.save')}
                    </Button>
                    {recentlySuccessful && <p className="text-sm text-muted-foreground">{t('profile.saved')}</p>}
                </div>
            </form>
        </section>
    );
}
