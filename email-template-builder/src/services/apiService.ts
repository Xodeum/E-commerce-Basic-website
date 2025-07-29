import axios from 'axios';
import { ApiColumn, EmailTemplate, ApiResponse } from '../types';

// Mock API URL - replace with your actual API endpoint
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.example.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock data for demonstration purposes
const mockColumns: ApiColumn[] = [
  { id: 'col_1', name: 'First Name', type: 'text', description: 'Customer first name' },
  { id: 'col_2', name: 'Last Name', type: 'text', description: 'Customer last name' },
  { id: 'col_3', name: 'Email', type: 'email', description: 'Customer email address' },
  { id: 'col_4', name: 'Company', type: 'text', description: 'Company name' },
  { id: 'col_5', name: 'Phone', type: 'text', description: 'Phone number' },
  { id: 'col_6', name: 'Signup Date', type: 'date', description: 'Account creation date' },
  { id: 'col_7', name: 'Total Orders', type: 'number', description: 'Total number of orders' },
  { id: 'col_8', name: 'Total Spent', type: 'number', description: 'Total amount spent' },
  { id: 'col_9', name: 'Is Premium', type: 'boolean', description: 'Premium member status' },
  { id: 'col_10', name: 'Website', type: 'url', description: 'Company website' },
];

export const apiService = {
  // Fetch available columns from API
  async getColumns(): Promise<ApiColumn[]> {
    try {
      // In a real application, this would be an actual API call
      // const response = await apiClient.get<ApiResponse<ApiColumn[]>>('/columns');
      // return response.data.data;
      
      // For now, return mock data with a delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockColumns;
    } catch (error) {
      console.error('Error fetching columns:', error);
      // Return mock data as fallback
      return mockColumns;
    }
  },

  // Save email template
  async saveTemplate(template: EmailTemplate): Promise<EmailTemplate> {
    try {
      // const response = await apiClient.post<ApiResponse<EmailTemplate>>('/templates', template);
      // return response.data.data;
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 300));
      return { ...template, updatedAt: new Date() };
    } catch (error) {
      console.error('Error saving template:', error);
      throw new Error('Failed to save template');
    }
  },

  // Load email templates
  async getTemplates(): Promise<EmailTemplate[]> {
    try {
      // const response = await apiClient.get<ApiResponse<EmailTemplate[]>>('/templates');
      // return response.data.data;
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 400));
      return [];
    } catch (error) {
      console.error('Error fetching templates:', error);
      return [];
    }
  },

  // Delete email template
  async deleteTemplate(templateId: string): Promise<void> {
    try {
      // await apiClient.delete(`/templates/${templateId}`);
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error('Error deleting template:', error);
      throw new Error('Failed to delete template');
    }
  },

  // Get column data preview (for live preview)
  async getColumnPreview(columnId: string): Promise<string> {
    try {
      // const response = await apiClient.get<ApiResponse<{ value: string }>>(`/columns/${columnId}/preview`);
      // return response.data.data.value;
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 100));
      const column = mockColumns.find(col => col.id === columnId);
      if (!column) return 'Unknown Column';
      
      // Return sample data based on column type
      switch (column.type) {
        case 'text':
          return column.name.includes('First') ? 'John' : 
                 column.name.includes('Last') ? 'Doe' :
                 column.name.includes('Company') ? 'Acme Corp' : 'Sample Text';
        case 'email':
          return 'john.doe@example.com';
        case 'number':
          return column.name.includes('Orders') ? '5' : '$1,234.56';
        case 'date':
          return '2024-01-15';
        case 'boolean':
          return 'Yes';
        case 'url':
          return 'https://example.com';
        default:
          return 'Sample Value';
      }
    } catch (error) {
      console.error('Error fetching column preview:', error);
      return 'Error loading data';
    }
  }
};

export default apiService;