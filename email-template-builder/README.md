# Email Template Builder

A powerful React application for creating email templates with live preview and dynamic API column integration. Build beautiful, responsive email templates with drag-and-drop functionality and real-time data integration.

## ✨ Features

### 🎨 **Visual Email Builder**
- **Drag & Drop Interface**: Intuitive drag-and-drop email element creation
- **Live Preview**: Real-time preview with desktop, mobile, and code views
- **Interactive Editing**: Inline editing with instant visual feedback
- **Element Library**: Pre-built components (text, headings, buttons, images, spacers)

### 🔗 **Dynamic API Integration**
- **Column Mapping**: Connect email elements to API data columns
- **Real-time Data**: Live preview with actual data from your API
- **Multiple Data Types**: Support for text, numbers, dates, emails, URLs, and booleans
- **Smart Placeholders**: Intelligent sample data generation based on column types

### 🛠 **Advanced Styling**
- **Visual Property Panel**: Easy-to-use styling controls
- **Custom CSS**: Full control over element appearance
- **Responsive Design**: Mobile-optimized templates
- **Modern UI**: Built with Tailwind CSS for a beautiful interface

### 💾 **Template Management**
- **Save & Load**: Persistent template storage
- **Export Options**: Generate production-ready HTML
- **Template Library**: Organize and manage multiple templates
- **Version Control**: Track template changes and updates

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd email-template-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗 Project Structure

```
src/
├── components/
│   ├── EmailEditor.tsx          # Main editor component
│   ├── ElementToolbox.tsx       # Draggable element library
│   ├── SortableEmailElement.tsx # Individual email elements
│   ├── EmailPreview.tsx         # Live preview component
│   ├── PropertyPanel.tsx        # Element styling controls
│   ├── TemplateHeader.tsx       # Template metadata & actions
│   └── ColumnPanel.tsx          # API column integration
├── services/
│   └── apiService.ts            # API integration service
├── types/
│   └── index.ts                 # TypeScript interfaces
├── utils/
│   └── helpers.ts               # Utility functions
└── App.tsx                      # Main application component
```

## 🔧 Configuration

### API Integration

To connect your own API data source, update the `apiService.ts` file:

```typescript
// Replace with your actual API endpoint
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-api.com';

// Update the getColumns method to fetch from your API
async getColumns(): Promise<ApiColumn[]> {
  const response = await apiClient.get<ApiResponse<ApiColumn[]>>('/columns');
  return response.data.data;
}
```

### Environment Variables

Create a `.env` file in the project root:

```env
REACT_APP_API_URL=https://your-api-endpoint.com
```

## 📊 API Column Format

Your API should return columns in this format:

```typescript
interface ApiColumn {
  id: string;              // Unique identifier
  name: string;            // Display name
  type: 'text' | 'number' | 'date' | 'boolean' | 'email' | 'url';
  description?: string;    // Optional description
}
```

Example API response:
```json
{
  "success": true,
  "data": [
    {
      "id": "user_first_name",
      "name": "First Name",
      "type": "text",
      "description": "Customer's first name"
    },
    {
      "id": "user_email",
      "name": "Email Address", 
      "type": "email",
      "description": "Customer's email address"
    }
  ]
}
```

## 🎯 Usage Guide

### Creating Your First Email Template

1. **Start with Elements**
   - Drag elements from the left toolbox to the canvas
   - Use text for paragraphs, headings for titles, buttons for CTAs

2. **Add Dynamic Content**
   - Browse available API columns in the left panel
   - Click any column to insert it as dynamic content
   - Elements with API data show a preview toggle

3. **Customize Styling**
   - Select any element to open the property panel
   - Adjust colors, fonts, spacing, and alignment
   - Changes apply instantly in the editor

4. **Preview & Export**
   - Use the preview button to see desktop/mobile views
   - Switch to code view to see generated HTML
   - Export the final HTML for use in your email system

### Working with Dynamic Columns

```typescript
// Column elements automatically use placeholders like:
"{{First Name}}"  // Will be replaced with actual data

// In the preview, you'll see sample data like:
"John"           // Sample first name data
```

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run test suite
- `npm eject` - Eject from Create React App

## 🛠 Built With

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling framework
- **@dnd-kit** - Drag and drop functionality
- **Lucide React** - Icon library
- **Axios** - HTTP client

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support & FAQ

### Common Issues

**Q: Elements not dragging properly?**
A: Make sure you're using a supported browser and have JavaScript enabled.

**Q: API columns not loading?**
A: Check your API endpoint configuration in `apiService.ts` and ensure CORS is properly configured.

**Q: Preview not updating?**
A: Verify that your elements have content and proper styling applied.

### Getting Help

- 📧 Email: support@email-builder.com
- 💬 Discord: [Join our community](https://discord.gg/email-builder)
- 📚 Documentation: [Full docs](https://docs.email-builder.com)

## 🔮 Roadmap

- [ ] Template marketplace
- [ ] Advanced conditional logic
- [ ] A/B testing capabilities
- [ ] Real-time collaboration
- [ ] Advanced analytics integration
- [ ] Custom element creation
- [ ] Bulk template operations

---

**Made with ❤️ for the developer community**
