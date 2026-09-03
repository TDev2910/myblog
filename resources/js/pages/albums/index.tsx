import PublicLayout from '@/layouts/public-layout';
import AlbumGrid from '@/components/album-grid';
import Pagination from '@/components/pagination';
import { useTranslations } from '@/lib/i18n';
import { Album, Paginated } from '@/types';

export default function AlbumsIndex({ albums }: { albums: Paginated<Album> }) {
    const t = useTranslations();

    return (
        <PublicLayout>
            <h1 className="mb-6 text-2xl font-semibold">{t('nav.albums')}</h1>
            <AlbumGrid albums={albums.data} />
            <Pagination data={albums} />
        </PublicLayout>
    );
}
