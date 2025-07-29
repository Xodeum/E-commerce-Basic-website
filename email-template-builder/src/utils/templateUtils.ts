import { EmailElement, EmailTemplate, ApiColumn } from '../types';

export const generateElementId = (): string => {
  return `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const createDefaultElement = (type: EmailElement['type']): EmailElement => {
  const baseElement: EmailElement = {
    id: generateElementId(),
    type,
    content: '',
    styles: {
      fontSize: '14px',
      fontFamily: 'Arial, sans-serif',
      color: '#333333',
      padding: '10px',
      textAlign: 'left',
    },
    properties: {},
    position: 0,
  };

  switch (type) {
    case 'heading':
      return {
        ...baseElement,
        content: 'Your Heading Here',
        styles: {
          ...baseElement.styles,
          fontSize: '24px',
          fontWeight: 'bold',
          textAlign: 'center',
        },
      };
    case 'text':
      return {
        ...baseElement,
        content: 'Your text content goes here. Click to edit.',
      };
    case 'button':
      return {
        ...baseElement,
        content: 'Click Me',
        styles: {
          ...baseElement.styles,
          backgroundColor: '#007bff',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: '4px',
          textAlign: 'center',
          fontWeight: 'bold',
        },
        properties: {
          href: '#',
          target: '_blank',
        },
      };
    case 'image':
      return {
        ...baseElement,
        content: 'https://via.placeholder.com/300x200',
        styles: {
          ...baseElement.styles,
          width: '100%',
          height: 'auto',
        },
        properties: {
          alt: 'Image description',
        },
      };
    case 'spacer':
      return {
        ...baseElement,
        content: '',
        styles: {
          ...baseElement.styles,
          height: '20px',
          backgroundColor: 'transparent',
        },
      };
    case 'divider':
      return {
        ...baseElement,
        content: '',
        styles: {
          ...baseElement.styles,
          height: '1px',
          backgroundColor: '#cccccc',
          margin: '20px 0',
        },
      };
    case 'dynamic-content':
      return {
        ...baseElement,
        content: '{{column_name}}',
        properties: {
          placeholder: 'Select an API column',
        },
      };
    default:
      return baseElement;
  }
};

export const generateEmailHTML = (template: EmailTemplate, apiData?: Record<string, any>): string => {
  const { elements, globalStyles } = template;
  
  const processContent = (content: string, data?: Record<string, any>): string => {
    if (!data) return content;
    
    return content.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] || match;
    });
  };

  const renderElement = (element: EmailElement): string => {
    const { type, content, styles, properties } = element;
    const processedContent = processContent(content, apiData);
    
    const styleString = Object.entries(styles)
      .map(([key, value]) => {
        const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        return `${cssKey}: ${value}`;
      })
      .join('; ');

    switch (type) {
      case 'heading':
        return `<h2 style="${styleString}">${processedContent}</h2>`;
      case 'text':
        return `<p style="${styleString}">${processedContent}</p>`;
      case 'button':
        return `<a href="${properties.href || '#'}" target="${properties.target || '_blank'}" style="display: inline-block; text-decoration: none; ${styleString}">${processedContent}</a>`;
      case 'image':
        return `<img src="${processedContent}" alt="${properties.alt || ''}" style="${styleString}" />`;
      case 'spacer':
        return `<div style="${styleString}"></div>`;
      case 'divider':
        return `<hr style="border: none; ${styleString}" />`;
      case 'dynamic-content':
        return `<span style="${styleString}">${processedContent}</span>`;
      default:
        return `<div style="${styleString}">${processedContent}</div>`;
    }
  };

  const sortedElements = [...elements].sort((a, b) => a.position - b.position);
  const elementsHTML = sortedElements.map(renderElement).join('\n');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${template.subject}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: ${globalStyles.backgroundColor}; font-family: ${globalStyles.fontFamily};">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td align="center" style="padding: ${globalStyles.padding};">
            <table role="presentation" width="${globalStyles.maxWidth}" cellspacing="0" cellpadding="0" border="0" style="max-width: ${globalStyles.maxWidth};">
              <tr>
                <td>
                  ${elementsHTML}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

export const exportTemplate = (template: EmailTemplate): string => {
  return JSON.stringify(template, null, 2);
};

export const importTemplate = (templateData: string): EmailTemplate => {
  const parsed = JSON.parse(templateData);
  return {
    ...parsed,
    createdAt: new Date(parsed.createdAt),
    updatedAt: new Date(parsed.updatedAt),
  };
};

export const validateApiColumn = (column: ApiColumn): boolean => {
  return !!(column.id && column.name && column.type);
};

export const getElementDefaultContent = (type: EmailElement['type'], columnName?: string): string => {
  if (type === 'dynamic-content' && columnName) {
    return `{{${columnName}}}`;
  }
  return createDefaultElement(type).content;
};