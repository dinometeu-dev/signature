'use client';

import { ShieldCheck } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { FormEvent, useState, useTransition } from 'react';
import { toast } from 'sonner';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { requestJson } from '@/lib/admin/client';

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/admin';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    startTransition(async () => {
      try {
        await requestJson('/api/admin/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        toast.success('Welcome back.');
        router.push(nextPath);
        router.refresh();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Unable to sign in.';
        setErrorMessage(message);
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(183,225,255,0.6),_transparent_30%),linear-gradient(180deg,_#f8fbff_0%,_#eff4fb_100%)] p-4">
      <Card className="w-full max-w-md rounded-[32px] border-white/70 bg-white/80 shadow-[0_24px_90px_rgba(15,23,42,0.08)] backdrop-blur">
        <CardHeader className="space-y-5 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-slate-950 text-white">
            <ShieldCheck className="size-8" />
          </div>
          <div className="space-y-2">
            <CardTitle className="font-headings text-4xl text-slate-950">
              Admin login
            </CardTitle>
            <CardDescription className="text-base text-slate-500">
              Sign in to manage signature, profile, and works content.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@example.com"
                className="h-12 rounded-2xl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Your admin password"
                className="h-12 rounded-2xl"
                required
              />
            </div>

            {errorMessage ? (
              <Alert variant="destructive" className="rounded-2xl">
                <AlertTitle>Login failed</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            ) : null}

            <Button
              type="submit"
              className="h-12 w-full rounded-2xl"
              disabled={isPending}
            >
              {isPending ? 'Signing in...' : 'Enter admin panel'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
