import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft, FileText, Images, LayoutDashboard, LogOut, Sparkles, Tag, User } from 'lucide-react';
import { PropsWithChildren } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { useTranslations } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { PageProps } from '@/types';

export default function AppLayout({ children }: PropsWithChildren) {
    const { auth, ziggy } = usePage<PageProps>().props;
    const t = useTranslations();
    const currentPath = new URL(ziggy.location).pathname;

    const mainNav = [
        { href: route('dashboard'), label: t('nav.dashboard'), icon: LayoutDashboard },
        { href: route('profile.edit'), label: t('nav.profile'), icon: User },
    ];

    const adminNav = [
        { href: route('admin.posts.index'), label: t('nav.articles'), icon: FileText },
        { href: route('admin.moments.index'), label: t('nav.moments'), icon: Sparkles },
        { href: route('admin.albums.index'), label: t('nav.albums'), icon: Images },
        { href: route('admin.tags.index'), label: t('nav.subjects'), icon: Tag },
    ];

    function NavLink({ href, label, icon: Icon }: { href: string; label: string; icon: typeof User }) {
        const active = currentPath === new URL(href).pathname;

        return (
            <Link
                href={href}
                className={cn(
                    'flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors',
                    active
                        ? 'bg-primary/10 font-medium text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
            >
                <Icon className="size-4" />
                {label}
            </Link>
        );
    }

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <aside className="flex w-60 shrink-0 flex-col border-r border-border p-4">
                <Link href={route('home')} className="mb-1 block text-lg font-semibold">
                    myblog
                </Link>
                <Link
                    href={route('home')}
                    className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="size-3.5" />
                    {t('nav.back_to_site')}
                </Link>

                <nav className="flex flex-col gap-1">
                    {mainNav.map((item) => (
                        <NavLink key={item.href} {...item} />
                    ))}
                </nav>

                {auth.user?.is_author && (
                    <>
                        <div className="mt-6 mb-2 px-2.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                            {t('nav.admin')}
                        </div>
                        <nav className="flex flex-col gap-1">
                            {adminNav.map((item) => (
                                <NavLink key={item.href} {...item} />
                            ))}
                        </nav>
                    </>
                )}

                <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                    <span className="truncate text-sm">{auth.user?.name}</span>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive"
                    >
                        <LogOut className="size-3.5" />
                        {t('nav.logout')}
                    </Link>
                </div>
            </aside>

            <main className="flex-1 p-6">{children}</main>

            <Toaster position="top-right" richColors />
        </div>
    );
}
