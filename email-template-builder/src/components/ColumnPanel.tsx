import React, { useState } from 'react';
import { ApiColumn } from '../types';
import { 
  Database, 
  Plus, 
  Search, 
  RefreshCw,
  Hash,
  Type,
  Mail,
  Calendar,
  ToggleLeft,
  Link,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface ColumnPanelProps {
  columns: ApiColumn[];
  onInsertColumn: (columnId: string) => void;
  isLoading: boolean;
}

export const ColumnPanel: React.FC<ColumnPanelProps> = ({ 
  columns, 
  onInsertColumn, 
  isLoading 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);

  const getColumnIcon = (type: ApiColumn['type']) => {
    switch (type) {
      case 'text':
        return <Type className="w-4 h-4" />;
      case 'number':
        return <Hash className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'date':
        return <Calendar className="w-4 h-4" />;
      case 'boolean':
        return <ToggleLeft className="w-4 h-4" />;
      case 'url':
        return <Link className="w-4 h-4" />;
      default:
        return <Type className="w-4 h-4" />;
    }
  };

  const getColumnTypeColor = (type: ApiColumn['type']) => {
    switch (type) {
      case 'text':
        return 'bg-blue-100 text-blue-800';
      case 'number':
        return 'bg-green-100 text-green-800';
      case 'email':
        return 'bg-purple-100 text-purple-800';
      case 'date':
        return 'bg-orange-100 text-orange-800';
      case 'boolean':
        return 'bg-gray-100 text-gray-800';
      case 'url':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredColumns = columns.filter(column =>
    column.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    column.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="border-t border-gray-200">
      <div className="p-4">
        <div 
          className="flex items-center gap-2 mb-4 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
            <Database className="w-4 h-4 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 flex-1">API Columns</h3>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </div>

        {isExpanded && (
          <>
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search columns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-5 h-5 text-gray-400 animate-spin mr-2" />
                <span className="text-sm text-gray-500">Loading columns...</span>
              </div>
            )}

            {/* Columns List */}
            {!isLoading && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredColumns.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    <Database className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <div className="text-sm">
                      {searchTerm ? 'No columns found' : 'No columns available'}
                    </div>
                  </div>
                ) : (
                  filteredColumns.map((column) => (
                    <div
                      key={column.id}
                      className="group p-3 bg-white border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all cursor-pointer"
                      onClick={() => onInsertColumn(column.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-gray-600 mt-0.5">
                          {getColumnIcon(column.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm text-gray-900 truncate">
                              {column.name}
                            </span>
                            <span className={`
                              px-2 py-0.5 text-xs font-medium rounded-full
                              ${getColumnTypeColor(column.type)}
                            `}>
                              {column.type}
                            </span>
                          </div>
                          {column.description && (
                            <div className="text-xs text-gray-500 leading-relaxed">
                              {column.description}
                            </div>
                          )}
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Plus className="w-4 h-4 text-green-600" />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Info Box */}
            {!isLoading && filteredColumns.length > 0 && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="text-xs text-green-700">
                  🔗 <strong>Dynamic Data:</strong> Click any column to insert it as dynamic content in your email.
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};