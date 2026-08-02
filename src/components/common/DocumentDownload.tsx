
import React from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  FileCheck,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface Document {
  title: string;
  description: string;
  fileUrl: string;
  fileType: 'pdf' | 'excel' | 'word' | 'csv';
  fileSize: string;
  lastUpdated: string;
  category?: string;
  pageCount?: number;
}

interface DocumentDownloadProps {
  documents: Document[];
  title?: string;
  compact?: boolean;
  className?: string;
}

const DocumentDownload = ({ 
  documents, 
  title, 
  compact = false,
  className 
}: DocumentDownloadProps) => {
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <div className="bg-red-100 p-2 rounded-lg"><FileText className="h-5 w-5 text-red-500" /></div>;
      case 'excel':
        return <div className="bg-green-100 p-2 rounded-lg"><FileText className="h-5 w-5 text-green-500" /></div>;
      case 'word':
        return <div className="bg-blue-100 p-2 rounded-lg"><FileText className="h-5 w-5 text-blue-500" /></div>;
      case 'csv':
        return <div className="bg-yellow-100 p-2 rounded-lg"><FileText className="h-5 w-5 text-yellow-500" /></div>;
      default:
        return <div className="bg-gray-100 p-2 rounded-lg"><FileText className="h-5 w-5 text-gray-500" /></div>;
    }
  };

  return (
    <div className={className}>
      {title && <h3 className="text-xl font-semibold mb-4">{title}</h3>}
      
      <div className={`grid gap-4 ${compact ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {documents.map((doc, index) => (
          <Card key={index} className="overflow-hidden transition-shadow hover:shadow-md">
            <CardContent className={`${compact ? 'p-3' : 'p-5'}`}>
              <div className="flex gap-3">
                {getFileIcon(doc.fileType)}
                <div className="flex-1">
                  <h4 className="font-medium text-brand-dark-blue">{doc.title}</h4>
                  {!compact && <p className="text-sm text-gray-600 mt-1">{doc.description}</p>}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      <span>Updated: {doc.lastUpdated}</span>
                    </div>
                    <div className="flex items-center">
                      <FileCheck className="h-3.5 w-3.5 mr-1" />
                      <span>Size: {doc.fileSize}</span>
                    </div>
                    {doc.pageCount && (
                      <div className="flex items-center">
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        <span>{doc.pageCount} pages</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className={cn(
              "bg-gray-50 border-t",
              compact ? "p-3" : "p-4"
            )}>
              <Button 
                asChild 
                className="w-full bg-brand-blue hover:bg-brand-purple"
                size={compact ? "sm" : "default"}
              >
                <a href={doc.fileUrl} download className="flex items-center justify-center gap-2">
                  <Download className="h-4 w-4" />
                  <span>Download {doc.fileType.toUpperCase()}</span>
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DocumentDownload;
