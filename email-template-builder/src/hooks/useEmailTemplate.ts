import { useState, useCallback } from 'react';
import { EmailTemplate, EmailElement, GlobalStyles } from '../types';
import { generateElementId } from '../utils/templateUtils';

export const useEmailTemplate = () => {
  const [template, setTemplate] = useState<EmailTemplate>({
    id: generateElementId(),
    name: 'Untitled Template',
    subject: 'Your Email Subject',
    elements: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    globalStyles: {
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      padding: '20px',
    },
  });

  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Update template and mark as dirty
  const updateTemplate = useCallback((updates: Partial<EmailTemplate>) => {
    setTemplate(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date(),
    }));
    setIsDirty(true);
  }, []);

  // Add element to template
  const addElement = useCallback((element: EmailElement, position?: number) => {
    setTemplate(prev => {
      const newPosition = position ?? prev.elements.length;
      const elementWithPosition = { ...element, position: newPosition };
      
      // Adjust positions of existing elements
      const updatedElements = prev.elements.map(el => 
        el.position >= newPosition 
          ? { ...el, position: el.position + 1 }
          : el
      );

      return {
        ...prev,
        elements: [...updatedElements, elementWithPosition],
        updatedAt: new Date(),
      };
    });
    setIsDirty(true);
  }, []);

  // Update specific element
  const updateElement = useCallback((elementId: string, updates: Partial<EmailElement>) => {
    setTemplate(prev => ({
      ...prev,
      elements: prev.elements.map(el =>
        el.id === elementId ? { ...el, ...updates } : el
      ),
      updatedAt: new Date(),
    }));
    setIsDirty(true);
  }, []);

  // Remove element from template
  const removeElement = useCallback((elementId: string) => {
    setTemplate(prev => {
      const elementToRemove = prev.elements.find(el => el.id === elementId);
      if (!elementToRemove) return prev;

      const updatedElements = prev.elements
        .filter(el => el.id !== elementId)
        .map(el => 
          el.position > elementToRemove.position
            ? { ...el, position: el.position - 1 }
            : el
        );

      return {
        ...prev,
        elements: updatedElements,
        updatedAt: new Date(),
      };
    });
    
    if (selectedElementId === elementId) {
      setSelectedElementId(null);
    }
    setIsDirty(true);
  }, [selectedElementId]);

  // Reorder elements
  const reorderElements = useCallback((sourceIndex: number, destinationIndex: number) => {
    setTemplate(prev => {
      const elements = [...prev.elements];
      const [removed] = elements.splice(sourceIndex, 1);
      elements.splice(destinationIndex, 0, removed);

      // Update positions
      const updatedElements = elements.map((el, index) => ({
        ...el,
        position: index,
      }));

      return {
        ...prev,
        elements: updatedElements,
        updatedAt: new Date(),
      };
    });
    setIsDirty(true);
  }, []);

  // Duplicate element
  const duplicateElement = useCallback((elementId: string) => {
    const element = template.elements.find(el => el.id === elementId);
    if (!element) return;

    const duplicatedElement: EmailElement = {
      ...element,
      id: generateElementId(),
      position: element.position + 1,
    };

    addElement(duplicatedElement, element.position + 1);
  }, [template.elements, addElement]);

  // Update global styles
  const updateGlobalStyles = useCallback((styles: Partial<GlobalStyles>) => {
    updateTemplate({
      globalStyles: {
        ...template.globalStyles,
        ...styles,
      },
    });
  }, [template.globalStyles, updateTemplate]);

  // Get selected element
  const selectedElement = selectedElementId 
    ? template.elements.find(el => el.id === selectedElementId) || null
    : null;

  // Get sorted elements
  const sortedElements = [...template.elements].sort((a, b) => a.position - b.position);

  // Load template
  const loadTemplate = useCallback((newTemplate: EmailTemplate) => {
    setTemplate(newTemplate);
    setSelectedElementId(null);
    setIsDirty(false);
  }, []);

  // Reset template
  const resetTemplate = useCallback(() => {
    setTemplate({
      id: generateElementId(),
      name: 'Untitled Template',
      subject: 'Your Email Subject',
      elements: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      globalStyles: {
        backgroundColor: '#f5f5f5',
        fontFamily: 'Arial, sans-serif',
        maxWidth: '600px',
        padding: '20px',
      },
    });
    setSelectedElementId(null);
    setIsDirty(false);
  }, []);

  // Mark as saved
  const markAsSaved = useCallback(() => {
    setIsDirty(false);
  }, []);

  return {
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
    updateGlobalStyles,
    loadTemplate,
    resetTemplate,
    markAsSaved,
  };
};