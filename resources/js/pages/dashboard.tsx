import { usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useTranslations } from '@/lib/i18n';
import { PageProps } from '@/types';

export default function Dashboard() {
    const { auth } = usePage<PageProps>().props;
    const t = useTranslations();

    return (
        <AppLayout>
            <h1 className="mb-6 text-xl font-semibold">{t('nav.dashboard')}</h1>

            <div className="rounded-lg border border-border bg-card p-6">
                <p className="text-sm text-muted-foreground">
                    {t('dashboard.welcome')}, <span className="font-medium text-foreground">{auth.user?.name}</span>.
                </p>
            </div>
        </AppLayout>
    );
}
