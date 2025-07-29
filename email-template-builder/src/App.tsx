import { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { Mail, Save, FolderOpen, Play } from 'lucide-react';

import { ElementSidebar } from './components/ElementSidebar';
import { EmailCanvas } from './components/EmailCanvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import { EmailPreview } from './components/EmailPreview';
import { useEmailTemplate } from './hooks/useEmailTemplate';
import { createDefaultElement } from './utils/templateUtils';
import { DragItem } from './types';

type ViewMode = 'editor' | 'preview';

function App() {
  const {
    template,
    selectedElementId,
    selectedElement,
    sortedElements,
    isDirty,
    setSelectedElementId,
    updateTemplate,
    addElement,
    updateElement,
    removeElement,
    reorderElements,
    duplicateElement,
    markAsSaved,
  } = useEmailTemplate();

  const [viewMode, setViewMode] = useState<ViewMode>('editor');
  const [, setActiveId] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);

    // Determine what's being dragged
    if (active.data.current?.type === 'new-element') {
      setDraggedItem({
        id: active.id as string,
        type: 'new-element',
      });
    } else if (active.data.current?.type === 'email-element') {
      setDraggedItem({
        id: active.id as string,
        type: 'email-element',
        element: active.data.current.element,
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      setDraggedItem(null);
      return;
    }

    // Handle dropping new elements
    if (active.data.current?.type === 'new-element') {
      const elementType = active.data.current.elementType;
      const newElement = createDefaultElement(elementType);
      addElement(newElement);
    }
    
    // Handle reordering existing elements
    else if (active.data.current?.type === 'email-element' && over.id !== active.id) {
      const activeIndex = sortedElements.findIndex(el => el.id === active.id);
      const overIndex = sortedElements.findIndex(el => el.id === over.id);
      
      if (activeIndex !== -1 && overIndex !== -1) {
        reorderElements(activeIndex, overIndex);
      }
    }

    setActiveId(null);
    setDraggedItem(null);
  };

  const handleSaveTemplate = () => {
    // In a real app, you would save to a backend here
    console.log('Saving template:', template);
    markAsSaved();
    
    // Save to localStorage for demo purposes
    const savedTemplates = JSON.parse(localStorage.getItem('emailTemplates') || '[]');
    const existingIndex = savedTemplates.findIndex((t: any) => t.id === template.id);
    
    if (existingIndex !== -1) {
      savedTemplates[existingIndex] = template;
    } else {
      savedTemplates.push(template);
    }
    
    localStorage.setItem('emailTemplates', JSON.stringify(savedTemplates));
    alert('Template saved successfully!');
  };

  const handleLoadTemplate = () => {
    // In a real app, you would show a template selection modal
    const savedTemplates = JSON.parse(localStorage.getItem('emailTemplates') || '[]');
    if (savedTemplates.length > 0) {
      const confirmed = confirm('Load the last saved template? This will replace the current template.');
      if (confirmed) {
        // Load the most recent template
        const latestTemplate = savedTemplates[savedTemplates.length - 1];
        updateTemplate(latestTemplate);
        alert('Template loaded successfully!');
      }
    } else {
      alert('No saved templates found.');
    }
  };

  const renderDragOverlay = () => {
    if (!draggedItem) return null;

    if (draggedItem.type === 'new-element') {
      return (
        <div className="bg-white border-2 border-blue-500 rounded-lg p-4 shadow-lg">
          <div className="text-gray-600">
            New {draggedItem.id.replace('new-', '')} element
          </div>
        </div>
      );
    }

    if (draggedItem.type === 'email-element' && draggedItem.element) {
      return (
        <div className="bg-white border-2 border-blue-500 rounded-lg p-4 shadow-lg opacity-90">
          <div className="text-gray-600 text-sm mb-2">
            {draggedItem.element.type}
          </div>
          <div className="text-gray-800">
            {draggedItem.element.content || 'Element content'}
          </div>
        </div>
      );
    }

    return null;
  };

  const renderHeader = () => (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Mail className="w-8 h-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-800">Email Template Builder</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={template.name}
              onChange={(e) => updateTemplate({ name: e.target.value })}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
              placeholder="Template name"
            />
            {isDirty && (
              <span className="text-xs text-orange-600 font-medium">• Unsaved changes</span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('editor')}
              className={`
                px-4 py-2 rounded text-sm font-medium transition-colors
                ${viewMode === 'editor' 
                  ? 'bg-white text-gray-800 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
                }
              `}
            >
              Editor
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded text-sm font-medium transition-colors
                ${viewMode === 'preview' 
                  ? 'bg-white text-gray-800 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
                }
              `}
            >
              <Play className="w-4 h-4" />
              <span>Preview</span>
            </button>
          </div>

          {/* Action Buttons */}
          <button
            onClick={handleLoadTemplate}
            className="btn-secondary flex items-center space-x-2"
          >
            <FolderOpen className="w-4 h-4" />
            <span>Load</span>
          </button>
          
          <button
            onClick={handleSaveTemplate}
            className="btn-primary flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>
        </div>
      </div>
    </header>
  );

  const renderEditor = () => (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-full">
        <ElementSidebar />
        
        <EmailCanvas
          elements={sortedElements}
          selectedElementId={selectedElementId}
          onSelectElement={setSelectedElementId}
          onUpdateElement={updateElement}
          onRemoveElement={removeElement}
          onDuplicateElement={duplicateElement}
        />
        
        <PropertiesPanel
          selectedElement={selectedElement}
          onUpdateElement={(updates) => {
            if (selectedElement) {
              updateElement(selectedElement.id, updates);
            }
          }}
        />
      </div>
      
      <DragOverlay>
        {renderDragOverlay()}
      </DragOverlay>
    </DndContext>
  );

  const renderPreview = () => (
    <EmailPreview template={template} />
  );

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {renderHeader()}
      
      <main className="flex-1 overflow-hidden">
        {viewMode === 'editor' ? renderEditor() : renderPreview()}
      </main>
      
      {/* Global Settings Modal - You could add this as a separate component */}
      {/* <GlobalSettingsModal /> */}
    </div>
  );
}

export default App;