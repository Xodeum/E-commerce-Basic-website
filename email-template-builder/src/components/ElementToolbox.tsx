import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { 
  Type, 
  Heading, 
  MousePointer, 
  Image, 
  Space, 
  Database,
  GripVertical 
} from 'lucide-react';

interface DraggableElementProps {
  id: string;
  type: string;
  icon: React.ReactNode;
  label: string;
  description: string;
}

const DraggableElement: React.FC<DraggableElementProps> = ({ 
  id, 
  type, 
  icon, 
  label, 
  description 
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `toolbox-${type}`,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg 
        cursor-grab hover:border-blue-300 hover:bg-blue-50 transition-all
        ${isDragging ? 'opacity-50' : ''}
      `}
    >
      <div className="flex items-center gap-2 flex-1">
        <div className="text-gray-600">{icon}</div>
        <div>
          <div className="font-medium text-sm text-gray-900">{label}</div>
          <div className="text-xs text-gray-500">{description}</div>
        </div>
      </div>
      <GripVertical className="w-4 h-4 text-gray-400" />
    </div>
  );
};

export const ElementToolbox: React.FC = () => {
  const elements = [
    {
      type: 'text',
      icon: <Type className="w-4 h-4" />,
      label: 'Text',
      description: 'Add a text paragraph'
    },
    {
      type: 'heading',
      icon: <Heading className="w-4 h-4" />,
      label: 'Heading',
      description: 'Add a heading'
    },
    {
      type: 'button',
      icon: <MousePointer className="w-4 h-4" />,
      label: 'Button',
      description: 'Add a clickable button'
    },
    {
      type: 'image',
      icon: <Image className="w-4 h-4" />,
      label: 'Image',
      description: 'Add an image'
    },
    {
      type: 'spacer',
      icon: <Space className="w-4 h-4" />,
      label: 'Spacer',
      description: 'Add vertical spacing'
    }
  ];

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
          <Database className="w-4 h-4 text-blue-600" />
        </div>
        <h3 className="font-semibold text-gray-900">Elements</h3>
      </div>
      
      <div className="space-y-2">
        {elements.map((element) => (
          <DraggableElement
            key={element.type}
            id={`toolbox-${element.type}`}
            type={element.type}
            icon={element.icon}
            label={element.label}
            description={element.description}
          />
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-xs text-gray-600">
          💡 <strong>Tip:</strong> Drag elements to the canvas to start building your email template.
        </div>
      </div>
    </div>
  );
};