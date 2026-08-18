
import React from 'react';
import { TrendingUp, Banknote, Building2, GraduationCap } from 'lucide-react';
import MetricCard from '@/components/dashboard/MetricCard';
import ScrollReveal from '@/components/ui/scroll-reveal';
import { useTranslation } from '@/hooks/useTranslation';

interface KeyMetricsProps {
  heroStats: Array<{ value: string; label: string }>;
}

const KeyMetrics = ({ heroStats }: KeyMetricsProps) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 mt-8">
      <ScrollReveal delay={200}>
        <MetricCard
          title={t('metrics.gdpGrowthRate')}
          value="+3.2%"
          description={t('metrics.q1_2025')}
          trend="up"
          trendValue={t('metrics.fromPrevious')}
          icon={<TrendingUp className="h-6 w-6" />}
          color="green"
          additionalInfo={{
            text: t('metrics.gdpGrowthInfo'),
            source: "National Bureau of Statistics, April 2025"
          }}
        />
      </ScrollReveal>

      <ScrollReveal delay={400}>
        <MetricCard
          title={t('metrics.foreignReserves')}
          value="36-Month High"
          description={t('metrics.april2025')}
          trend="up"
          trendValue={t('metrics.increaseIn12Months')}
          icon={<Banknote className="h-6 w-6" />}
          color="gold"
          additionalInfo={{
            text: t('metrics.foreignReservesInfo'),
            source: "Central Bank of Nigeria, April 2025"
          }}
        />
      </ScrollReveal>


      <ScrollReveal delay={600}>
        <MetricCard
          title={t('metrics.infrastructureProjects')}
          value="247"
          description={t('metrics.ongoingProjects')}
          icon={<Building2 className="h-6 w-6" />}
          color="blue"
          additionalInfo={{
            text: t('metrics.infrastructureInfo'),
            source: "Federal Ministry of Works, March 2025"
          }}
        />
      </ScrollReveal>

      <ScrollReveal delay={800}>
        <MetricCard
          title={t('metrics.studentLoanBeneficiaries')}
          value="124,850"
          description={t('metrics.sinceLaunch')}
          icon={<GraduationCap className="h-6 w-6" />}
          color="purple"
          additionalInfo={{
            text: t('metrics.studentLoanInfo'),
            source: "Nigerian Education Loan Fund (NELFUND), April 2025"
          }}
        />
      </ScrollReveal>
    </div>
  );
};

export default KeyMetrics;
