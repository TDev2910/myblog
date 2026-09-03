import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/lib/i18n';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const t = useTranslations();
    // This form only renders behind the `auth` middleware, so a user is always present.
    const user = usePage().props.auth.user!;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header className="mb-4">
                <h2 className="text-lg font-medium">{t('profile.info_title')}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{t('profile.info_desc')}</p>
            </header>

            <form onSubmit={submit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="name">{t('profile.name')}</Label>
                    <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoFocus
                        autoComplete="name"
                    />
                    {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="email">{t('profile.email')}</Label>
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="text-sm">
                        <p className="text-muted-foreground">
                            {t('profile.email_unverified')}{' '}
                            <Link href={route('verification.send')} method="post" as="button" className="underline hover:text-foreground">
                                {t('profile.resend_verification')}
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <p className="mt-2 font-medium text-primary">{t('profile.verification_sent')}</p>
                        )}
                    </div>
                )}

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
