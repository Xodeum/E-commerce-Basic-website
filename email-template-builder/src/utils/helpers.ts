import { ApiColumn } from '../types';

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const replaceColumnPlaceholders = (
  content: string,
  columnId: string | undefined,
  availableColumns: ApiColumn[]
): string => {
  if (!columnId) return content;
  
  const column = availableColumns.find(col => col.id === columnId);
  if (!column) return content;
  
  // Replace placeholder with sample data based on column type
  const sampleData = getSampleDataForColumn(column);
  return content.replace(/\{\{.*?\}\}/g, sampleData);
};

export const getSampleDataForColumn = (column: ApiColumn): string => {
  switch (column.type) {
    case 'text':
      if (column.name.toLowerCase().includes('first')) return 'John';
      if (column.name.toLowerCase().includes('last')) return 'Doe';
      if (column.name.toLowerCase().includes('company')) return 'Acme Corp';
      if (column.name.toLowerCase().includes('phone')) return '+1 (555) 123-4567';
      return 'Sample Text';
    case 'email':
      return 'john.doe@example.com';
    case 'number':
      if (column.name.toLowerCase().includes('order')) return '5';
      if (column.name.toLowerCase().includes('spent') || column.name.toLowerCase().includes('amount')) {
        return '$1,234.56';
      }
      return '42';
    case 'date':
      return new Date().toLocaleDateString();
    case 'boolean':
      return 'Yes';
    case 'url':
      return 'https://example.com';
    default:
      return 'Sample Value';
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export const generateEmailHTML = (elements: any[], subject: string, previewText?: string): string => {
  const elementsHTML = elements.map(element => {
    const styles = Object.entries(element.styles)
      .map(([key, value]) => `${camelToKebab(key)}: ${value}`)
      .join('; ');

    switch (element.type) {
      case 'text':
        return `<p style="${styles}">${element.content}</p>`;
      case 'heading':
        return `<h2 style="${styles}">${element.content}</h2>`;
      case 'button':
        return `<div style="text-align: ${element.styles.textAlign || 'center'}">
          <a href="#" style="${styles}; display: inline-block; text-decoration: none;">
            ${element.content}
          </a>
        </div>`;
      case 'image':
        return `<img src="${element.content}" style="${styles}" alt="" />`;
      case 'spacer':
        return `<div style="${styles}"></div>`;
      case 'column':
        return `<p style="${styles}">${element.content}</p>`;
      default:
        return '';
    }
  }).join('\n');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f4f4f4; }
    .email-container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; }
  </style>
</head>
<body>
  ${previewText ? `<div style="display: none; max-height: 0; overflow: hidden;">${previewText}</div>` : ''}
  <div class="email-container">
    ${elementsHTML}
  </div>
</body>
</html>
  `.trim();
};

const camelToKebab = (str: string): string => {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
};