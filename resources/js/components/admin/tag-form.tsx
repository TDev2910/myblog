import { useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/lib/i18n';
import { slugify } from '@/lib/utils';
import { Tag } from '@/types';

export default function TagForm({
    tag,
    submitUrl,
    method,
    onSuccess,
}: {
    tag?: Tag;
    submitUrl: string;
    method: 'post' | 'put';
    onSuccess: () => void;
}) {
    const t = useTranslations();
    const [slugTouched, setSlugTouched] = useState((tag?.slug ?? '').length > 0);

    const { data, setData, post, put, processing, errors } = useForm({
        slug: tag?.slug ?? '',
        name_vi: tag?.name_vi ?? '',
        name_en: tag?.name_en ?? '',
    });

    function handleNameViChange(name_vi: string) {
        setData({ ...data, name_vi, slug: slugTouched ? data.slug : slugify(name_vi) });
    }

    function handleSlugChange(raw: string) {
        setSlugTouched(raw.length > 0);
        setData('slug', raw);
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(t(tag ? 'toast.updated' : 'toast.created'));
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
                <Label htmlFor="tag-name-vi">Tên (VI)</Label>
                <Input id="tag-name-vi" value={data.name_vi} onChange={(e) => handleNameViChange(e.target.value)} />
                {errors.name_vi && <p className="text-xs text-destructive">{errors.name_vi}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
                <Label htmlFor="tag-slug">Slug</Label>
                <Input
                    id="tag-slug"
                    value={data.slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    onBlur={(e) => setData('slug', slugify(e.target.value))}
                />
                {errors.slug && <p className="text-xs text-destructive">{errors.slug}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
                <Label htmlFor="tag-name-en">Name (EN)</Label>
                <Input id="tag-name-en" value={data.name_en} onChange={(e) => setData('name_en', e.target.value)} />
                {errors.name_en && <p className="text-xs text-destructive">{errors.name_en}</p>}
            </div>

            <Button type="submit" disabled={processing} className="self-end">
                {t('common.save')}
            </Button>
        </form>
    );
}
