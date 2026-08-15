'use client';

import React, { useEffect, useState, useCallback } from 'react';
import NextLink from 'next/link';
import { 
  usePathname as useNextPathname, 
  useRouter as useNextRouter, 
  useSearchParams as useNextSearchParams, 
  useParams as useNextParams 
} from 'next/navigation';
import { useParams as useRRParams, Navigate as RRNavigate } from 'react-router-dom';

export interface UniversalLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href?: string | { pathname?: string; query?: Record<string, string> };
  to?: string;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
}

export const Link = React.forwardRef<HTMLAnchorElement, UniversalLinkProps>(
  ({ href, to, children, ...props }, ref) => {
    const target = (href || to || '#') as any;
    return (
      <NextLink ref={ref} href={target} {...props}>
        {children}
      </NextLink>
    );
  }
);
Link.displayName = 'Link';

export const NavLink = Link;

export function useLocation() {
  let pathname = '/';
  try {
    pathname = useNextPathname() || '/';
  } catch (e) {
    pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  }

  const [search, setSearch] = useState('');
  const [hash, setHash] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSearch(window.location.search);
      setHash(window.location.hash);
    }
  }, [pathname]);

  return {
    pathname,
    search,
    hash,
    key: 'default',
    state: null
  };
}

export function useNavigate() {
  try {
    const router = useNextRouter();
    return (to: string | number, options?: { replace?: boolean }) => {
      if (typeof to === 'number') {
        if (to === -1 && typeof window !== 'undefined') window.history.back();
        return;
      }
      if (options?.replace) {
        router?.replace?.(to as string);
      } else {
        router?.push?.(to as string);
      }
    };
  } catch (e) {
    return (to: string | number) => {
      if (typeof window !== 'undefined' && typeof to === 'string') {
        window.location.href = to;
      }
    };
  }
}

export function useParams<T extends Record<string, string | string[]> = Record<string, string>>(): T {
  try {
    const rrParams = useRRParams();
    if (rrParams && Object.keys(rrParams).length > 0) {
      return rrParams as T;
    }
  } catch (e) {
    // not in react-router tree
  }

  try {
    const nextParams = useNextParams();
    if (nextParams && Object.keys(nextParams).length > 0) {
      return nextParams as T;
    }
  } catch (e) {
    // not in next app router
  }

  if (typeof window !== 'undefined') {
    const parts = window.location.pathname.split('/').filter(Boolean);
    if (parts.length >= 2) {
      return { slug: parts[parts.length - 1] } as unknown as T;
    }
  }

  return {} as T;
}

export function useSearchParams() {
  let nextParams: URLSearchParams | null = null;
  try {
    nextParams = useNextSearchParams();
  } catch (e) {
    nextParams = null;
  }

  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = nextParams || new URLSearchParams();

  const setSearchParams = useCallback(
    (
      newParams: Record<string, any> | ((prev: URLSearchParams) => URLSearchParams),
      options?: { replace?: boolean }
    ) => {
      const current = new URLSearchParams(nextParams ? Array.from(nextParams.entries()) : []);
      if (typeof newParams === 'function') {
        const updated = newParams(current);
        const query = updated.toString() ? `?${updated.toString()}` : '';
        navigate(`${location.pathname}${query}`, options);
      } else {
        Object.entries(newParams).forEach(([k, v]) => {
          if (v === null || v === undefined || v === '') {
            current.delete(k);
          } else {
            current.set(k, String(v));
          }
        });
        const query = current.toString() ? `?${current.toString()}` : '';
        navigate(`${location.pathname}${query}`, options);
      }
    },
    [nextParams, navigate, location.pathname]
  );

  // Return a tuple that also works as a callable/inspectable searchParams object
  const tuple = [searchParams, setSearchParams] as any;
  tuple.get = (key: string) => searchParams.get(key);
  tuple.getAll = (key: string) => searchParams.getAll(key);
  tuple.has = (key: string) => searchParams.has(key);
  tuple.toString = () => searchParams.toString();
  return tuple as [URLSearchParams, typeof setSearchParams];
}

export function Navigate({ to, replace = true }: { to: string; replace?: boolean }) {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to, { replace });
  }, [navigate, to, replace]);

  try {
    return <RRNavigate to={to} replace={replace} />;
  } catch (e) {
    return null;
  }
}

export { useNextPathname as usePathname, useNextRouter as useRouter };
export default Link;