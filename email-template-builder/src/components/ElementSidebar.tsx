import React from 'react';
import { 
  Type, 
  Heading, 
  Image, 
  Mouse, 
  Minus, 
  Minus as Separator, 
  Table,
  Database
} from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import { ElementType } from '../types';

interface ElementInfo {
  type: ElementType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const elementTypes: ElementInfo[] = [
  {
    type: 'heading',
    label: 'Heading',
    icon: <Heading className="w-5 h-5" />,
    description: 'Add a heading to your email'
  },
  {
    type: 'text',
    label: 'Text',
    icon: <Type className="w-5 h-5" />,
    description: 'Add text content'
  },
  {
    type: 'button',
    label: 'Button',
    icon: <Mouse className="w-5 h-5" />,
    description: 'Add a clickable button'
  },
  {
    type: 'image',
    label: 'Image',
    icon: <Image className="w-5 h-5" />,
    description: 'Add an image'
  },
  {
    type: 'spacer',
    label: 'Spacer',
    icon: <Minus className="w-5 h-5" />,
    description: 'Add vertical space'
  },
  {
    type: 'divider',
    label: 'Divider',
    icon: <Separator className="w-5 h-5" />,
    description: 'Add a horizontal line'
  },
  {
    type: 'table',
    label: 'Table',
    icon: <Table className="w-5 h-5" />,
    description: 'Add a data table'
  },
  {
    type: 'dynamic-content',
    label: 'Dynamic Content',
    icon: <Database className="w-5 h-5" />,
    description: 'Add API-based content'
  }
];

interface DraggableElementProps {
  element: ElementInfo;
}

const DraggableElement: React.FC<DraggableElementProps> = ({ element }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `new-${element.type}`,
    data: {
      type: 'new-element',
      elementType: element.type,
    },
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
        flex items-center p-3 mb-2 bg-white border border-gray-200 rounded-lg cursor-grab
        hover:border-blue-300 hover:bg-blue-50 transition-all duration-200
        ${isDragging ? 'opacity-50 cursor-grabbing' : ''}
      `}
    >
      <div className="flex items-center space-x-3 w-full">
        <div className="text-gray-600">
          {element.icon}
        </div>
        <div className="flex-1">
          <div className="font-medium text-gray-800">{element.label}</div>
          <div className="text-xs text-gray-500">{element.description}</div>
        </div>
      </div>
    </div>
  );
};

export const ElementSidebar: React.FC = () => {
  return (
    <div className="sidebar-panel w-64">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Elements</h2>
        <p className="text-sm text-gray-600">
          Drag elements to your email template
        </p>
      </div>
      
      <div className="space-y-1">
        {elementTypes.map((element) => (
          <DraggableElement key={element.type} element={element} />
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">💡 Tip</h3>
        <p className="text-sm text-blue-700">
          Use Dynamic Content elements to insert data from your API. 
          Configure API columns in the settings panel.
        </p>
      </div>
    </div>
  );
};