import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import LanguageSwitcher from '@/components/language-switcher';
import ScrollToTopButton from '@/components/scroll-to-top-button';
import SiteFooter from '@/components/site-footer';
import { useTranslations } from '@/lib/i18n';
import { PageProps } from '@/types';

export default function PublicLayout({ children }: PropsWithChildren) {
    const { auth } = usePage<PageProps>().props;
    const t = useTranslations();

    const navigation = [
        { href: route('home'), label: t('nav.home') },
        { href: route('posts.index'), label: t('nav.articles') },
        { href: route('moments.index'), label: t('nav.moments') },
        { href: route('albums.index'), label: t('nav.albums') },
        { href: route('authors.index'), label: t('nav.authors') },
        { href: route('subjects.index'), label: t('nav.subjects') },
    ];

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <header className="border-b border-border">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
                    <Link href={route('home')} className="text-lg font-semibold">
                        myblog
                    </Link>

                    <nav className="flex items-center gap-6 text-sm">
                        {navigation.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4">
                        <LanguageSwitcher />

                        {auth.user ? (
                            <>
                                <Link
                                    href={route('bookmarks.index')}
                                    className="text-sm text-muted-foreground hover:text-foreground"
                                >
                                    {t('nav.bookmarks')}
                                </Link>
                                {auth.user.is_author && (
                                    <Link
                                        href={route('admin.posts.index')}
                                        className="text-sm text-muted-foreground hover:text-foreground"
                                    >
                                        {t('nav.admin')}
                                    </Link>
                                )}
                                <Link
                                    href={route('dashboard')}
                                    className="text-sm text-muted-foreground hover:text-foreground"
                                >
                                    {t('nav.dashboard')}
                                </Link>
                            </>
                        ) : (
                            <Link
                                href={route('login')}
                                className="text-sm text-muted-foreground hover:text-foreground"
                            >
                                {t('nav.login')}
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>

            <SiteFooter />
            <ScrollToTopButton />
        </div>
    );
}
