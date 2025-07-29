import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { EmailElement, EmailTemplate, ApiColumn } from '../types';
import { ElementToolbox } from './ElementToolbox';
import { SortableEmailElement } from './SortableEmailElement';
import { EmailPreview } from './EmailPreview';
import { PropertyPanel } from './PropertyPanel';
import { TemplateHeader } from './TemplateHeader';
import { ColumnPanel } from './ColumnPanel';
import { generateId } from '../utils/helpers';
import apiService from '../services/apiService';

interface EmailEditorProps {
  template?: EmailTemplate;
  onSave?: (template: EmailTemplate) => void;
}

export const EmailEditor: React.FC<EmailEditorProps> = ({ template, onSave }) => {
  const [elements, setElements] = useState<EmailElement[]>(template?.elements || []);
  const [selectedElement, setSelectedElement] = useState<EmailElement | null>(null);
  const [templateName, setTemplateName] = useState(template?.name || 'Untitled Template');
  const [subject, setSubject] = useState(template?.subject || '');
  const [previewText, setPreviewText] = useState(template?.previewText || '');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [availableColumns, setAvailableColumns] = useState<ApiColumn[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadColumns();
  }, []);

  const loadColumns = async () => {
    try {
      setIsLoading(true);
      const columns = await apiService.getColumns();
      setAvailableColumns(columns);
    } catch (error) {
      console.error('Failed to load columns:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Handle dropping from toolbox
    if (activeId.startsWith('toolbox-')) {
      const elementType = activeId.replace('toolbox-', '') as EmailElement['type'];
      const newElement = createNewElement(elementType);
      
      const overIndex = elements.findIndex(el => el.id === overId);
      const insertIndex = overIndex >= 0 ? overIndex + 1 : elements.length;
      
      const newElements = [...elements];
      newElements.splice(insertIndex, 0, newElement);
      setElements(newElements);
      setSelectedElement(newElement);
      return;
    }

    // Handle reordering existing elements
    if (activeId !== overId) {
      const oldIndex = elements.findIndex(el => el.id === activeId);
      const newIndex = elements.findIndex(el => el.id === overId);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        setElements(arrayMove(elements, oldIndex, newIndex));
      }
    }
  };

  const createNewElement = (type: EmailElement['type']): EmailElement => {
    const defaultContent = {
      text: 'Click to edit text',
      heading: 'Your Heading',
      button: 'Click me',
      image: 'https://via.placeholder.com/600x300',
      spacer: '',
      column: '{{column_placeholder}}'
    };

    const defaultStyles = {
      text: { fontSize: '16px', color: '#333333', textAlign: 'left' as const },
      heading: { fontSize: '24px', fontWeight: 'bold', color: '#333333', textAlign: 'left' as const },
      button: { 
        fontSize: '16px', 
        color: '#ffffff', 
        backgroundColor: '#3b82f6', 
        padding: '12px 24px',
        borderRadius: '6px',
        textAlign: 'center' as const
      },
      image: { width: '100%', height: 'auto' },
      spacer: { height: '20px' },
      column: { fontSize: '16px', color: '#333333', textAlign: 'left' as const }
    };

    return {
      id: generateId(),
      type,
      content: defaultContent[type],
      styles: defaultStyles[type]
    };
  };

  const updateElement = (elementId: string, updates: Partial<EmailElement>) => {
    setElements(prev => prev.map(el => 
      el.id === elementId ? { ...el, ...updates } : el
    ));
    
    if (selectedElement?.id === elementId) {
      setSelectedElement(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const deleteElement = (elementId: string) => {
    setElements(prev => prev.filter(el => el.id !== elementId));
    if (selectedElement?.id === elementId) {
      setSelectedElement(null);
    }
  };

  const handleSave = async () => {
    const templateToSave: EmailTemplate = {
      id: template?.id || generateId(),
      name: templateName,
      elements,
      subject,
      previewText,
      createdAt: template?.createdAt || new Date(),
      updatedAt: new Date()
    };

    try {
      setIsLoading(true);
      const saved = await apiService.saveTemplate(templateToSave);
      onSave?.(saved);
    } catch (error) {
      console.error('Failed to save template:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const insertColumn = (columnId: string) => {
    const column = availableColumns.find(col => col.id === columnId);
    if (!column) return;

    const newElement = createNewElement('column');
    newElement.content = `{{${column.name}}}`;
    newElement.columnId = columnId;
    
    setElements(prev => [...prev, newElement]);
    setSelectedElement(newElement);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <TemplateHeader
        templateName={templateName}
        onTemplateNameChange={setTemplateName}
        subject={subject}
        onSubjectChange={setSubject}
        previewText={previewText}
        onPreviewTextChange={setPreviewText}
        onSave={handleSave}
        onPreview={() => setShowPreview(!showPreview)}
        isLoading={isLoading}
        showPreview={showPreview}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {/* Left Panel - Toolbox and Columns */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <ElementToolbox />
              <ColumnPanel
                columns={availableColumns}
                onInsertColumn={insertColumn}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* Center Panel - Canvas */}
          <div className="flex-1 flex flex-col bg-gray-100">
            {showPreview ? (
              <EmailPreview
                elements={elements}
                subject={subject}
                previewText={previewText}
                availableColumns={availableColumns}
              />
            ) : (
              <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg min-h-full">
                  <div className="p-6">
                    <SortableContext
                      items={elements.map(el => el.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {elements.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                          <div className="text-lg font-medium mb-2">Start building your email</div>
                          <div className="text-sm">Drag elements from the left panel to get started</div>
                        </div>
                      ) : (
                        elements.map((element) => (
                          <SortableEmailElement
                            key={element.id}
                            element={element}
                            isSelected={selectedElement?.id === element.id}
                            onSelect={() => setSelectedElement(element)}
                            onUpdate={updateElement}
                            onDelete={deleteElement}
                            availableColumns={availableColumns}
                          />
                        ))
                      )}
                    </SortableContext>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Properties */}
          {!showPreview && (
            <div className="w-80 bg-white border-l border-gray-200">
              <PropertyPanel
                selectedElement={selectedElement}
                onUpdateElement={updateElement}
                availableColumns={availableColumns}
              />
            </div>
          )}

          <DragOverlay>
            {activeId ? (
              <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-4 shadow-lg">
                <div className="text-sm font-medium text-blue-800">
                  {activeId.startsWith('toolbox-') 
                    ? `Add ${activeId.replace('toolbox-', '')}`
                    : 'Moving element'
                  }
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};