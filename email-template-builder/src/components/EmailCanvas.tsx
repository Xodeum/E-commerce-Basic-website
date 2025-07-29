import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { EmailElement } from '../types';
import { DraggableEmailElement } from './DraggableEmailElement';

interface EmailCanvasProps {
  elements: EmailElement[];
  selectedElementId: string | null;
  onSelectElement: (elementId: string | null) => void;
  onUpdateElement: (elementId: string, updates: Partial<EmailElement>) => void;
  onRemoveElement: (elementId: string) => void;
  onDuplicateElement: (elementId: string) => void;
}

export const EmailCanvas: React.FC<EmailCanvasProps> = ({
  elements,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onRemoveElement,
  onDuplicateElement,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'email-canvas',
  });

  const sortedElements = [...elements].sort((a, b) => a.position - b.position);

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Email Template</h2>
          <p className="text-sm text-gray-600">
            Drag elements from the sidebar or click to edit existing ones
          </p>
        </div>
        
        <div
          ref={setNodeRef}
          className={`
            drop-zone bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-300 p-6
            transition-all duration-200 min-h-[400px]
            ${isOver ? 'border-blue-500 bg-blue-50' : ''}
            ${elements.length === 0 ? 'flex items-center justify-center' : ''}
          `}
        >
          {elements.length === 0 ? (
            <div className="text-center">
              <div className="text-gray-400 mb-2">
                <svg
                  className="w-12 h-12 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                Start Building Your Email
              </h3>
              <p className="text-gray-500">
                Drag elements from the sidebar to get started
              </p>
            </div>
          ) : (
            <SortableContext
              items={sortedElements.map(el => el.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {sortedElements.map((element) => (
                  <DraggableEmailElement
                    key={element.id}
                    element={element}
                    isSelected={selectedElementId === element.id}
                    onSelect={() => onSelectElement(element.id)}
                    onUpdate={(updates) => onUpdateElement(element.id, updates)}
                    onRemove={() => onRemoveElement(element.id)}
                    onDuplicate={() => onDuplicateElement(element.id)}
                  />
                ))}
              </div>
            </SortableContext>
          )}
        </div>
      </div>
    </div>
  );
};