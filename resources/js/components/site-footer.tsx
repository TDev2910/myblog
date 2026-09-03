import { Link } from '@inertiajs/react';
import { Mail, MapPin } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';

// Simple inline social icons — lucide-react dropped brand icons, and pulling
// in a whole icon-font just for 3 glyphs isn't worth it.
function GithubIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
            <path d="M12 .5C5.65.5.5 5.66.5 12.02c0 5.09 3.29 9.4 7.86 10.93.57.1.78-.25.78-.55v-2.15c-3.2.7-3.87-1.34-3.87-1.34-.53-1.33-1.29-1.69-1.29-1.69-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.77.12 3.06.74.8 1.18 1.83 1.18 3.09 0 4.43-2.69 5.4-5.26 5.69.41.36.78 1.06.78 2.13v3.16c0 .3.21.66.79.55A10.53 10.53 0 0 0 23.5 12.02C23.5 5.66 18.35.5 12 .5Z" />
        </svg>
    );
}

function TwitterIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
            <path d="M18.9 2H22l-7.6 8.7L23.3 22h-7.1l-5.6-7.1L4.2 22H1l8.1-9.3L0.9 2h7.3l5 6.6L18.9 2Zm-1.2 18.1h1.7L6.4 3.8H4.6l13.1 16.3Z" />
        </svg>
    );
}

function LinkedinIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
            <path d="M20.45 20.45h-3.56v-5.58c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.95v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.75v20.5C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.75V1.75C24 .78 23.2 0 22.22 0Z" />
        </svg>
    );
}

export default function SiteFooter() {
    const t = useTranslations();

    const quickLinks = [
        { label: t('nav.home'), href: route('home') },
        { label: t('nav.articles'), href: route('posts.index') },
        { label: t('nav.albums'), href: route('albums.index') },
    ];

    return (
        <footer className="border-t border-border bg-secondary/60 text-secondary-foreground">
            <div className="mx-auto max-w-5xl px-4 py-12">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="flex flex-col gap-3">
                        <Link href={route('home')} className="flex items-center gap-2 text-lg font-bold text-foreground">
                            <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                                M
                            </span>
                            myblog
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Chia sẻ kiến thức, hướng dẫn và suy nghĩ về cuộc sống hằng ngày.
                        </p>
                        <div className="mt-1 flex items-center gap-3 text-muted-foreground">
                            <a href="#" className="hover:text-foreground" aria-label="GitHub">
                                <GithubIcon />
                            </a>
                            <a href="#" className="hover:text-foreground" aria-label="Twitter">
                                <TwitterIcon />
                            </a>
                            <a href="#" className="hover:text-foreground" aria-label="LinkedIn">
                                <LinkedinIcon />
                            </a>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <h3 className="text-xs font-semibold tracking-wide text-foreground uppercase">Liên kết nhanh</h3>
                        <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
                            {quickLinks.map((link) => (
                                <Link key={link.href} href={link.href} className="hover:text-foreground">
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="flex flex-col gap-3">
                        <h3 className="text-xs font-semibold tracking-wide text-foreground uppercase">Tài nguyên</h3>
                        <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
                            <Link href={route('authors.index')} className="hover:text-foreground">
                                {t('nav.authors')}
                            </Link>
                            <Link href={route('subjects.index')} className="hover:text-foreground">
                                {t('nav.subjects')}
                            </Link>
                        </nav>
                    </div>

                    <div className="flex flex-col gap-3">
                        <h3 className="text-xs font-semibold tracking-wide text-foreground uppercase">Liên hệ</h3>
                        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                            <a href="mailto:contact@myblog.test" className="flex items-center gap-2 hover:text-foreground">
                                <Mail className="size-4" />
                                contact@myblog.test
                            </a>
                            <span className="flex items-center gap-2">
                                <MapPin className="size-4" />
                                Hà Nội, Việt Nam
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
                    <p>&copy; {new Date().getFullYear()} myblog. Đã đăng ký bản quyền.</p>
                    <nav className="flex gap-4">
                        <a href="#" className="hover:text-foreground">
                            Chính sách bảo mật
                        </a>
                        <a href="#" className="hover:text-foreground">
                            Điều khoản dịch vụ
                        </a>
                    </nav>
                </div>
            </div>
        </footer>
    );
}
