import { useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import MarkdownEditor from '@/components/markdown-editor';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn, slugify } from '@/lib/utils';
import { useTranslations } from '@/lib/i18n';
import { Locale, Post, PostTranslation, Tag } from '@/types';

type TranslationForm = Pick<
    PostTranslation,
    'locale' | 'title' | 'slug' | 'excerpt' | 'body_md' | 'meta_title' | 'meta_description'
>;

function emptyTranslation(locale: Locale): TranslationForm {
    return { locale, title: '', slug: '', excerpt: '', body_md: '', meta_title: '', meta_description: '' };
}

export default function PostForm({
    post,
    tags,
    submitUrl,
    method,
    onSuccess,
}: {
    post?: Post;
    tags: Tag[];
    submitUrl: string;
    method: 'post' | 'put';
    onSuccess: () => void;
}) {
    const t = useTranslations();
    const [activeLocale, setActiveLocale] = useState<Locale>('vi');

    const initialTranslations: Record<Locale, TranslationForm> = {
        vi: (post?.translations?.find((tr) => tr.locale === 'vi') as TranslationForm) ?? emptyTranslation('vi'),
        en: (post?.translations?.find((tr) => tr.locale === 'en') as TranslationForm) ?? emptyTranslation('en'),
    };

    // Slug auto-follows the title until the user edits it by hand for that
    // locale (an existing slug on open counts as already "touched").
    const [slugTouched, setSlugTouched] = useState<Record<Locale, boolean>>({
        vi: initialTranslations.vi.slug.length > 0,
        en: initialTranslations.en.slug.length > 0,
    });

    const { data, setData, post: submitPost, put, transform, processing, errors } = useForm({
        status: post?.status ?? 'draft',
        published_at: post?.published_at ?? '',
        tags: post?.tags?.map((tag) => tag.id) ?? ([] as number[]),
        translations: initialTranslations,
    });

    function updateTranslation(locale: Locale, field: keyof TranslationForm, value: string) {
        setData('translations', { ...data.translations, [locale]: { ...data.translations[locale], [field]: value } });
    }

    function handleTitleChange(locale: Locale, title: string) {
        setData('translations', {
            ...data.translations,
            [locale]: {
                ...data.translations[locale],
                title,
                slug: slugTouched[locale] ? data.translations[locale].slug : slugify(title),
            },
        });
    }

    function handleSlugChange(locale: Locale, raw: string) {
        setSlugTouched((prev) => ({ ...prev, [locale]: raw.length > 0 }));
        updateTranslation(locale, 'slug', raw);
    }

    function toggleTag(id: number) {
        setData('tags', data.tags.includes(id) ? data.tags.filter((t) => t !== id) : [...data.tags, id]);
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        transform((formData) => ({
            ...formData,
            translations: Object.values(formData.translations).filter((tr) => tr.title.trim() && tr.body_md.trim()),
        }));

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(t(post ? 'toast.updated' : 'toast.created'));
                onSuccess();
            },
            onError: () => toast.error(t('toast.error')),
        };

        if (method === 'put') {
            put(submitUrl, options);
        } else {
            submitPost(submitUrl, options);
        }
    }

    const current = data.translations[activeLocale];
    const errorFor = (field: string) => errors[`translations.${activeLocale}.${field}` as never];

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="inline-flex w-fit gap-1 rounded-lg bg-muted p-1">
                {(['vi', 'en'] as Locale[]).map((locale) => (
                    <button
                        key={locale}
                        type="button"
                        onClick={() => setActiveLocale(locale)}
                        className={cn(
                            'rounded-md px-3 py-1 text-xs font-medium transition-colors',
                            activeLocale === locale
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground',
                        )}
                    >
                        {locale.toUpperCase()}
                    </button>
                ))}
            </div>

            <div className="flex flex-col gap-1.5">
                <Label>{t('post.title')}</Label>
                <Input value={current.title} onChange={(e) => handleTitleChange(activeLocale, e.target.value)} />
                {errorFor('title') && <p className="text-xs text-destructive">{errorFor('title')}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
                <Label>{t('post.slug')}</Label>
                <Input
                    value={current.slug}
                    onChange={(e) => handleSlugChange(activeLocale, e.target.value)}
                    onBlur={(e) => updateTranslation(activeLocale, 'slug', slugify(e.target.value))}
                    placeholder={t('post.slug_hint')}
                />
                <p className="text-xs text-muted-foreground">/posts/{current.slug || '...'}</p>
                {errorFor('slug') && <p className="text-xs text-destructive">{errorFor('slug')}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
                <Label>{t('post.excerpt')}</Label>
                <Textarea
                    value={current.excerpt ?? ''}
                    onChange={(e) => updateTranslation(activeLocale, 'excerpt', e.target.value)}
                    rows={2}
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <Label>{t('post.content')}</Label>
                <MarkdownEditor
                    value={current.body_md}
                    onChange={(markdown) => updateTranslation(activeLocale, 'body_md', markdown)}
                />
                {errorFor('body_md') && <p className="text-xs text-destructive">{errorFor('body_md')}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <Label>{t('common.status')}</Label>
                    <Select value={data.status} onValueChange={(v) => setData('status', v as typeof data.status)}>
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="draft">{t('post.status.draft')}</SelectItem>
                            <SelectItem value="published">{t('post.status.published')}</SelectItem>
                            <SelectItem value="archived">{t('post.status.archived')}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <Label>{t('post.tags')}</Label>
                <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                        <Badge
                            key={tag.id}
                            variant={data.tags.includes(tag.id) ? 'default' : 'secondary'}
                            className="cursor-pointer select-none"
                            onClick={() => toggleTag(tag.id)}
                        >
                            {tag.name_vi}
                        </Badge>
                    ))}
                </div>
            </div>

            <Button type="submit" disabled={processing} className="self-end">
                {t('common.save')}
            </Button>
        </form>
    );
}
