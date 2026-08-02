
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DocumentDownload from '@/components/common/DocumentDownload';
import PDFViewer from '@/components/common/PDFViewer';
import SectionHeader from '@/components/common/SectionHeader';
import { achievementReports, statisticalDatasets } from '@/data/document-resources';
import {
  FileText,
  BarChart3,
  Download,
  Filter,
  Search,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/hooks/useTranslation';

const Downloads = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: t('downloads.categories.all') },
    { value: 'Economy', label: t('downloads.categories.economy') },
    { value: 'Infrastructure', label: t('downloads.categories.infrastructure') },
    { value: 'Social Services', label: t('downloads.categories.socialServices') },
    { value: 'Education', label: t('downloads.categories.education') },
    { value: 'Healthcare', label: t('downloads.categories.healthcare') },
    { value: 'Comprehensive', label: t('downloads.categories.comprehensive') },
  ];

  const filteredReports = achievementReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || report.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredDatasets = statisticalDatasets.filter(dataset => {
    const matchesSearch = dataset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataset.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || dataset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-8 pb-16">
        <div className="container mx-auto px-4">
          <SectionHeader
            title={t('downloads.title')}
            description={t('downloads.description')}
            centered
          />

          <div className="mt-8 mb-10">
            <Card className="border shadow-sm">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder={t('downloads.searchPlaceholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-full">
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-full">
                          <div className="flex items-center">
                            <Filter className="h-4 w-4 mr-2 text-gray-500" />
                            <SelectValue placeholder={t('downloads.filterCategory')} />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('all');
                      }}
                    >
                      {t('downloads.clear')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="reports" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="reports" className="flex items-center justify-center">
                <FileText className="h-4 w-4 mr-2" />
                {t('downloads.reports')}
              </TabsTrigger>
              <TabsTrigger value="datasets" className="flex items-center justify-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                {t('downloads.datasets')}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="reports">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-6 text-brand-dark-blue">{t('downloads.featuredReport')}</h2>
                <PDFViewer
                  title="Renewed Hope Achievements - Full Report 2025"
                  description="This comprehensive report details the key policies, initiatives, and measurable achievements of the Tinubu administration from May 2023 to March 2025 across all sectors."
                  pdfUrl="#" // Replace with actual PDF URL when available
                />
              </div>
              
              <div className="mb-8 mt-12">
                <h2 className="text-2xl font-semibold mb-6 text-brand-dark-blue">{t('downloads.allReports')}</h2>
                {filteredReports.length > 0 ? (
                  <DocumentDownload documents={filteredReports} />
                ) : (
                  <div className="text-center py-12 border border-dashed rounded-lg">
                    <FileText className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium mb-1">{t('downloads.noReports')}</h3>
                    <p className="text-gray-500">{t('downloads.noReportsDesc')}</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="datasets">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-brand-dark-blue">{t('downloads.datasets')}</h2>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    <span>{t('downloads.requestDataset')}</span>
                  </Button>
                </div>
                
                {filteredDatasets.length > 0 ? (
                  <DocumentDownload documents={filteredDatasets} />
                ) : (
                  <div className="text-center py-12 border border-dashed rounded-lg">
                    <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium mb-1">{t('downloads.noDatasets')}</h3>
                    <p className="text-gray-500">{t('downloads.noDatasetsDesc')}</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Downloads;
