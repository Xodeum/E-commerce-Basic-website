import React, { useState, useEffect } from 'react';
import { EmailElement, ElementStyles, ApiColumn } from '../types';
import { apiService } from '../services/apiService';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface PropertiesPanelProps {
  selectedElement: EmailElement | null;
  onUpdateElement: (updates: Partial<EmailElement>) => void;
}

interface StyleSection {
  id: string;
  label: string;
  isOpen: boolean;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedElement,
  onUpdateElement,
}) => {
  const [sections, setSections] = useState<StyleSection[]>([
    { id: 'content', label: 'Content', isOpen: true },
    { id: 'typography', label: 'Typography', isOpen: false },
    { id: 'spacing', label: 'Spacing', isOpen: false },
    { id: 'colors', label: 'Colors', isOpen: false },
    { id: 'border', label: 'Border & Size', isOpen: false },
    { id: 'dynamic', label: 'Dynamic Content', isOpen: false },
  ]);

  const [apiColumns, setApiColumns] = useState<ApiColumn[]>([]);

  useEffect(() => {
    const loadApiColumns = async () => {
      try {
        const columns = await apiService.fetchColumns();
        setApiColumns(columns);
      } catch (error) {
        console.error('Failed to load API columns:', error);
      }
    };
    loadApiColumns();
  }, []);

  const toggleSection = (sectionId: string) => {
    setSections(prev =>
      prev.map(section =>
        section.id === sectionId
          ? { ...section, isOpen: !section.isOpen }
          : section
      )
    );
  };

  const updateElementStyles = (styleUpdates: Partial<ElementStyles>) => {
    if (!selectedElement) return;
    onUpdateElement({
      styles: {
        ...selectedElement.styles,
        ...styleUpdates,
      },
    });
  };

  const updateElementProperties = (propertyUpdates: any) => {
    if (!selectedElement) return;
    onUpdateElement({
      properties: {
        ...selectedElement.properties,
        ...propertyUpdates,
      },
    });
  };

  const updateElementContent = (content: string) => {
    if (!selectedElement) return;
    onUpdateElement({ content });
  };

  if (!selectedElement) {
    return (
      <div className="sidebar-panel w-80">
        <div className="text-center text-gray-500 mt-8">
          <div className="mb-4">
            <svg
              className="w-12 h-12 mx-auto text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">No Element Selected</h3>
          <p className="text-sm text-gray-500">
            Click on an element in the canvas to edit its properties
          </p>
        </div>
      </div>
    );
  }

  const renderSection = (section: StyleSection) => {
    const isOpen = section.isOpen;

    const SectionHeader = () => (
      <button
        onClick={() => toggleSection(section.id)}
        className="flex items-center justify-between w-full p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="font-medium text-gray-700">{section.label}</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>
    );

    const SectionContent = () => {
      if (!isOpen) return null;

      switch (section.id) {
        case 'content':
          return (
            <div className="p-3 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                {selectedElement.type === 'image' ? (
                  <input
                    type="url"
                    value={selectedElement.content}
                    onChange={(e) => updateElementContent(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Image URL"
                  />
                ) : (
                  <textarea
                    value={selectedElement.content}
                    onChange={(e) => updateElementContent(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded resize-none"
                    rows={3}
                    placeholder="Enter content..."
                  />
                )}
              </div>

              {selectedElement.type === 'button' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Link URL
                    </label>
                    <input
                      type="url"
                      value={selectedElement.properties.href || ''}
                      onChange={(e) => updateElementProperties({ href: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target
                    </label>
                    <select
                      value={selectedElement.properties.target || '_blank'}
                      onChange={(e) => updateElementProperties({ target: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded"
                    >
                      <option value="_blank">New Window</option>
                      <option value="_self">Same Window</option>
                    </select>
                  </div>
                </>
              )}

              {selectedElement.type === 'image' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alt Text
                  </label>
                  <input
                    type="text"
                    value={selectedElement.properties.alt || ''}
                    onChange={(e) => updateElementProperties({ alt: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Image description"
                  />
                </div>
              )}
            </div>
          );

        case 'typography':
          return (
            <div className="p-3 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Font Family
                </label>
                <select
                  value={selectedElement.styles.fontFamily || 'Arial, sans-serif'}
                  onChange={(e) => updateElementStyles({ fontFamily: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="Georgia, serif">Georgia</option>
                  <option value="'Times New Roman', serif">Times New Roman</option>
                  <option value="'Courier New', monospace">Courier New</option>
                  <option value="Helvetica, sans-serif">Helvetica</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Font Size
                </label>
                <input
                  type="text"
                  value={selectedElement.styles.fontSize || '14px'}
                  onChange={(e) => updateElementStyles({ fontSize: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="14px"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Font Weight
                </label>
                <select
                  value={selectedElement.styles.fontWeight || 'normal'}
                  onChange={(e) => updateElementStyles({ fontWeight: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="normal">Normal</option>
                  <option value="bold">Bold</option>
                  <option value="lighter">Lighter</option>
                  <option value="bolder">Bolder</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Text Align
                </label>
                <select
                  value={selectedElement.styles.textAlign || 'left'}
                  onChange={(e) => updateElementStyles({ textAlign: e.target.value as any })}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                  <option value="justify">Justify</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Line Height
                </label>
                <input
                  type="text"
                  value={selectedElement.styles.lineHeight || '1.4'}
                  onChange={(e) => updateElementStyles({ lineHeight: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="1.4"
                />
              </div>
            </div>
          );

        case 'spacing':
          return (
            <div className="p-3 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Padding
                </label>
                <input
                  type="text"
                  value={selectedElement.styles.padding || '10px'}
                  onChange={(e) => updateElementStyles({ padding: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="10px"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Margin
                </label>
                <input
                  type="text"
                  value={selectedElement.styles.margin || '0'}
                  onChange={(e) => updateElementStyles({ margin: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="0"
                />
              </div>
            </div>
          );

        case 'colors':
          return (
            <div className="p-3 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Text Color
                </label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={selectedElement.styles.color || '#333333'}
                    onChange={(e) => updateElementStyles({ color: e.target.value })}
                    className="w-8 h-8 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    value={selectedElement.styles.color || '#333333'}
                    onChange={(e) => updateElementStyles({ color: e.target.value })}
                    className="flex-1 p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Background Color
                </label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={selectedElement.styles.backgroundColor || '#ffffff'}
                    onChange={(e) => updateElementStyles({ backgroundColor: e.target.value })}
                    className="w-8 h-8 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    value={selectedElement.styles.backgroundColor || '#ffffff'}
                    onChange={(e) => updateElementStyles({ backgroundColor: e.target.value })}
                    className="flex-1 p-2 border border-gray-300 rounded"
                    placeholder="transparent"
                  />
                </div>
              </div>
            </div>
          );

        case 'border':
          return (
            <div className="p-3 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Border
                </label>
                <input
                  type="text"
                  value={selectedElement.styles.border || 'none'}
                  onChange={(e) => updateElementStyles({ border: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="1px solid #ccc"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Border Radius
                </label>
                <input
                  type="text"
                  value={selectedElement.styles.borderRadius || '0'}
                  onChange={(e) => updateElementStyles({ borderRadius: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="4px"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Width
                </label>
                <input
                  type="text"
                  value={selectedElement.styles.width || 'auto'}
                  onChange={(e) => updateElementStyles({ width: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="100%"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height
                </label>
                <input
                  type="text"
                  value={selectedElement.styles.height || 'auto'}
                  onChange={(e) => updateElementStyles({ height: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="auto"
                />
              </div>
            </div>
          );

        case 'dynamic':
          if (selectedElement.type !== 'dynamic-content') {
            return (
              <div className="p-3 text-center text-gray-500">
                Dynamic content settings are only available for Dynamic Content elements.
              </div>
            );
          }

          return (
            <div className="p-3 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Column
                </label>
                <select
                  value={selectedElement.properties.columnId || ''}
                  onChange={(e) => {
                    const column = apiColumns.find(col => col.id === e.target.value);
                    updateElementProperties({ 
                      columnId: e.target.value,
                      apiEndpoint: column?.id 
                    });
                    updateElementContent(`{{${e.target.value}}}`);
                  }}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Select a column</option>
                  {apiColumns.map((column) => (
                    <option key={column.id} value={column.id}>
                      {column.name} ({column.type})
                    </option>
                  ))}
                </select>
              </div>

              {selectedElement.properties.columnId && (
                <div className="p-3 bg-gray-50 rounded">
                  <h4 className="font-medium text-gray-700 mb-2">Preview Data</h4>
                  <p className="text-sm text-gray-600">
                    {apiColumns.find(col => col.id === selectedElement.properties.columnId)?.sampleValue || 'No sample data'}
                  </p>
                </div>
              )}
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <div key={section.id} className="border border-gray-200 rounded-lg mb-2 overflow-hidden">
        <SectionHeader />
        <SectionContent />
      </div>
    );
  };

  return (
    <div className="sidebar-panel w-80">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Properties</h2>
        <p className="text-sm text-gray-600">
          Editing: <span className="font-medium">{selectedElement.type}</span>
        </p>
      </div>

      <div className="space-y-2">
        {sections.map(renderSection)}
      </div>
    </div>
  );
};