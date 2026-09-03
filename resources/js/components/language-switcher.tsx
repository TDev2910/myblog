import { router } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLocale } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { Locale } from '@/types';

const OPTIONS: Record<Locale, { label: string; flag: string }> = {
    vi: { label: 'Tiếng Việt', flag: '🇻🇳' },
    en: { label: 'English', flag: '🇺🇸' },
};

export default function LanguageSwitcher() {
    const locale = useLocale();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    function switchTo(target: Locale) {
        setOpen(false);
        if (target === locale) return;

        router.get(
            window.location.pathname,
            { ...Object.fromEntries(new URLSearchParams(window.location.search)), lang: target },
            { preserveState: false, preserveScroll: true },
        );
    }

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
                <span className="text-base leading-none">{OPTIONS[locale].flag}</span>
                <ChevronDown className={cn('size-3.5 transition-transform', open && 'rotate-180')} />
            </button>

            {open && (
                <div className="absolute right-0 z-50 mt-1 w-40 overflow-hidden rounded-md border border-border bg-popover py-1 shadow-md">
                    {(Object.keys(OPTIONS) as Locale[]).map((code) => (
                        <button
                            key={code}
                            type="button"
                            onClick={() => switchTo(code)}
                            className={cn(
                                'flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-muted',
                                code === locale ? 'font-medium text-foreground' : 'text-muted-foreground',
                            )}
                        >
                            <span className="text-base leading-none">{OPTIONS[code].flag}</span>
                            {OPTIONS[code].label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
