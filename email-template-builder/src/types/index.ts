export interface EmailElement {
  id: string;
  type: 'text' | 'heading' | 'image' | 'button' | 'spacer' | 'divider' | 'table' | 'dynamic-content';
  content: string;
  styles: ElementStyles;
  properties: ElementProperties;
  position: number;
}

export interface ElementStyles {
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  padding?: string;
  margin?: string;
  borderRadius?: string;
  border?: string;
  width?: string;
  height?: string;
  lineHeight?: string;
}

export interface ElementProperties {
  placeholder?: string;
  alt?: string;
  href?: string;
  target?: '_blank' | '_self';
  columnId?: string;
  apiEndpoint?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  elements: EmailElement[];
  createdAt: Date;
  updatedAt: Date;
  globalStyles: GlobalStyles;
}

export interface GlobalStyles {
  backgroundColor: string;
  fontFamily: string;
  maxWidth: string;
  padding: string;
}

export interface ApiColumn {
  id: string;
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'image' | 'url';
  description?: string;
  sampleValue?: string;
}

export interface ApiResponse {
  columns: ApiColumn[];
  data?: Record<string, any>[];
}

export interface DragItem {
  id: string;
  type: string;
  element?: EmailElement;
}

export type ElementType = EmailElement['type'];