import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock window.matchMedia for JSDOM / Vitest tests
if (typeof window !== 'undefined') {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

// Mock ResizeObserver for JSDOM
if (typeof global !== 'undefined') {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// Mock next/navigation
vi.mock("next/navigation", () => {
  return {
    usePathname: () => (typeof window !== 'undefined' ? window.location.pathname : "/"),
    useRouter: () => ({
      push: (url: string) => {
        if (typeof window !== 'undefined') window.location.pathname = url;
      },
      replace: (url: string) => {
        if (typeof window !== 'undefined') window.location.pathname = url;
      },
      prefetch: vi.fn(),
      back: () => typeof window !== 'undefined' && window.history.back(),
      forward: () => typeof window !== 'undefined' && window.history.forward(),
      refresh: vi.fn(),
    }),
    useParams: () => {
      if (typeof window === 'undefined') return {};
      const parts = window.location.pathname.split("/").filter(Boolean);
      return parts.length >= 2 ? { slug: parts[parts.length - 1] } : {};
    },
    useSearchParams: () => new URLSearchParams(typeof window !== 'undefined' ? window.location.search : ""),
    notFound: () => {
      throw new Error("NEXT_NOT_FOUND");
    },
  };
});
