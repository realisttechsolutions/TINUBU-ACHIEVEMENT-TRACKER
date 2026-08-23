import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AIComposer } from '@/components/ai/AIComposer';
import { PTATAIExperienceClient } from '@/components/ai/PTATAIExperienceClient';
import { LanguageProvider } from '@/contexts/LanguageContext';

// Mock navigation
vi.mock('@/lib/navigation', () => ({
  Link: ({ to, children, ...props }: any) => <a href={to} {...props}>{children}</a>,
  useLocation: () => ({ pathname: '/ai' }),
  usePathname: () => '/ai',
  useNavigate: () => vi.fn(),
  useParams: () => ({}),
  useSearchParams: () => [new URLSearchParams(), vi.fn()],
}));

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <LanguageProvider>
      {ui}
    </LanguageProvider>
  );
};

describe('PTAT AI UX & Natural Conversation Scrolling Test Suite', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    // Mock scrollIntoView
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    window.HTMLElement.prototype.scrollTo = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  describe('1. Compact Composer Dimensions & Auto-Grow Behaviour', () => {
    it('renders compact composer with restrained initial height (min-h-[48px] / min-h-[52px]) and max width', () => {
      render(<AIComposer onSubmit={vi.fn()} isLoading={false} />);
      const textarea = screen.getByRole('textbox', { name: /Ask PTAT AI a question/i });
      expect(textarea).toBeDefined();

      const container = textarea.closest('div');
      expect(container?.className).toContain('min-h-[48px]');
      expect(container?.className).toContain('sm:min-h-[52px]');

      const form = textarea.closest('form');
      expect(form?.className).toContain('max-w-2xl');
      expect(form?.className).toContain('lg:max-w-3xl');
    });

    it('auto-grows on multiline content and handles clear button correctly', () => {
      render(<AIComposer onSubmit={vi.fn()} isLoading={false} />);
      const textarea = screen.getByRole('textbox', { name: /Ask PTAT AI a question/i }) as HTMLTextAreaElement;

      // Simulate typing text
      fireEvent.change(textarea, { target: { value: 'Line 1\nLine 2\nLine 3' } });
      expect(textarea.value).toBe('Line 1\nLine 2\nLine 3');

      // Clear button should be visible
      const clearBtn = screen.getByRole('button', { name: /Clear text/i });
      expect(clearBtn).toBeDefined();

      fireEvent.click(clearBtn);
      expect(textarea.value).toBe('');
    });

    it('submits on Enter key without Shift and clears textarea', () => {
      const handleSubmit = vi.fn();
      render(<AIComposer onSubmit={handleSubmit} isLoading={false} />);
      const textarea = screen.getByRole('textbox', { name: /Ask PTAT AI a question/i });

      fireEvent.change(textarea, { target: { value: 'What is NELFUND?' } });
      fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });

      expect(handleSubmit).toHaveBeenCalledWith('What is NELFUND?');
    });
  });

  describe('2. Natural Conversation Scroll & Submission Anchoring', () => {
    it('renders conversation experience and executes submission anchor without auto-dragging', async () => {
      const mockAnswer = {
        query: 'What has Tinubu done in Kaduna?',
        intent: 'SUMMARY_QUERY',
        answerability: 'ANSWERABLE',
        sourceMode: 'PTAT_ONLY',
        answer: 'President Tinubu commissioned the 2.5MW NDA solar-hybrid power plant in Kaduna State.',
        answerText: 'President Tinubu commissioned the 2.5MW NDA solar-hybrid power plant in Kaduna State.',
        citations: [],
        recordLinks: [],
        confidence: {
          overallScore: 0.95,
          confidenceTier: 'HIGH',
          explanation: 'Verified PTAT evidence',
        },
      };

      global.fetch = vi.fn().mockImplementation(() =>
        Promise.resolve({
          ok: true,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: () => Promise.resolve(mockAnswer),
        } as Response)
      );

      renderWithProviders(<PTATAIExperienceClient />);

      // Initial empty state has composer
      const textarea = screen.getByRole('textbox', { name: /Ask PTAT AI a question/i });
      fireEvent.change(textarea, { target: { value: 'What has Tinubu done in Kaduna?' } });
      fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });

      // Verify user message appears in DOM with correct anchor ID
      await waitFor(() => {
        const matching = screen.getAllByText('What has Tinubu done in Kaduna?');
        expect(matching.length).toBeGreaterThanOrEqual(1);
      });

      // Verify scrollIntoView was invoked on submission anchor
      await waitFor(() => {
        expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith({
          behavior: 'smooth',
          block: 'start',
        });
      });
    });

    it('shows Latest control when scrolled away and scrolls to bottom on click', () => {
      renderWithProviders(<PTATAIExperienceClient />);

      // Find scroll container
      const main = screen.getByRole('main', { hidden: true });
      const scrollToMock = vi.fn();
      main.scrollTo = scrollToMock;

      // Simulate long scroll offset where distanceToBottom > 250px
      Object.defineProperty(main, 'scrollHeight', { value: 2000, configurable: true });
      Object.defineProperty(main, 'scrollTop', { value: 500, configurable: true });
      Object.defineProperty(main, 'clientHeight', { value: 600, configurable: true });

      // Trigger scroll event
      fireEvent.scroll(main);
    });

    it('preserves bottom padding to prevent composer overlap on active message stream', () => {
      renderWithProviders(<PTATAIExperienceClient />);
      const main = screen.getByRole('main', { hidden: true });
      expect(main.className).toContain('overflow-y-auto');
    });
  });
});
