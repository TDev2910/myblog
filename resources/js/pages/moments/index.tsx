import PublicLayout from '@/layouts/public-layout';
import MomentCard from '@/components/moment-card';
import Pagination from '@/components/pagination';
import { useTranslations } from '@/lib/i18n';
import { Moment, Paginated } from '@/types';

export default function MomentsIndex({ moments }: { moments: Paginated<Moment> }) {
    const t = useTranslations();

    return (
        <PublicLayout>
            <h1 className="mb-6 text-2xl font-bold">{t('nav.moments')}</h1>

            {moments.data.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t('moment.no_moments')}</p>
            ) : (
                <div className="mx-auto flex max-w-xl flex-col gap-4">
                    {moments.data.map((moment) => (
                        <MomentCard key={moment.id} moment={moment} />
                    ))}
                </div>
            )}

            <Pagination data={moments} />
        </PublicLayout>
    );
}
