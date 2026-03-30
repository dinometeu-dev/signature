'use client';

import { LayoutDashboard, LogOut, Sparkles, UserRound, Workflow } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { PropsWithChildren, useTransition } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { requestJson } from '@/lib/admin/client';
import { cn } from '@/lib/utils';

type NavigationItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: Array<{
    href: string;
    label: string;
    section: 'intro' | 'experience' | 'technology';
  }>;
};

const navigationItems: NavigationItem[] = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/admin/signature',
    label: 'Signature',
    icon: Sparkles,
  },
  {
    href: '/admin/profile',
    label: 'Profile',
    icon: UserRound,
    children: [
      {
        href: '/admin/profile?section=intro',
        label: 'Intro',
        section: 'intro',
      },
      {
        href: '/admin/profile?section=experience',
        label: 'Experience',
        section: 'experience',
      },
      {
        href: '/admin/profile?section=technology',
        label: 'Technology',
        section: 'technology',
      },
    ],
  },
  {
    href: '/admin/works',
    label: 'Works',
    icon: Workflow,
  },
];

export function AdminShell({
  children,
  userEmail,
}: PropsWithChildren<{ userEmail: string }>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const currentProfileSection = searchParams.get('section') || 'intro';

  const currentItem =
    navigationItems.find((item) =>
      item.href === '/admin' ? pathname === item.href : pathname.startsWith(item.href)
    ) ?? navigationItems[0];

  const handleLogout = () => {
    startTransition(async () => {
      try {
        await requestJson('/api/admin/auth/logout', {
          method: 'POST',
        });
        toast.success('Session closed.');
        router.push('/admin/login');
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Failed to log out.'
        );
      }
    });
  };

  return (
    <div className="h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(187,226,255,0.6),_transparent_35%),linear-gradient(180deg,_#f8fbff_0%,_#eef4fb_100%)]">
      <div className="mx-auto flex h-full max-w-[1600px] gap-6 p-4 md:p-6">
        <aside className="hidden h-full w-72 shrink-0 overflow-hidden rounded-[28px] border border-white/60 bg-white/70 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur xl:flex xl:flex-col">
          <div className="space-y-3">
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              Admin panel
            </Badge>
            <div>
              <p className="font-headings text-3xl text-slate-950">Signature CMS</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Manage the portfolio content without touching the animated
                presentation layer.
              </p>
            </div>
          </div>

          <Separator className="my-5" />

          <nav className="flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin'
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

              return (
                <div key={item.href} className="space-y-2">
                  <Link
                    href={item.children?.[0]?.href ?? item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition',
                      isActive
                        ? 'bg-slate-950 text-white shadow-lg'
                        : 'hover:bg-white hover:text-slate-950'
                    )}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </Link>

                  {item.children && isActive ? (
                    <div className="space-y-1 pl-4">
                      {item.children.map((child) => {
                        const isChildActive =
                          pathname.startsWith('/admin/profile') &&
                          currentProfileSection === child.section;

                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              'flex rounded-xl px-4 py-2 text-sm transition',
                              isChildActive
                                ? 'bg-slate-200/80 font-medium text-slate-950'
                                : 'text-slate-500 hover:bg-white hover:text-slate-950'
                            )}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>

          <div className="rounded-3xl border border-white/60 bg-white/80 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
              Signed in as
            </p>
            <p className="mt-2 text-sm font-medium text-slate-900">{userEmail}</p>
            <Button
              variant="outline"
              className="mt-4 w-full justify-between rounded-2xl"
              onClick={handleLogout}
              disabled={isPending}
            >
              Log out
              <LogOut className="size-4" />
            </Button>
          </div>
        </aside>

        <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-[32px] border border-white/60 bg-white/70 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
          <header className="shrink-0 flex flex-col gap-4 border-b border-slate-200/80 px-5 py-5 md:px-8 md:py-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                  Content management
                </p>
                <h1 className="mt-2 font-headings text-3xl text-slate-950">
                  {currentItem.label}
                </h1>
              </div>

              <div className="xl:hidden">
                <Button
                  variant="outline"
                  className="rounded-2xl"
                  onClick={handleLogout}
                  disabled={isPending}
                >
                  <LogOut className="mr-2 size-4" />
                  Log out
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 xl:hidden">
              {navigationItems.map((item) => {
                const isActive =
                  item.href === '/admin'
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

                return (
                  <React.Fragment key={item.href}>
                    <Link href={item.children?.[0]?.href ?? item.href}>
                      <Badge
                        variant={isActive ? 'default' : 'secondary'}
                        className="rounded-full px-3 py-1.5"
                      >
                        {item.label}
                      </Badge>
                    </Link>

                    {item.children && isActive
                      ? item.children.map((child) => {
                          const isChildActive =
                            pathname.startsWith('/admin/profile') &&
                            currentProfileSection === child.section;

                          return (
                            <Link key={child.href} href={child.href}>
                              <Badge
                                variant={isChildActive ? 'default' : 'secondary'}
                                className="rounded-full px-3 py-1.5"
                              >
                                {child.label}
                              </Badge>
                            </Link>
                          );
                        })
                      : null}
                  </React.Fragment>
                );
              })}
            </div>
          </header>

          <main className="min-h-0 flex-1 overflow-y-auto px-5 py-6 md:px-8 md:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
