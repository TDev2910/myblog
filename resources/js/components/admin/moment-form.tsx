import { useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import PhotoUploader from '@/components/admin/photo-uploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useTranslations } from '@/lib/i18n';
import { Moment, Mood, Photo } from '@/types';

const MOODS: Mood[] = ['calm', 'rainy', 'inspired', 'nostalgic', 'late_night'];

export default function MomentForm({
    moment,
    submitUrl,
    method,
    onSuccess,
}: {
    moment?: Moment;
    submitUrl: string;
    method: 'post' | 'put';
    onSuccess: () => void;
}) {
    const t = useTranslations();
    const [photos, setPhotos] = useState<Photo[]>(moment?.photos ?? []);

    const { data, setData, post, put, processing, errors } = useForm({
        caption: moment?.caption ?? '',
        mood: (moment?.mood ?? '') as string,
        location: moment?.location ?? '',
        song: moment?.song ?? '',
        status: moment?.status ?? 'draft',
        photo_ids: [] as number[],
    });

    function handleUploaded(photo: Photo) {
        if (photos.length >= 4) {
            toast.error(t('moment.photos_hint'));
            return;
        }

        setPhotos((prev) => [...prev, photo]);
        setData('photo_ids', [...data.photo_ids, photo.id]);
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(t(moment ? 'toast.updated' : 'toast.created'));
                onSuccess();
            },
            onError: () => toast.error(t('toast.error')),
        };

        if (method === 'put') {
            put(submitUrl, options);
        } else {
            post(submitUrl, options);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
                <Label>{t('moment.caption')}</Label>
                <Textarea value={data.caption} onChange={(e) => setData('caption', e.target.value)} rows={3} maxLength={500} />
                {errors.caption && <p className="text-xs text-destructive">{errors.caption}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <Label>{t('moment.mood')}</Label>
                    <Select value={data.mood || 'none'} onValueChange={(v) => setData('mood', v && v !== 'none' ? v : '')}>
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">—</SelectItem>
                            {MOODS.map((mood) => (
                                <SelectItem key={mood} value={mood}>
                                    {t(`moment.mood.${mood}`)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label>{t('common.status')}</Label>
                    <Select value={data.status} onValueChange={(v) => setData('status', v as typeof data.status)}>
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="draft">{t('post.status.draft')}</SelectItem>
                            <SelectItem value="published">{t('post.status.published')}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <Label>{t('moment.location')}</Label>
                    <Input value={data.location} onChange={(e) => setData('location', e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                    <Label>{t('moment.song')}</Label>
                    <Input value={data.song} onChange={(e) => setData('song', e.target.value)} />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <Label>
                    Photos <span className="text-xs text-muted-foreground">({t('moment.photos_hint')})</span>
                </Label>
                {photos.length < 4 && <PhotoUploader onUploaded={handleUploaded} />}

                {photos.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                        {photos.map((photo) => (
                            <div key={photo.id} className="aspect-square overflow-hidden rounded-md bg-muted">
                                {photo.thumb_url && <img src={photo.thumb_url} alt="" className="h-full w-full object-cover" />}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Button type="submit" disabled={processing} className="self-end">
                {t('common.save')}
            </Button>
        </form>
    );
}
