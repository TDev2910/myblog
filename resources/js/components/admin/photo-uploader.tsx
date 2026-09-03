import axios from 'axios';
import { useState } from 'react';
import { useTranslations } from '@/lib/i18n';
import { Photo } from '@/types';

export default function PhotoUploader({
    albumId,
    onUploaded,
}: {
    albumId?: number;
    onUploaded: (photo: Photo) => void;
}) {
    const t = useTranslations();
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleFiles(files: FileList | null) {
        if (!files || files.length === 0) return;

        setUploading(true);
        setError(null);

        for (const file of Array.from(files)) {
            const formData = new FormData();
            formData.append('file', file);
            if (albumId) formData.append('album_id', String(albumId));

            try {
                const { data } = await axios.post(route('admin.photos.upload'), formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                onUploaded(data.photo as Photo);
            } catch {
                setError('Upload failed for ' + file.name);
            }
        }

        setUploading(false);
    }

    return (
        <div className="flex flex-col gap-2">
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-border p-6 text-sm text-muted-foreground hover:bg-muted/50">
                {uploading ? t('common.loading') : 'Drop images or click to upload (jpeg/png/webp, max 10MB)'}
                <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                    disabled={uploading}
                />
            </label>
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}
