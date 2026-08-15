'use client';


import React from "react";
import { Link } from "@/lib/navigation";
import { Facebook, Twitter, Instagram, Mail, ArrowUpRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useTranslation } from "@/hooks/useTranslation";

const Footer = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast({
        title: t('footer.invalidEmail'),
        description: t('footer.invalidEmailDesc'),
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: t('footer.subscribeSuccess'),
      description: t('footer.subscribeSuccessDesc'),
      variant: "default"
    });
    setEmail("");
  };

  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2.5 group transition-transform duration-300 hover:scale-[1.02]">
              <div className="bg-gov-navy text-white font-display font-extrabold text-sm px-2 py-1 rounded shadow-sm border border-gov-gold/40">
                <span className="text-gov-gold">TAT</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg text-gov-navy group-hover:text-gov-emerald transition-colors leading-tight">
                  Tinubu Achievement Tracker
                </span>
                <span className="text-[10px] text-gov-slate uppercase tracking-wider font-medium">
                  Renewed Hope Progress Platform
                </span>
              </div>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              An evidence-driven national progress platform documenting, explaining, and visualising the achievements, policies, reforms, and measurable outcomes of President Bola Ahmed Tinubu's administration.
            </p>
            <div className="flex space-x-4 text-gray-500">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-purple transition-colors hover:scale-125 transform duration-300">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-purple transition-colors hover:scale-125 transform duration-300">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-purple transition-colors hover:scale-125 transform duration-300">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="mailto:info@tinubuprogresswatch.org" className="hover:text-brand-purple transition-colors hover:scale-125 transform duration-300">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display font-semibold text-gray-900 mb-4">{t('footer.focusAreas')}</h3>
            <ul className="space-y-3 text-gray-600">
              <li>
                <Link to="/economic-reforms" className="hover:text-brand-purple transition-colors flex items-center group">
                  <ChevronRight className="h-4 w-4 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>{t('footer.economicReforms')}</span>
                </Link>
              </li>
              <li>
                <Link to="/infrastructure" className="hover:text-brand-purple transition-colors flex items-center group">
                  <ChevronRight className="h-4 w-4 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>{t('footer.infrastructure')}</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-brand-purple transition-colors flex items-center group">
                  <ChevronRight className="h-4 w-4 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>{t('footer.performanceDashboard')}</span>
                </Link>
              </li>
              <li>
                <Link to="/social-services" className="hover:text-brand-purple transition-colors flex items-center group">
                  <ChevronRight className="h-4 w-4 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>{t('footer.socialServices')}</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-gray-900 mb-4">{t('footer.resources')}</h3>
            <ul className="space-y-3 text-gray-600">
              <li>
                <Link to="/data-sources" className="hover:text-brand-purple transition-colors flex items-center group">
                  <ChevronRight className="h-4 w-4 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>{t('footer.dataSources')}</span>
                </Link>
              </li>
              <li>
                <Link to="/data-sources" className="hover:text-brand-purple transition-colors flex items-center group">
                  <ChevronRight className="h-4 w-4 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>{t('footer.pressReleases')}</span>
                </Link>
              </li>
              <li>
                <Link to="/economic-reforms" className="hover:text-brand-purple transition-colors flex items-center group">
                  <ChevronRight className="h-4 w-4 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>{t('footer.updates')}</span>
                </Link>
              </li>
              <li>
                <Link to="/data-sources" className="hover:text-brand-purple transition-colors flex items-center group">
                  <ChevronRight className="h-4 w-4 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>{t('footer.reports')}</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-gray-900 mb-4">{t('footer.subscribe')}</h3>
            <p className="text-sm text-gray-600 mb-4">
              {t('footer.subscribeDescription')}
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('footer.emailPlaceholder')}
                  className="rounded-l-md border border-gray-300 px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
                <button 
                  type="submit"
                  className="bg-brand-blue hover:bg-brand-purple text-white px-4 rounded-r-md transition-colors flex items-center"
                >
                  <span>{t('footer.subscribe')}</span>
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500">{t('footer.privacyNotice')}</p>
            </form>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link 
                to="/data-sources"
                className="inline-flex items-center text-sm text-brand-blue hover:text-brand-purple transition-colors"
              >
                {t('footer.dataProtection')}
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between text-gray-500 text-sm">
          <p>Â© {new Date().getFullYear()} {t('footer.copyright')}</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/data-sources" className="hover:text-brand-purple transition-colors">{t('footer.privacyPolicy')}</Link>
            <Link to="/data-sources" className="hover:text-brand-purple transition-colors">{t('footer.termsOfService')}</Link>
            <Link to="/data-sources" className="hover:text-brand-purple transition-colors">{t('footer.contactUs')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
