
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import ScrollReveal from '@/components/ui/scroll-reveal';
import SectionHeader from '@/components/common/SectionHeader';
import { BarChart3, BookOpen, Heart, TrendingUp } from 'lucide-react';
import { educationStats, healthcareStats } from '@/data/statistics';
import { Link } from "@/lib/navigation";

const SocialMetrics = () => {
  const socialMetrics = [
    {
      title: "Student Loan Beneficiaries",
      value: educationStats.studentLoanBeneficiaries.total.toLocaleString(),
      progress: 65,
      icon: <BookOpen className="h-5 w-5 text-brand-blue" />,
      trend: "+38.3% from 2024",
      link: "/social-services#education"
    },
    {
      title: "Digital Literacy Rate",
      value: educationStats.digitalLiteracyRate.current,
      progress: educationStats.digitalLiteracyRate.progress,
      icon: <TrendingUp className="h-5 w-5 text-brand-purple" />,
      trend: "Target: " + educationStats.digitalLiteracyRate.target,
      link: "/social-services#education"
    },
    {
      title: "Healthcare Insurance Coverage",
      value: healthcareStats.healthInsuranceEnrollment.current,
      progress: healthcareStats.healthInsuranceEnrollment.progress,
      icon: <Heart className="h-5 w-5 text-red-500" />,
      trend: healthcareStats.healthInsuranceEnrollment.percentIncrease + " annual increase",
      link: "/social-services#healthcare"
    },
    {
      title: "Vaccine Coverage",
      value: healthcareStats.vaccinesCoverage.current,
      progress: healthcareStats.vaccinesCoverage.progress,
      icon: <BarChart3 className="h-5 w-5 text-brand-gold" />,
      trend: "Target: " + healthcareStats.vaccinesCoverage.target,
      link: "/social-services#healthcare"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-white to-gray-50">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <SectionHeader
            title="Social Development Metrics"
            description="Monitoring progress in healthcare and education initiatives across Nigeria"
            centered
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {socialMetrics.map((metric, index) => (
            <ScrollReveal key={index} delay={index * 150}>
              <Link to={metric.link} className="block h-full">
                <Card className="border hover:shadow-md transition-all duration-300 h-full bg-white hover:bg-gray-50">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="bg-gray-100 p-2 rounded-full">{metric.icon}</div>
                      <span className="text-xs font-medium text-gray-500">{metric.trend}</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">{metric.title}</h3>
                    <div className="text-2xl font-bold text-brand-dark-blue mb-3">{metric.value}</div>
                    <Progress value={metric.progress} className="h-2 bg-gray-100" />
                    <div className="mt-2 text-xs text-right text-gray-500">{metric.progress}% of target</div>
                  </CardContent>
                </Card>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/social-services" className="inline-flex items-center bg-brand-blue hover:bg-brand-purple text-white px-6 py-3 rounded-md transition-colors duration-300 font-medium">
            View Detailed Social Development Data
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SocialMetrics;
