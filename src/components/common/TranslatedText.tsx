import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface TranslatedTextProps {
  translationKey: string;
  fallback?: string;
  className?: string;
  as?: 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  options?: Record<string, any>;
}

export const TranslatedText: React.FC<TranslatedTextProps> = ({
  translationKey,
  fallback,
  className,
  as: Component = 'span',
  options = {}
}) => {
  const { t } = useTranslation();
  
  const text = t(translationKey, options) || fallback || translationKey;
  
  return (
    <Component className={className}>
      {text}
    </Component>
  );
};

export default TranslatedText;