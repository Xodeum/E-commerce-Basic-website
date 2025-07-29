export interface ApiColumn {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'email' | 'url';
  description?: string;
}

export interface EmailElement {
  id: string;
  type: 'text' | 'heading' | 'button' | 'image' | 'spacer' | 'column';
  content: string;
  styles: ElementStyles;
  columnId?: string; // For dynamic column integration
}

export interface ElementStyles {
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  padding?: string;
  margin?: string;
  borderRadius?: string;
  border?: string;
  width?: string;
  height?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  elements: EmailElement[];
  subject: string;
  previewText?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DragItem {
  id: string;
  type: string;
  element?: EmailElement;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}