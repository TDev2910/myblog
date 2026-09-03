import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslations } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const SHOW_AFTER_PX = 400;

export default function ScrollToTopButton() {
    const t = useTranslations();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        function onScroll() {
            setVisible(window.scrollY > SHOW_AFTER_PX);
        }

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return (
        <button
            type="button"
            onClick={scrollToTop}
            aria-label={t('common.back_to_top')}
            title={t('common.back_to_top')}
            className={cn(
                'fixed right-5 bottom-5 z-40 flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-200 hover:bg-primary/90',
                visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0',
            )}
        >
            <ArrowUp className="size-5" />
        </button>
    );
}
