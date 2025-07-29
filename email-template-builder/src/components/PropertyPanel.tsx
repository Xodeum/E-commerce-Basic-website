import React from 'react';
import { EmailElement, ElementStyles, ApiColumn } from '../types';
import { 
  Settings, 
  Type, 
  Palette, 
  Layout,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Database
} from 'lucide-react';

interface PropertyPanelProps {
  selectedElement: EmailElement | null;
  onUpdateElement: (elementId: string, updates: Partial<EmailElement>) => void;
  availableColumns: ApiColumn[];
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedElement,
  onUpdateElement,
  availableColumns
}) => {
  if (!selectedElement) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <div className="text-lg font-medium mb-2">No element selected</div>
          <div className="text-sm">Select an element to edit its properties</div>
        </div>
      </div>
    );
  }

  const updateStyle = (styleKey: keyof ElementStyles, value: string) => {
    onUpdateElement(selectedElement.id, {
      styles: {
        ...selectedElement.styles,
        [styleKey]: value
      }
    });
  };

  const updateContent = (content: string) => {
    onUpdateElement(selectedElement.id, { content });
  };

  const updateColumnId = (columnId: string) => {
    const column = availableColumns.find(col => col.id === columnId);
    if (column) {
      onUpdateElement(selectedElement.id, {
        columnId,
        content: `{{${column.name}}}`
      });
    }
  };

  const renderTextProperties = () => (
    <div className="space-y-4">
      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content
        </label>
        <textarea
          value={selectedElement.content}
          onChange={(e) => updateContent(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
        />
      </div>

      {/* Font Size */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Font Size
        </label>
        <input
          type="text"
          value={selectedElement.styles.fontSize || '16px'}
          onChange={(e) => updateStyle('fontSize', e.target.value)}
          placeholder="16px"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Font Weight */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Font Weight
        </label>
        <select
          value={selectedElement.styles.fontWeight || 'normal'}
          onChange={(e) => updateStyle('fontWeight', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="normal">Normal</option>
          <option value="bold">Bold</option>
          <option value="lighter">Lighter</option>
          <option value="bolder">Bolder</option>
        </select>
      </div>

      {/* Text Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Text Color
        </label>
        <div className="flex gap-2">
          <input
            type="color"
            value={selectedElement.styles.color || '#333333'}
            onChange={(e) => updateStyle('color', e.target.value)}
            className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
          />
          <input
            type="text"
            value={selectedElement.styles.color || '#333333'}
            onChange={(e) => updateStyle('color', e.target.value)}
            placeholder="#333333"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Text Alignment */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Text Alignment
        </label>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {[
            { value: 'left', icon: AlignLeft },
            { value: 'center', icon: AlignCenter },
            { value: 'right', icon: AlignRight }
          ].map(({ value, icon: Icon }) => (
            <button
              key={value}
              onClick={() => updateStyle('textAlign', value as any)}
              className={`
                flex-1 p-2 rounded transition-colors
                ${selectedElement.styles.textAlign === value
                  ? 'bg-white text-blue-600 shadow'
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              <Icon className="w-4 h-4 mx-auto" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderButtonProperties = () => (
    <div className="space-y-4">
      {/* Button Text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Button Text
        </label>
        <input
          type="text"
          value={selectedElement.content}
          onChange={(e) => updateContent(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Background Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Background Color
        </label>
        <div className="flex gap-2">
          <input
            type="color"
            value={selectedElement.styles.backgroundColor || '#3b82f6'}
            onChange={(e) => updateStyle('backgroundColor', e.target.value)}
            className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
          />
          <input
            type="text"
            value={selectedElement.styles.backgroundColor || '#3b82f6'}
            onChange={(e) => updateStyle('backgroundColor', e.target.value)}
            placeholder="#3b82f6"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Text Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Text Color
        </label>
        <div className="flex gap-2">
          <input
            type="color"
            value={selectedElement.styles.color || '#ffffff'}
            onChange={(e) => updateStyle('color', e.target.value)}
            className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
          />
          <input
            type="text"
            value={selectedElement.styles.color || '#ffffff'}
            onChange={(e) => updateStyle('color', e.target.value)}
            placeholder="#ffffff"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Padding */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Padding
        </label>
        <input
          type="text"
          value={selectedElement.styles.padding || '12px 24px'}
          onChange={(e) => updateStyle('padding', e.target.value)}
          placeholder="12px 24px"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Border Radius */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Border Radius
        </label>
        <input
          type="text"
          value={selectedElement.styles.borderRadius || '6px'}
          onChange={(e) => updateStyle('borderRadius', e.target.value)}
          placeholder="6px"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  const renderImageProperties = () => (
    <div className="space-y-4">
      {/* Image URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image URL
        </label>
        <input
          type="text"
          value={selectedElement.content}
          onChange={(e) => updateContent(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Width */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Width
        </label>
        <input
          type="text"
          value={selectedElement.styles.width || '100%'}
          onChange={(e) => updateStyle('width', e.target.value)}
          placeholder="100%"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Border Radius */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Border Radius
        </label>
        <input
          type="text"
          value={selectedElement.styles.borderRadius || '0'}
          onChange={(e) => updateStyle('borderRadius', e.target.value)}
          placeholder="0"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  const renderSpacerProperties = () => (
    <div className="space-y-4">
      {/* Height */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Height
        </label>
        <input
          type="text"
          value={selectedElement.styles.height || '20px'}
          onChange={(e) => updateStyle('height', e.target.value)}
          placeholder="20px"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  const renderColumnProperties = () => (
    <div className="space-y-4">
      {/* Column Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Data Column
        </label>
        <select
          value={selectedElement.columnId || ''}
          onChange={(e) => updateColumnId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select a column</option>
          {availableColumns.map((column) => (
            <option key={column.id} value={column.id}>
              {column.name} ({column.type})
            </option>
          ))}
        </select>
      </div>

      {/* Text Styling */}
      {renderTextProperties()}
    </div>
  );

  const renderProperties = () => {
    switch (selectedElement.type) {
      case 'text':
      case 'heading':
        return renderTextProperties();
      case 'button':
        return renderButtonProperties();
      case 'image':
        return renderImageProperties();
      case 'spacer':
        return renderSpacerProperties();
      case 'column':
        return renderColumnProperties();
      default:
        return <div>No properties available</div>;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            {selectedElement.type === 'column' ? (
              <Database className="w-4 h-4 text-gray-600" />
            ) : selectedElement.type === 'text' || selectedElement.type === 'heading' ? (
              <Type className="w-4 h-4 text-gray-600" />
            ) : selectedElement.type === 'button' ? (
              <Layout className="w-4 h-4 text-gray-600" />
            ) : (
              <Palette className="w-4 h-4 text-gray-600" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 capitalize">
              {selectedElement.type} Properties
            </h3>
            <p className="text-sm text-gray-500">
              Element ID: {selectedElement.id.slice(-8)}
            </p>
          </div>
        </div>
      </div>

      {/* Properties */}
      <div className="flex-1 overflow-y-auto p-4">
        {renderProperties()}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500">
          💡 Changes are applied automatically
        </div>
      </div>
    </div>
  );
};