import { Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import Pagination from '@/components/pagination';
import { useTranslations } from '@/lib/i18n';
import { Paginated, User } from '@/types';

interface AuthorRow extends User {
    posts_count: number;
}

export default function AuthorsIndex({ authors }: { authors: Paginated<AuthorRow> }) {
    const t = useTranslations();

    return (
        <PublicLayout>
            <h1 className="mb-6 text-2xl font-semibold">{t('nav.authors')}</h1>

            <div className="flex flex-col divide-y divide-border">
                {authors.data.map((author) => (
                    <Link
                        key={author.id}
                        href={route('authors.show', author.username)}
                        className="flex items-center justify-between py-4 hover:bg-muted/50"
                    >
                        <div>
                            <p className="font-medium">{author.name}</p>
                            {author.bio && <p className="text-sm text-muted-foreground">{author.bio}</p>}
                        </div>
                        <span className="text-sm text-muted-foreground">{author.posts_count}</span>
                    </Link>
                ))}
            </div>

            <Pagination data={authors} />
        </PublicLayout>
    );
}
