import { useEffect, useState } from 'react';
import { Photo } from '@/types';

export default function Lightbox({ photos }: { photos: Photo[] }) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    useEffect(() => {
        if (openIndex === null) return;

        function onKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') setOpenIndex(null);
            if (e.key === 'ArrowRight') setOpenIndex((i) => (i === null ? i : Math.min(i + 1, photos.length - 1)));
            if (e.key === 'ArrowLeft') setOpenIndex((i) => (i === null ? i : Math.max(i - 1, 0)));
        }

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [openIndex, photos.length]);

    const active = openIndex !== null ? photos[openIndex] : null;

    return (
        <>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                {photos.map((photo, index) => (
                    <button
                        key={photo.id}
                        type="button"
                        onClick={() => setOpenIndex(index)}
                        className="aspect-square overflow-hidden rounded-md bg-muted"
                    >
                        {photo.thumb_url && (
                            <img
                                src={photo.thumb_url}
                                alt={photo.caption ?? ''}
                                loading="lazy"
                                className="h-full w-full object-cover transition hover:scale-105"
                            />
                        )}
                    </button>
                ))}
            </div>

            {active && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
                    onClick={() => setOpenIndex(null)}
                >
                    <img
                        src={active.medium_url ?? active.full_url}
                        alt={active.caption ?? ''}
                        className="max-h-full max-w-full object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                    {active.caption && (
                        <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-white/80">
                            {active.caption}
                        </p>
                    )}
                </div>
            )}
        </>
    );
}
