import React, { useState, useEffect } from 'react';
import { EmailElement, ApiColumn } from '../types';
import { replaceColumnPlaceholders, generateEmailHTML } from '../utils/helpers';
import { 
  Monitor, 
  Smartphone, 
  Code, 
  Download,
  RefreshCw,
  Eye
} from 'lucide-react';

interface EmailPreviewProps {
  elements: EmailElement[];
  subject: string;
  previewText?: string;
  availableColumns: ApiColumn[];
}

export const EmailPreview: React.FC<EmailPreviewProps> = ({
  elements,
  subject,
  previewText,
  availableColumns
}) => {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile' | 'code'>('desktop');
  const [isLoading, setIsLoading] = useState(false);
  const [htmlCode, setHtmlCode] = useState('');

  useEffect(() => {
    generateHTML();
  }, [elements, subject, previewText]);

  const generateHTML = async () => {
    setIsLoading(true);
    try {
      // Process elements with column data
      const processedElements = await Promise.all(
        elements.map(async (element) => {
          if (element.type === 'column' && element.columnId) {
            const content = replaceColumnPlaceholders(
              element.content,
              element.columnId,
              availableColumns
            );
            return { ...element, content };
          }
          return element;
        })
      );

      const html = generateEmailHTML(processedElements, subject, previewText);
      setHtmlCode(html);
    } catch (error) {
      console.error('Error generating HTML:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderElement = (element: EmailElement) => {
    const styles = element.styles;
    const baseStyle: React.CSSProperties = {
      fontSize: styles.fontSize,
      fontWeight: styles.fontWeight,
      color: styles.color,
      backgroundColor: styles.backgroundColor,
      textAlign: styles.textAlign,
      padding: styles.padding,
      margin: styles.margin,
      borderRadius: styles.borderRadius,
      border: styles.border,
      width: styles.width,
      height: styles.height,
    };

    const displayContent = element.type === 'column' && element.columnId
      ? replaceColumnPlaceholders(element.content, element.columnId, availableColumns)
      : element.content;

    switch (element.type) {
      case 'text':
        return (
          <p key={element.id} style={baseStyle}>
            {displayContent || 'Sample text content'}
          </p>
        );

      case 'heading':
        return (
          <h2 key={element.id} style={baseStyle}>
            {displayContent || 'Sample Heading'}
          </h2>
        );

      case 'button':
        return (
          <div key={element.id} style={{ textAlign: styles.textAlign || 'center' }}>
            <a
              href="#"
              style={{
                ...baseStyle,
                display: 'inline-block',
                textDecoration: 'none'
              }}
            >
              {displayContent || 'Click me'}
            </a>
          </div>
        );

      case 'image':
        return (
          <img
            key={element.id}
            src={element.content || 'https://via.placeholder.com/600x300'}
            alt="Email content"
            style={baseStyle}
          />
        );

      case 'spacer':
        return (
          <div
            key={element.id}
            style={{
              ...baseStyle,
              backgroundColor: 'transparent',
              minHeight: styles.height || '20px'
            }}
          />
        );

      case 'column':
        return (
          <p key={element.id} style={baseStyle}>
            {displayContent}
          </p>
        );

      default:
        return null;
    }
  };

  const downloadHTML = () => {
    const blob = new Blob([htmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${subject || 'email-template'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getPreviewWidth = () => {
    switch (viewMode) {
      case 'mobile':
        return 'max-w-sm';
      case 'code':
        return 'max-w-full';
      default:
        return 'max-w-2xl';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-100">
      {/* Preview Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Email Preview</h3>
            {isLoading && <RefreshCw className="w-4 h-4 text-gray-400 animate-spin" />}
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggles */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('desktop')}
                className={`
                  px-3 py-1.5 rounded text-sm font-medium transition-colors
                  ${viewMode === 'desktop' 
                    ? 'bg-white text-gray-900 shadow' 
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={`
                  px-3 py-1.5 rounded text-sm font-medium transition-colors
                  ${viewMode === 'mobile' 
                    ? 'bg-white text-gray-900 shadow' 
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                <Smartphone className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('code')}
                className={`
                  px-3 py-1.5 rounded text-sm font-medium transition-colors
                  ${viewMode === 'code' 
                    ? 'bg-white text-gray-900 shadow' 
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                <Code className="w-4 h-4" />
              </button>
            </div>

            {/* Download Button */}
            <button
              onClick={downloadHTML}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Export HTML</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {viewMode === 'code' ? (
          /* Code View */
          <div className="bg-gray-900 rounded-lg p-4 text-sm">
            <pre className="text-green-400 font-mono whitespace-pre-wrap overflow-x-auto">
              {htmlCode}
            </pre>
          </div>
        ) : (
          /* Visual Preview */
          <div className="flex justify-center">
            <div className={`${getPreviewWidth()} mx-auto`}>
              {/* Email Subject and Preview Text */}
              {(subject || previewText) && (
                <div className="bg-gray-50 border border-gray-200 rounded-t-lg p-4 space-y-2">
                  {subject && (
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Subject
                      </span>
                      <div className="font-semibold text-gray-900">{subject}</div>
                    </div>
                  )}
                  {previewText && (
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Preview Text
                      </span>
                      <div className="text-sm text-gray-600">{previewText}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Email Body */}
              <div className="bg-white shadow-lg rounded-b-lg min-h-96">
                <div className="p-6">
                  {elements.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Eye className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <div className="text-lg font-medium mb-2">No content to preview</div>
                      <div className="text-sm">Add elements to see the email preview</div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {elements.map(renderElement)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preview Footer */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span>Elements: {elements.length}</span>
            <span>
              Dynamic columns: {elements.filter(el => el.type === 'column').length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>View:</span>
            <span className="font-medium capitalize">{viewMode}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailPreview;