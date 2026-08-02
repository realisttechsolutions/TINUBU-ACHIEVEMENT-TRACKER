
import React, { useState } from 'react';
import { File, Download, Maximize2, Minimize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface PDFViewerProps {
  pdfUrl: string;
  title: string;
  description?: string;
  downloadable?: boolean;
}

const PDFViewer = ({ 
  pdfUrl, 
  title, 
  description, 
  downloadable = true 
}: PDFViewerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <Card className={`overflow-hidden border shadow-md transition-all duration-300 ${
      isFullscreen ? 'fixed top-0 left-0 right-0 bottom-0 z-50 rounded-none' : 'rounded-lg'
    }`}>
      <div className="bg-gray-100 border-b p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <File className="h-5 w-5 text-brand-blue" />
          <h3 className="font-medium text-gray-800">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {downloadable && (
            <Button variant="outline" size="sm" asChild className="h-8">
              <a href={pdfUrl} download className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Download</span>
              </a>
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleFullscreen}
            className="h-8"
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      {description && (
        <div className="p-3 bg-gray-50 text-sm text-gray-600 border-b">
          {description}
        </div>
      )}
      
      <div className={`bg-gray-200 ${isFullscreen ? 'h-screen' : 'h-[600px]'}`}>
        <iframe 
          src={`${pdfUrl}#toolbar=0&navpanes=0`} 
          className="w-full h-full"
          title={title}
        />
      </div>
      
      {!isFullscreen && (
        <CardFooter className="flex justify-between items-center p-3 bg-gray-50">
          <Button variant="ghost" size="sm" className="text-gray-600">
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <div className="text-xs text-gray-500">
            <span>Page 1 of 24</span>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-600">
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default PDFViewer;
