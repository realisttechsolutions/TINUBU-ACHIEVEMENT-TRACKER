import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AIComposer } from '../../components/ai/AIComposer';
import { AIWelcomeHero } from '../../components/ai/AIWelcomeHero';
import { AIRecordCard } from '../../components/ai/AIRecordCard';
import { AIFinancialCard } from '../../components/ai/AIFinancialCard';
import { AIBeneficiaryCard } from '../../components/ai/AIBeneficiaryCard';
import { AIComparisonBlock } from '../../components/ai/AIComparisonBlock';
import { AIEvidencePanel } from '../../components/ai/AIEvidencePanel';
import { AIAnswerCard } from '../../components/ai/AIAnswerCard';
import type { PTATGroundedAnswer, PTATAIRecord } from '../../types/ai.types';

// Mock translation and navigation hooks
vi.mock('@/lib/navigation', () => ({
  Link: ({ to, children, className }: any) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
  useLocation: () => ({ pathname: '/ai' }),
  useNavigate: () => vi.fn(),
}));

describe('PTAT M08C: AI UI Components Test Suite', () => {
  describe('1. AIComposer Component', () => {
    it('renders textarea and submit button', () => {
      render(<AIComposer onSubmit={vi.fn()} isLoading={false} />);
      expect(screen.getByPlaceholderText(/Ask about achievements/i)).toBeDefined();
      expect(screen.getByRole('button', { name: /Submit query to PTAT AI/i })).toBeDefined();
    });

    it('submits on Enter key without Shift', () => {
      const handleSubmit = vi.fn();
      render(<AIComposer onSubmit={handleSubmit} isLoading={false} />);
      const textarea = screen.getByRole('textbox', { name: /Ask PTAT AI a question/i });

      fireEvent.change(textarea, { target: { value: 'What has Tinubu done in Kaduna?' } });
      fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });

      expect(handleSubmit).toHaveBeenCalledWith('What has Tinubu done in Kaduna?');
    });

    it('does not submit on Shift+Enter (allows multiline)', () => {
      const handleSubmit = vi.fn();
      render(<AIComposer onSubmit={handleSubmit} isLoading={false} />);
      const textarea = screen.getByRole('textbox', { name: /Ask PTAT AI a question/i });

      fireEvent.change(textarea, { target: { value: 'First line\nSecond line' } });
      fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });

      expect(handleSubmit).not.toHaveBeenCalled();
    });

    it('disables submit when empty or loading and renders no character counter', () => {
      render(<AIComposer onSubmit={vi.fn()} isLoading={true} />);
      const submitBtn = screen.getByRole('button', { name: /Submit query to PTAT AI/i });
      expect(submitBtn.hasAttribute('disabled')).toBe(true);

      // Verify no visible character counter exists
      expect(screen.queryByText(/\/2000|\/500/i)).toBeNull();
    });
  });

  describe('2. AIWelcomeHero Component (Minimal AI-First Landing)', () => {
    it('renders clean AI greeting and zero predefined question buttons', () => {
      render(<AIWelcomeHero />);

      expect(screen.getByText(/What would you like to know\?/i)).toBeDefined();
      expect(screen.getByText(/PTAT AI • Evidence Intelligence/i)).toBeDefined();
      expect(
        screen.getByText(/Ask anything about achievements, infrastructure projects/i)
      ).toBeDefined();

      // Certify HARD REQUIREMENT: 0 prompt chips or predefined question buttons
      const buttons = screen.queryAllByRole('button');
      expect(buttons.length).toBe(0);
    });
  });

  describe('3. AIRecordCard Component', () => {
    const mockRecord: PTATAIRecord = {
      id: 'rec-001-kaduna',
      externalId: 'EXT-001',
      slug: 'kaduna-solar-plant',
      title: 'Kaduna 50MW Solar Power Installation',
      summary: '50MW solar installation completed in Kaduna State.',
      recordType: 'physical_project',
      workflowStatus: 'PUBLISHED',
      publicationStatus: 'PUBLISHED',
      verificationStatus: 'VERIFIED',
      implementationStatus: 'completed',
      evidenceProfile: 'HIGH',
      riskLevel: 'LOW',
      isPublic: true,
      route: '/records/kaduna-solar-plant',
      sectors: [{ code: 'power_energy', label: 'Power & Energy' }],
      institutions: [{ code: 'rea', name: 'Rural Electrification Agency' }],
      geographies: [{ code: 'NG-KD', name: 'Kaduna', scope: 'STATE_SPECIFIC', role: 'location' }],
      geographicScope: 'STATE_SPECIFIC',
    };

    it('renders record details, type badge, status, and navigation link', () => {
      render(<AIRecordCard record={mockRecord} />);
      expect(screen.getByText('Kaduna 50MW Solar Power Installation')).toBeDefined();
      expect(screen.getByText('Physical Project')).toBeDefined();
      expect(screen.getByText('Completed')).toBeDefined();
      expect(screen.getByText('Power & Energy')).toBeDefined();

      const link = screen.getByText(/Open Record/i).closest('a');
      expect(link?.getAttribute('href')).toBe('/records/kaduna-solar-plant');
    });
  });

  describe('4. AIFinancialCard Component (Public Currency Discipline)', () => {
    const mockFinancial = {
      financialId: 'fin-001',
      recordId: 'rec-001',
      amountExact: '100000000000',
      formattedAmount: '₦100.00B',
      currencyCode: 'NGN',
      financialType: 'commitment',
      financialTypeLabel: 'Financial Commitment',
      reportingPeriod: '2024-2025',
    };

    it('renders Naira-first amount and distinguishes financial commitment from expenditure', () => {
      render(<AIFinancialCard financial={mockFinancial as any} />);
      expect(screen.getByText('₦100.00B')).toBeDefined();
      expect(screen.getByText('NGN')).toBeDefined();
      expect(screen.getByText('Financial Commitment')).toBeDefined();
      expect(screen.getByText(/Period: 2024-2025/i)).toBeDefined();
    });
  });

  describe('5. AIBeneficiaryCard Component (Beneficiary Maturity Discipline)', () => {
    const mockBeneficiary = {
      beneficiaryId: 'ben-001',
      recordId: 'rec-001',
      countValue: 3000000,
      formattedCount: '3,000,000',
      unit: 'youths',
      beneficiaryType: 'youths',
      beneficiaryStage: 'trained',
      beneficiaryStageLabel: 'Trained',
      cumulative: true,
    };

    it('renders beneficiary count and preserves trained maturity note (trained ≠ employed)', () => {
      render(<AIBeneficiaryCard beneficiary={mockBeneficiary as any} />);
      expect(screen.getByText('3,000,000')).toBeDefined();
      expect(screen.getAllByText(/youths/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/Trained \(Capacity Building\)/i)).toBeDefined();
      expect(screen.getByText(/does not indicate final employment/i)).toBeDefined();
      expect(screen.getByText('Cumulative')).toBeDefined();
    });
  });

  describe('6. AIComparisonBlock Component (Symmetrical Bilateral Layout)', () => {
    const mockComparisonRecords: PTATAIRecord[] = [
      {
        id: 'rec-kaduna',
        externalId: 'EXT-KD',
        slug: 'kaduna-solar',
        title: 'Kaduna Solar Power Installation',
        summary: 'Kaduna solar plant',
        recordType: 'physical_project',
        workflowStatus: 'PUBLISHED',
        publicationStatus: 'PUBLISHED',
        verificationStatus: 'VERIFIED',
        implementationStatus: 'completed',
        evidenceProfile: 'HIGH',
        riskLevel: 'LOW',
        isPublic: true,
        route: '/records/kaduna-solar',
        geographies: [{ code: 'NG-KD', name: 'Kaduna', scope: 'STATE_SPECIFIC', role: 'location' }],
        geographicScope: 'STATE_SPECIFIC',
        sectors: [{ code: 'power', label: 'Power & Energy' }],
        institutions: [],
      },
      {
        id: 'rec-kano',
        externalId: 'EXT-KN',
        slug: 'kano-dry-port',
        title: 'Kano Inland Dry Port Upgrades',
        summary: 'Kano dry port',
        recordType: 'physical_project',
        workflowStatus: 'PUBLISHED',
        publicationStatus: 'PUBLISHED',
        verificationStatus: 'VERIFIED',
        implementationStatus: 'ongoing',
        evidenceProfile: 'HIGH',
        riskLevel: 'LOW',
        isPublic: true,
        route: '/records/kano-dry-port',
        geographies: [{ code: 'NG-KN', name: 'Kano', scope: 'STATE_SPECIFIC', role: 'location' }],
        geographicScope: 'STATE_SPECIFIC',
        sectors: [{ code: 'transport', label: 'Transportation' }],
        institutions: [],
      },
    ];

    it('renders bilateral columns for Kaduna and Kano with symmetrical structure', () => {
      render(
        <AIComparisonBlock
          firstTarget="Kaduna"
          secondTarget="Kano"
          records={mockComparisonRecords}
        />
      );

      expect(screen.getByText('Bilateral Evidence Comparison')).toBeDefined();
      expect(screen.getAllByText('Kaduna').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Kano').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Kaduna Solar Power Installation')).toBeDefined();
      expect(screen.getByText('Kano Inland Dry Port Upgrades')).toBeDefined();
    });
  });

  describe('7. AIEvidencePanel Component', () => {
    const mockAnswer: PTATGroundedAnswer = {
      query: 'What has Tinubu done in Kaduna?',
      intent: 'GEOGRAPHIC_QUERY',
      answer: 'Kaduna Solar Power Installation completed in 2025 [1].',
      answerText: 'Kaduna Solar Power Installation completed in 2025 [1].',
      answerability: 'ANSWERABLE',
      isGrounded: true,
      limitations: [],
      confidence: {
        overallScore: 0.9,
        entityMatchScore: 1.0,
        constraintMatchScore: 0.9,
        evidenceCoverageScore: 0.9,
        sourceAuthenticityScore: 1.0,
        geographicPrecisionScore: 1.0,
        temporalPrecisionScore: 1.0,
        confidenceTier: 'HIGH',
        explanation: 'Validated against primary records.',
      },
      citations: [
        {
          claimId: 'claim-001',
          sourceId: 'src-001',
          recordSlug: 'kaduna-solar',
          sourceTitle: 'REA Official Commissioning Report 2025',
          publisher: 'Rural Electrification Agency',
          url: 'https://rea.gov.ng/report',
          sourceLevel: 'LEVEL_1',
          isValidated: true,
        },
      ],
      recordLinks: [
        {
          slug: 'kaduna-solar',
          title: 'Kaduna 50MW Solar Installation',
          recordType: 'physical_project',
          route: '/records/kaduna-solar',
          sectors: ['Power & Energy'],
          stateNames: ['Kaduna'],
        },
      ],
      citationValidation: {
        valid: true,
        totalCitations: 1,
        validCitations: 1,
        rejectedCitations: 0,
        rejectionReasons: [],
        validatedCitations: [],
      },
      modelMetadata: {
        model: 'gemini-3.6-flash',
        location: 'global',
        totalLatencyMs: 900,
        retrievalLatencyMs: 30,
        modelLatencyMs: 870,
        inputTokens: 1000,
        outputTokens: 50,
        totalTokens: 1050,
        retriesAttempted: 0,
      },
    };

    it('renders sources tab with Level 1 Primary Gazette badge and verified URL', () => {
      render(
        <AIEvidencePanel
          answer={mockAnswer}
          isOpen={true}
          onClose={vi.fn()}
        />
      );

      expect(screen.getByText('Evidence & Grounding Rail')).toBeDefined();
      expect(screen.getByText(/REA Official Commissioning Report 2025/i)).toBeDefined();
      expect(screen.getByText(/Level 1: Official Primary Gazette \/ MDA/i)).toBeDefined();
      expect(screen.getByText(/Publisher: Rural Electrification Agency/i)).toBeDefined();

      const sourceLink = screen.getByText('Open Source').closest('a');
      expect(sourceLink?.getAttribute('href')).toBe('https://rea.gov.ng/report');
    });
  });

  describe('8. AIAnswerCard Component (Citation Interaction & Grounding Badge)', () => {
    const mockAnswer: PTATGroundedAnswer = {
      query: 'What has Tinubu done in Kaduna?',
      intent: 'GEOGRAPHIC_QUERY',
      answer: 'In Kaduna State, President Tinubu commissioned the 50MW solar plant [1].',
      answerText: 'In Kaduna State, President Tinubu commissioned the 50MW solar plant [1].',
      answerability: 'ANSWERABLE',
      isGrounded: true,
      limitations: [],
      confidence: {
        overallScore: 0.9,
        entityMatchScore: 1.0,
        constraintMatchScore: 0.9,
        evidenceCoverageScore: 0.9,
        sourceAuthenticityScore: 1.0,
        geographicPrecisionScore: 1.0,
        temporalPrecisionScore: 1.0,
        confidenceTier: 'HIGH',
        explanation: 'Validated.',
      },
      citations: [
        {
          claimId: 'claim-001',
          sourceId: 'src-001',
          recordSlug: 'kaduna-solar',
          sourceTitle: 'REA Commissioning Report 2025',
          publisher: 'Rural Electrification Agency',
          url: 'https://rea.gov.ng/report',
          sourceLevel: 'LEVEL_1',
          isValidated: true,
        },
      ],
      recordLinks: [
        {
          slug: 'kaduna-solar',
          title: 'Kaduna 50MW Solar Installation',
          recordType: 'physical_project',
          route: '/records/kaduna-solar',
          sectors: ['Power & Energy'],
          stateNames: ['Kaduna'],
        },
      ],
      citationValidation: {
        valid: true,
        totalCitations: 1,
        validCitations: 1,
        rejectedCitations: 0,
        rejectionReasons: [],
        validatedCitations: [],
      },
      modelMetadata: {
        model: 'gemini-3.6-flash',
        location: 'global',
        totalLatencyMs: 900,
        retrievalLatencyMs: 30,
        modelLatencyMs: 870,
        inputTokens: 1000,
        outputTokens: 50,
        totalTokens: 1050,
        retriesAttempted: 0,
      },
    };

    it('renders Trust Strip and interactive inline citation chip [1]', () => {
      const handleOpenEvidence = vi.fn();
      render(
        <AIAnswerCard
          answer={mockAnswer}
          onOpenEvidencePanel={handleOpenEvidence}
        />
      );

      expect(screen.getByText('Grounded in PTAT Public Evidence')).toBeDefined();
      expect(screen.getByText('High Evidence Grounding')).toBeDefined();

      const citationBtn = screen.getByRole('button', { name: /Citation \[1\]/i });
      expect(citationBtn).toBeDefined();

      fireEvent.click(citationBtn);
      expect(handleOpenEvidence).toHaveBeenCalledWith(1);
    });

    it('renders qualification notice when answerability is INSUFFICIENT_EVIDENCE', () => {
      const insufficientAnswer: PTATGroundedAnswer = {
        ...mockAnswer,
        answerability: 'INSUFFICIENT_EVIDENCE',
        answer: 'PTAT does not currently contain verified records for this question.',
        answerText: 'PTAT does not currently contain verified records for this question.',
        citations: [],
        recordLinks: [],
      };

      render(
        <AIAnswerCard
          answer={insufficientAnswer}
          onOpenEvidencePanel={vi.fn()}
        />
      );

      expect(screen.getByText('Insufficient Evidence in Public Catalog')).toBeDefined();
      expect(screen.getByText(/PTAT does not currently contain verified records/i)).toBeDefined();
    });
  });
});
