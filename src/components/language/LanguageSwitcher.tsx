
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/hooks/useTranslation';

const LanguageSwitcher = () => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, isLoading, availableLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguageOption = availableLanguages.find(lang => lang.code === currentLanguage);

  const nigerianLanguages = availableLanguages.filter(lang => lang.region === 'nigeria');
  const globalLanguages = availableLanguages.filter(lang => lang.region === 'global');

  const handleLanguageChange = async (code: string) => {
    await changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline"
            className="rounded-full flex items-center gap-2 bg-white/95 backdrop-blur-sm shadow-md border-gray-200 hover:bg-gray-50 transition-all"
            size="sm"
          >
            <Globe className="h-4 w-4 text-brand-blue" />
            <span className="text-sm font-medium">
              {currentLanguageOption?.nativeName || 'English'}
            </span>
            <ChevronUp 
              className={`h-3 w-3 transition-transform duration-200 ${isOpen ? '' : 'rotate-180'}`} 
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[280px] p-0 bg-white/95 backdrop-blur-sm shadow-lg border border-gray-200 animate-fade-in"
          side="top"
          sideOffset={10}
        >
          <div className="p-3 border-b">
            <h3 className="font-medium text-sm text-gray-700">{t('language.switchLanguage')}</h3>
            <p className="text-xs text-gray-500">Choose your preferred language</p>
          </div>
          <Tabs defaultValue="nigeria" className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="nigeria">{t('language.nigerian')}</TabsTrigger>
              <TabsTrigger value="global">{t('language.global')}</TabsTrigger>
            </TabsList>
            <TabsContent value="nigeria" className="max-h-[200px] overflow-auto p-2">
              <div className="grid grid-cols-1 gap-1">
                {nigerianLanguages.map((lang) => (
                  <Button
                    key={lang.code}
                    variant="ghost"
                    size="sm"
                    disabled={isLoading}
                    className={`justify-start px-3 py-2 h-auto ${
                      currentLanguage === lang.code ? 'bg-brand-blue/10 text-brand-blue font-medium' : ''
                    }`}
                    onClick={() => handleLanguageChange(lang.code)}
                  >
                    <span>{lang.nativeName}</span>
                    <span className="ml-2 text-xs text-gray-500">({lang.name})</span>
                  </Button>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="global" className="max-h-[200px] overflow-auto p-2">
              <div className="grid grid-cols-1 gap-1">
                {globalLanguages.map((lang) => (
                  <Button
                    key={lang.code}
                    variant="ghost"
                    size="sm"
                    disabled={isLoading}
                    className={`justify-start px-3 py-2 h-auto ${
                      currentLanguage === lang.code ? 'bg-brand-blue/10 text-brand-blue font-medium' : ''
                    }`}
                    onClick={() => handleLanguageChange(lang.code)}
                  >
                    <span>{lang.nativeName}</span>
                    <span className="ml-2 text-xs text-gray-500">({lang.name})</span>
                  </Button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          <Separator />
          <div className="p-2 text-xs text-center text-gray-500">
            {isLoading ? t('language.switching') : t('language.poweredBy')}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default LanguageSwitcher;
