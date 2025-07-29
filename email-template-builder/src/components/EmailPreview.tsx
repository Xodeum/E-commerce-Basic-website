import React, { useState, useEffect } from 'react';
import { EmailTemplate } from '../types';
import { generateEmailHTML } from '../utils/templateUtils';
import { apiService } from '../services/apiService';
import { Eye, Code, Smartphone, Monitor, Download } from 'lucide-react';

interface EmailPreviewProps {
  template: EmailTemplate;
}

type ViewMode = 'preview' | 'code';
type DeviceMode = 'desktop' | 'mobile';

export const EmailPreview: React.FC<EmailPreviewProps> = ({ template }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('preview');
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [htmlContent, setHtmlContent] = useState('');
  const [previewData, setPreviewData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const updatePreview = async () => {
      try {
        setIsLoading(true);
        
        // Get sample data for dynamic content
        const sampleData = await apiService.getSampleData();
        setPreviewData(sampleData);
        
        // Generate HTML with sample data
        const html = generateEmailHTML(template, sampleData);
        setHtmlContent(html);
      } catch (error) {
        console.error('Error updating preview:', error);
        // Fallback to generating HTML without sample data
        const html = generateEmailHTML(template);
        setHtmlContent(html);
      } finally {
        setIsLoading(false);
      }
    };

    updatePreview();
  }, [template]);

  const downloadHTML = () => {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(htmlContent);
      // You could add a toast notification here
      console.log('HTML copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const renderPreview = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Generating preview...</p>
          </div>
        </div>
      );
    }

    if (viewMode === 'code') {
      return (
        <div className="h-full">
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-auto h-full font-mono">
            <code>{htmlContent}</code>
          </pre>
        </div>
      );
    }

    return (
      <div 
        className={`
          bg-white border rounded-lg overflow-hidden transition-all duration-300
          ${deviceMode === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'}
        `}
      >
        <iframe
          srcDoc={htmlContent}
          className={`
            w-full border-none
            ${deviceMode === 'mobile' ? 'h-96' : 'h-[600px]'}
          `}
          title="Email Preview"
          sandbox="allow-same-origin"
        />
      </div>
    );
  };

  const renderDataPreview = () => {
    if (Object.keys(previewData).length === 0) {
      return null;
    }

    return (
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">📊 Preview Data</h4>
        <div className="text-sm space-y-1">
          {Object.entries(previewData).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="font-mono text-blue-700">{`{{${key}}}`}</span>
              <span className="text-blue-600">{String(value)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Email Preview</h2>
              <p className="text-sm text-gray-600">
                Live preview of "{template.name}"
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={downloadHTML}
                className="btn-secondary flex items-center space-x-2"
                title="Download HTML"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
              
              <button
                onClick={copyToClipboard}
                className="btn-secondary"
                title="Copy HTML to clipboard"
              >
                Copy HTML
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* View Mode Toggle */}
            <div className="flex bg-white rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => setViewMode('preview')}
                className={`
                  flex items-center space-x-2 px-3 py-1 rounded text-sm font-medium transition-colors
                  ${viewMode === 'preview' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-800'
                  }
                `}
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>
              <button
                onClick={() => setViewMode('code')}
                className={`
                  flex items-center space-x-2 px-3 py-1 rounded text-sm font-medium transition-colors
                  ${viewMode === 'code' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-800'
                  }
                `}
              >
                <Code className="w-4 h-4" />
                <span>HTML</span>
              </button>
            </div>

            {/* Device Mode Toggle (only for preview) */}
            {viewMode === 'preview' && (
              <div className="flex bg-white rounded-lg border border-gray-200 p-1">
                <button
                  onClick={() => setDeviceMode('desktop')}
                  className={`
                    flex items-center space-x-2 px-3 py-1 rounded text-sm font-medium transition-colors
                    ${deviceMode === 'desktop' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:text-gray-800'
                    }
                  `}
                >
                  <Monitor className="w-4 h-4" />
                  <span>Desktop</span>
                </button>
                <button
                  onClick={() => setDeviceMode('mobile')}
                  className={`
                    flex items-center space-x-2 px-3 py-1 rounded text-sm font-medium transition-colors
                    ${deviceMode === 'mobile' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:text-gray-800'
                    }
                  `}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Mobile</span>
                </button>
              </div>
            )}

            {/* Template Info */}
            <div className="text-sm text-gray-600">
              <span>{template.elements.length} elements</span>
              {template.elements.some(el => el.type === 'dynamic-content') && (
                <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                  Dynamic Content
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Preview Content */}
        <div className="preview-panel min-h-[400px]">
          {renderPreview()}
        </div>

        {/* Data Preview */}
        {viewMode === 'preview' && renderDataPreview()}

        {/* Template Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-medium text-gray-700 mb-2">Template Info</h4>
            <div className="space-y-1 text-gray-600">
              <div>Subject: {template.subject}</div>
              <div>Elements: {template.elements.length}</div>
              <div>Last Updated: {template.updatedAt.toLocaleDateString()}</div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-medium text-gray-700 mb-2">Global Styles</h4>
            <div className="space-y-1 text-gray-600">
              <div>Max Width: {template.globalStyles.maxWidth}</div>
              <div>Font: {template.globalStyles.fontFamily}</div>
              <div>Background: {template.globalStyles.backgroundColor}</div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-medium text-gray-700 mb-2">Element Types</h4>
            <div className="space-y-1 text-gray-600">
              {Array.from(new Set(template.elements.map(el => el.type))).map(type => (
                <div key={type} className="capitalize">
                  {type.replace('-', ' ')}: {template.elements.filter(el => el.type === type).length}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};