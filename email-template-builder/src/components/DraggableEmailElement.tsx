import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { EmailElement } from '../types';
import { Copy, Trash2, GripVertical, Edit3 } from 'lucide-react';

interface DraggableEmailElementProps {
  element: EmailElement;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<EmailElement>) => void;
  onRemove: () => void;
  onDuplicate: () => void;
}

export const DraggableEmailElement: React.FC<DraggableEmailElementProps> = ({
  element,
  isSelected,
  onSelect,
  onUpdate,
  onRemove,
  onDuplicate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(element.content);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: element.id,
    data: {
      type: 'email-element',
      element,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleContentEdit = () => {
    setIsEditing(true);
    setEditContent(element.content);
  };

  const handleSaveEdit = () => {
    onUpdate({ content: editContent });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(element.content);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const renderElementContent = () => {
    if (isEditing && (element.type === 'text' || element.type === 'heading' || element.type === 'button')) {
      return (
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSaveEdit}
          className="w-full p-2 border border-blue-300 rounded resize-none"
          style={{
            fontSize: element.styles.fontSize,
            fontFamily: element.styles.fontFamily,
            color: element.styles.color,
            textAlign: element.styles.textAlign,
            backgroundColor: 'transparent',
            minHeight: '40px',
          }}
          autoFocus
        />
      );
    }

    const commonStyles = {
      fontSize: element.styles.fontSize,
      fontFamily: element.styles.fontFamily,
      color: element.styles.color,
      textAlign: element.styles.textAlign as any,
      backgroundColor: element.styles.backgroundColor,
      padding: element.styles.padding,
      margin: element.styles.margin,
      borderRadius: element.styles.borderRadius,
      border: element.styles.border,
      width: element.styles.width,
      height: element.styles.height,
      lineHeight: element.styles.lineHeight,
    };

    switch (element.type) {
      case 'heading':
        return (
          <h2 style={commonStyles} className="cursor-text">
            {element.content || 'Click to edit heading'}
          </h2>
        );
      case 'text':
        return (
          <p style={commonStyles} className="cursor-text">
            {element.content || 'Click to edit text'}
          </p>
        );
      case 'button':
        return (
          <button style={commonStyles} className="cursor-pointer">
            {element.content || 'Click to edit button'}
          </button>
        );
      case 'image':
        return (
          <img
            src={element.content || 'https://via.placeholder.com/300x200?text=Image'}
            alt={element.properties.alt || 'Email image'}
            style={commonStyles}
            className="max-w-full h-auto"
          />
        );
      case 'spacer':
        return (
          <div
            style={{
              ...commonStyles,
              backgroundColor: element.styles.backgroundColor || 'transparent',
              border: isSelected ? '2px dashed #ccc' : 'none',
            }}
            className="w-full"
          >
            {isSelected && (
              <div className="text-center text-gray-400 text-sm py-2">
                Spacer ({element.styles.height})
              </div>
            )}
          </div>
        );
      case 'divider':
        return (
          <hr
            style={{
              ...commonStyles,
              border: 'none',
              backgroundColor: element.styles.backgroundColor || '#ccc',
            }}
          />
        );
      case 'dynamic-content':
        return (
          <span style={commonStyles} className="bg-yellow-100 px-2 py-1 rounded">
            {element.content || '{{dynamic_content}}'}
          </span>
        );
      default:
        return (
          <div style={commonStyles}>
            {element.content || 'Unknown element type'}
          </div>
        );
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        email-element group relative
        ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
        ${isDragging ? 'opacity-50' : ''}
      `}
      onClick={onSelect}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-10"
      >
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>

      {/* Element Actions */}
      {isSelected && (
        <div className="absolute right-2 top-2 flex space-x-1 z-10">
          {(element.type === 'text' || element.type === 'heading' || element.type === 'button') && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleContentEdit();
              }}
              className="p-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
              title="Edit content"
            >
              <Edit3 className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            className="p-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
            title="Duplicate"
          >
            <Copy className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="p-1 bg-white border border-gray-300 rounded hover:bg-red-50 text-red-600"
            title="Delete"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Element Content */}
      <div className="relative">
        {renderElementContent()}
      </div>

      {/* Element Type Badge */}
      {isSelected && (
        <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
          {element.type}
        </div>
      )}
    </div>
  );
};