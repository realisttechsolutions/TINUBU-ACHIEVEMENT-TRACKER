
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import ScrollReveal from '@/components/ui/scroll-reveal';
import SectionHeader from '@/components/common/SectionHeader';
import { Link } from 'react-router-dom';
import { educationStats, healthcareStats } from '@/data/statistics';

const SocialDevelopmentStats = () => {
  return (
    <section className="bg-gradient-to-br from-gray-50 to-brand-light-blue/20 py-16">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <SectionHeader 
            title="Social Development Statistics"
            description="Progress metrics in education and healthcare sectors"
            centered
          />
        </ScrollReveal>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <ScrollReveal direction="left">
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-brand-purple to-brand-blue h-1"></div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-center mb-6 text-brand-dark-blue">Education Initiatives</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 rounded-lg bg-purple-50 text-center">
                    <div className="text-2xl font-bold text-brand-purple">
                      {educationStats.studentLoanBeneficiaries.total.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Student Loan Beneficiaries</div>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-50 text-center">
                    <div className="text-2xl font-bold text-brand-blue">
                      {educationStats.schoolsRenovated.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Schools Renovated</div>
                  </div>
                  <div className="p-4 rounded-lg bg-amber-50 text-center">
                    <div className="text-2xl font-bold text-amber-600">
                      {educationStats.teachersRecruited.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Teachers Recruited</div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-sm font-semibold mb-2">Student Loan Beneficiaries by Gender</h4>
                  <div className="bg-gray-200 h-4 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full" 
                      style={{ 
                        width: `${(educationStats.studentLoanBeneficiaries.byGender.male / educationStats.studentLoanBeneficiaries.total) * 100}%`, 
                        float: 'left' 
                      }}
                    ></div>
                    <div className="bg-pink-500 h-full" 
                      style={{ 
                        width: `${(educationStats.studentLoanBeneficiaries.byGender.female / educationStats.studentLoanBeneficiaries.total) * 100}%`, 
                        float: 'left' 
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span>Male: {Math.round((educationStats.studentLoanBeneficiaries.byGender.male / educationStats.studentLoanBeneficiaries.total) * 100)}%</span>
                    <span>Female: {Math.round((educationStats.studentLoanBeneficiaries.byGender.female / educationStats.studentLoanBeneficiaries.total) * 100)}%</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t text-center">
                  <Link to="/social-services" className="inline-flex items-center text-brand-purple hover:text-brand-blue transition-colors">
                    View education initiatives <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
          
          <ScrollReveal direction="right">
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-emerald-400 h-1"></div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-center mb-6 text-brand-dark-blue">Healthcare Progress</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 rounded-lg bg-green-50 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {healthcareStats.primaryHealthcareCentersBuilt.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Primary Healthcare Centers Built</div>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-50 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {healthcareStats.healthcareProfessionalsRecruited.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Healthcare Professionals Recruited</div>
                  </div>
                  <div className="p-4 rounded-lg bg-teal-50 text-center">
                    <div className="text-2xl font-bold text-teal-600">
                      {healthcareStats.hospitalsBedCapacityAdded.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Hospital Beds Added</div>
                  </div>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Vaccine Coverage</span>
                      <span className="text-xs font-semibold text-green-600">
                        {healthcareStats.vaccinesCoverage.current}
                      </span>
                    </div>
                    <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full" style={{ width: '62%' }}></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Target: {healthcareStats.vaccinesCoverage.target}</div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Maternal Mortality Reduction</span>
                      <span className="text-xs font-semibold text-amber-600">In Progress</span>
                    </div>
                    <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full" style={{ width: '35%' }}></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Current: {healthcareStats.maternalMortalityReduction.current}</div>
                    <div className="text-xs text-gray-500">Target: {healthcareStats.maternalMortalityReduction.target}</div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t text-center">
                  <Link to="/social-services" className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors">
                    View healthcare initiatives <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
        
        <div className="mt-10 text-center">
          <Link to="/social-services" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-lg hover:from-brand-purple hover:to-brand-blue transition-colors shadow-lg hover:shadow-xl">
            Explore All Social Services Programs <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SocialDevelopmentStats;
