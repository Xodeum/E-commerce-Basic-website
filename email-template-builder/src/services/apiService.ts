import { ApiColumn, ApiResponse } from '../types';

// Mock API service - replace with real API endpoints
export class ApiService {
  private static instance: ApiService;
  private columns: ApiColumn[] = [];
  // private baseUrl = 'https://api.example.com'; // Replace with your API base URL when needed

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // Fetch available columns from API
  async fetchColumns(_endpoint?: string): Promise<ApiColumn[]> {
    try {
      // For demo purposes, return mock data
      // In production, replace with actual API call:
      // const response = await fetch(`${this.baseUrl}/columns`);
      // const data = await response.json();
      
      const mockColumns: ApiColumn[] = [
        {
          id: 'user_name',
          name: 'User Name',
          type: 'string',
          description: 'Full name of the user',
          sampleValue: 'John Doe'
        },
        {
          id: 'user_email',
          name: 'User Email',
          type: 'string',
          description: 'Email address of the user',
          sampleValue: 'john.doe@example.com'
        },
        {
          id: 'user_avatar',
          name: 'User Avatar',
          type: 'image',
          description: 'Profile picture URL',
          sampleValue: 'https://via.placeholder.com/100x100'
        },
        {
          id: 'order_total',
          name: 'Order Total',
          type: 'number',
          description: 'Total amount of the order',
          sampleValue: '99.99'
        },
        {
          id: 'order_date',
          name: 'Order Date',
          type: 'date',
          description: 'Date when the order was placed',
          sampleValue: '2024-01-15'
        },
        {
          id: 'is_premium',
          name: 'Premium User',
          type: 'boolean',
          description: 'Whether the user has premium status',
          sampleValue: 'true'
        },
        {
          id: 'profile_url',
          name: 'Profile URL',
          type: 'url',
          description: 'Link to user profile',
          sampleValue: 'https://example.com/profile/johndoe'
        }
      ];

      this.columns = mockColumns;
      return mockColumns;
    } catch (error) {
      console.error('Error fetching columns:', error);
      throw new Error('Failed to fetch API columns');
    }
  }

  // Get sample data for preview
  async getSampleData(): Promise<Record<string, any>> {
    const sampleData: Record<string, any> = {};
    
    for (const column of this.columns) {
      sampleData[column.id] = column.sampleValue || '';
    }

    return sampleData;
  }

  // Validate API endpoint
  async validateEndpoint(endpoint: string): Promise<boolean> {
    try {
      // In production, implement actual endpoint validation
      // const response = await fetch(endpoint, { method: 'HEAD' });
      // return response.ok;
      
      // For demo, return true for any endpoint that looks like a URL
      const urlPattern = /^https?:\/\/.+/;
      return urlPattern.test(endpoint);
    } catch (error) {
      return false;
    }
  }

  // Get column by ID
  getColumnById(id: string): ApiColumn | undefined {
    return this.columns.find(column => column.id === id);
  }

  // Get all available columns
  getAvailableColumns(): ApiColumn[] {
    return [...this.columns];
  }

  // Custom API endpoint integration
  async fetchFromCustomEndpoint(_endpoint: string): Promise<ApiResponse> {
    try {
      // In production, implement actual API call
      // const response = await fetch(endpoint);
      // const data = await response.json();
      
      // For demo, return mock response
      const mockResponse: ApiResponse = {
        columns: this.columns,
        data: [await this.getSampleData()]
      };

      return mockResponse;
    } catch (error) {
      console.error('Error fetching from custom endpoint:', error);
      throw new Error('Failed to fetch data from custom endpoint');
    }
  }

  // Test connection to API
  async testConnection(): Promise<boolean> {
    try {
      await this.fetchColumns();
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const apiService = ApiService.getInstance();