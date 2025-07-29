import React, { useState } from 'react';
import { 
  Save, 
  Eye, 
  EyeOff, 
  FileText, 
  Mail,
  RefreshCw
} from 'lucide-react';

interface TemplateHeaderProps {
  templateName: string;
  onTemplateNameChange: (name: string) => void;
  subject: string;
  onSubjectChange: (subject: string) => void;
  previewText: string;
  onPreviewTextChange: (text: string) => void;
  onSave: () => void;
  onPreview: () => void;
  isLoading: boolean;
  showPreview: boolean;
}

export const TemplateHeader: React.FC<TemplateHeaderProps> = ({
  templateName,
  onTemplateNameChange,
  subject,
  onSubjectChange,
  previewText,
  onPreviewTextChange,
  onSave,
  onPreview,
  isLoading,
  showPreview
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(templateName);

  const handleSaveName = () => {
    onTemplateNameChange(tempName);
    setIsEditingName(false);
  };

  const handleCancelName = () => {
    setTempName(templateName);
    setIsEditingName(false);
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section - Template Info */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Mail className="w-5 h-5 text-blue-600" />
          </div>
          
          <div className="flex-1 min-w-0">
            {/* Template Name */}
            <div className="flex items-center gap-2 mb-1">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveName();
                      if (e.key === 'Escape') handleCancelName();
                    }}
                    className="text-xl font-bold bg-transparent border-b-2 border-blue-300 focus:outline-none focus:border-blue-500"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    className="text-green-600 hover:bg-green-100 p-1 rounded"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCancelName}
                    className="text-gray-500 hover:bg-gray-100 p-1 rounded"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <h1
                  className="text-xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors truncate"
                  onClick={() => setIsEditingName(true)}
                  title="Click to edit template name"
                >
                  {templateName}
                </h1>
              )}
            </div>

            {/* Subject and Preview Text Inputs */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Email subject line..."
                  value={subject}
                  onChange={(e) => onSubjectChange(e.target.value)}
                  className="text-sm text-gray-600 bg-transparent border-none focus:outline-none focus:ring-0 placeholder-gray-400 min-w-0 flex-1"
                />
              </div>
              
              {!showPreview && (
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Eye className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Preview text (optional)..."
                    value={previewText}
                    onChange={(e) => onPreviewTextChange(e.target.value)}
                    className="text-sm text-gray-600 bg-transparent border-none focus:outline-none focus:ring-0 placeholder-gray-400 min-w-0 flex-1"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-3">
          {/* Preview Toggle */}
          <button
            onClick={onPreview}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors
              ${showPreview 
                ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100' 
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            {showPreview ? (
              <>
                <EyeOff className="w-4 h-4" />
                <span className="text-sm font-medium">Exit Preview</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">Preview</span>
              </>
            )}
          </button>

          {/* Save Button */}
          <button
            onClick={onSave}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {isLoading ? 'Saving...' : 'Save Template'}
            </span>
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>✨ Auto-save enabled</span>
            <span>🔗 Dynamic columns supported</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Last saved: Just now</span>
          </div>
        </div>
      </div>
    </div>
  );
};