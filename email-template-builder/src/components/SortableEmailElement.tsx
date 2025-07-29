import React, { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { EmailElement, ApiColumn } from '../types';
import { replaceColumnPlaceholders } from '../utils/helpers';
import { 
  GripVertical, 
  Trash2, 
  Edit3, 
  Eye,
  Link,
  Save,
  X
} from 'lucide-react';

interface SortableEmailElementProps {
  element: EmailElement;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (elementId: string, updates: Partial<EmailElement>) => void;
  onDelete: (elementId: string) => void;
  availableColumns: ApiColumn[];
}

export const SortableEmailElement: React.FC<SortableEmailElementProps> = ({
  element,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  availableColumns
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(element.content);
  const [showPreview, setShowPreview] = useState(false);
  const editRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: element.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    if (isEditing && editRef.current) {
      editRef.current.focus();
      editRef.current.select();
    }
  }, [isEditing]);

  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditContent(element.content);
  };

  const handleSaveEdit = () => {
    onUpdate(element.id, { content: editContent });
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

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(element.id);
  };

  const getDisplayContent = () => {
    if (element.type === 'column' && element.columnId) {
      return showPreview 
        ? replaceColumnPlaceholders(element.content, element.columnId, availableColumns)
        : element.content;
    }
    return element.content;
  };

  const renderElement = () => {
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

    switch (element.type) {
      case 'text':
        return isEditing ? (
          <textarea
            ref={editRef as React.RefObject<HTMLTextAreaElement>}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-2 border border-blue-300 rounded resize-none"
            style={{ minHeight: '60px' }}
          />
        ) : (
          <p style={baseStyle} className="cursor-text">
            {getDisplayContent() || 'Click to edit text'}
          </p>
        );

      case 'heading':
        return isEditing ? (
          <input
            ref={editRef as React.RefObject<HTMLInputElement>}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-2 border border-blue-300 rounded text-xl font-bold"
          />
        ) : (
          <h2 style={baseStyle} className="cursor-text">
            {getDisplayContent() || 'Your Heading'}
          </h2>
        );

      case 'button':
        return isEditing ? (
          <input
            ref={editRef as React.RefObject<HTMLInputElement>}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-2 border border-blue-300 rounded"
          />
        ) : (
          <div style={{ textAlign: styles.textAlign || 'center' }}>
            <button style={baseStyle} className="cursor-text">
              {getDisplayContent() || 'Click me'}
            </button>
          </div>
        );

      case 'image':
        return isEditing ? (
          <input
            ref={editRef as React.RefObject<HTMLInputElement>}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Image URL"
            className="w-full p-2 border border-blue-300 rounded"
          />
        ) : (
          <img
            src={element.content || 'https://via.placeholder.com/600x300'}
            alt="Email content"
            style={baseStyle}
            className="max-w-full h-auto cursor-text"
          />
        );

      case 'spacer':
        return (
          <div
            style={{ ...baseStyle, backgroundColor: 'transparent', border: '2px dashed #e5e7eb' }}
            className="min-h-[20px] flex items-center justify-center text-gray-400 text-sm"
          >
            {isSelected ? 'Spacer' : ''}
          </div>
        );

      case 'column':
        return isEditing ? (
          <input
            ref={editRef as React.RefObject<HTMLInputElement>}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-2 border border-blue-300 rounded"
          />
        ) : (
          <p style={baseStyle} className="cursor-text">
            {getDisplayContent() || '{{column_placeholder}}'}
          </p>
        );

      default:
        return <div>Unknown element type</div>;
    }
  };

  const getElementIcon = () => {
    if (element.type === 'column') {
      return <Link className="w-4 h-4" />;
    }
    return null;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group relative mb-4 p-3 rounded-lg border-2 transition-all
        ${isSelected ? 'border-blue-300 bg-blue-50' : 'border-transparent hover:border-gray-200'}
        ${isDragging ? 'opacity-50 z-50' : ''}
      `}
      onClick={onSelect}
    >
      {/* Element Content */}
      <div className="relative">
        {renderElement()}
      </div>

      {/* Controls Overlay */}
      {(isSelected || isEditing) && (
        <div className="absolute -top-3 -right-3 flex items-center gap-1 bg-white border border-gray-200 rounded-lg shadow-lg p-1">
          {/* Column Preview Toggle */}
          {element.type === 'column' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowPreview(!showPreview);
              }}
              className={`
                p-1.5 rounded transition-colors
                ${showPreview ? 'bg-green-100 text-green-600' : 'text-gray-500 hover:bg-gray-100'}
              `}
              title={showPreview ? 'Show placeholder' : 'Show preview data'}
            >
              <Eye className="w-4 h-4" />
            </button>
          )}

          {/* Edit Button */}
          {element.type !== 'spacer' && (
            <>
              {isEditing ? (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveEdit();
                    }}
                    className="p-1.5 rounded text-green-600 hover:bg-green-100 transition-colors"
                    title="Save"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancelEdit();
                    }}
                    className="p-1.5 rounded text-gray-500 hover:bg-gray-100 transition-colors"
                    title="Cancel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={handleStartEdit}
                  className="p-1.5 rounded text-gray-500 hover:bg-gray-100 transition-colors"
                  title="Edit"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
            </>
          )}

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="p-1.5 rounded text-red-500 hover:bg-red-100 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className="p-1.5 rounded text-gray-400 hover:bg-gray-100 cursor-grab active:cursor-grabbing transition-colors"
            title="Drag to reorder"
          >
            <GripVertical className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Element Type Indicator */}
      {isSelected && (
        <div className="absolute -top-3 -left-3 flex items-center gap-1 bg-white border border-gray-200 rounded-lg shadow-lg px-2 py-1">
          {getElementIcon()}
          <span className="text-xs font-medium text-gray-600 capitalize">
            {element.type}
          </span>
          {element.type === 'column' && element.columnId && (
            <span className="text-xs text-blue-600">
              (API)
            </span>
          )}
        </div>
      )}
    </div>
  );
};