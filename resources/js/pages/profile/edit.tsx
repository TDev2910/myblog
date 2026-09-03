import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { useTranslations } from '@/lib/i18n';
import DeleteUserForm from './partials/delete-user-form';
import UpdatePasswordForm from './partials/update-password-form';
import UpdateProfileInformationForm from './partials/update-profile-information-form';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    const t = useTranslations();

    return (
        <AppLayout>
            <h1 className="mb-6 text-xl font-semibold">{t('nav.profile')}</h1>

            <div className="flex max-w-xl flex-col gap-6">
                <div className="rounded-lg border border-border bg-card p-6">
                    <UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} />
                </div>

                <div className="rounded-lg border border-border bg-card p-6">
                    <UpdatePasswordForm />
                </div>

                <div className="rounded-lg border border-border bg-card p-6">
                    <DeleteUserForm />
                </div>
            </div>
        </AppLayout>
    );
}
