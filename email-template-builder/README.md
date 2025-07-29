# Email Template Builder

A modern, interactive React application for creating email templates with live preview and dynamic API content integration.

## 🚀 Features

### Core Functionality
- **Drag & Drop Interface**: Intuitive drag-and-drop functionality for building email templates
- **Live Preview**: Real-time preview of your email templates as you build them
- **Dynamic Content**: Integration with API data using column IDs for personalized emails
- **Element Library**: Pre-built components including text, headings, buttons, images, spacers, dividers, and dynamic content
- **Visual Editor**: Click-to-edit functionality with inline content editing
- **Template Management**: Save and load templates locally

### Design Features
- **Responsive Design**: Mobile and desktop preview modes
- **Modern UI**: Clean, professional interface built with Tailwind CSS
- **Property Editor**: Comprehensive styling options for each element
- **Global Styles**: Template-wide styling controls
- **HTML Export**: Export templates as production-ready HTML

### API Integration
- **Column Mapping**: Map dynamic content to API column IDs
- **Sample Data Preview**: See how your template looks with real data
- **Flexible Integration**: Easy to connect with any REST API

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **@dnd-kit** for drag-and-drop functionality
- **Lucide React** for icons
- **Modern CSS** with responsive design

## 📦 Installation

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
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to see the application

## 🎯 Usage Guide

### Building Your First Template

1. **Start with Elements**
   - Drag elements from the left sidebar to the canvas
   - Available elements: Heading, Text, Button, Image, Spacer, Divider, Dynamic Content

2. **Edit Content**
   - Click on any element to select it
   - Use inline editing by clicking the edit button or double-clicking text elements
   - Modify properties in the right panel

3. **Style Your Elements**
   - Select an element to access styling options
   - Customize typography, colors, spacing, borders, and dimensions
   - Use the collapsible property panels for organized editing

4. **Add Dynamic Content**
   - Drag a "Dynamic Content" element to the canvas
   - Select an API column from the dropdown in properties
   - The element will display placeholder data during editing

5. **Preview Your Template**
   - Click the "Preview" button in the header
   - Toggle between desktop and mobile views
   - Switch between visual preview and HTML code view

6. **Save and Export**
   - Use the "Save" button to store your template locally
   - Download HTML files directly from the preview panel
   - Copy HTML to clipboard for use in email platforms

### API Integration

The application includes a mock API service with sample data. To integrate with your own API:

1. **Update API Service** (`src/services/apiService.ts`)
   ```typescript
   // Replace the mock data with your actual API endpoints
   async fetchColumns(endpoint?: string): Promise<ApiColumn[]> {
     const response = await fetch(`${this.baseUrl}/columns`);
     return response.json();
   }
   ```

2. **Configure Columns**
   - Update the column definitions to match your API schema
   - Ensure each column has an `id`, `name`, `type`, and optional `sampleValue`

3. **Handle Authentication**
   - Add authentication headers as needed
   - Implement error handling for API failures

### Element Types

| Element | Description | Use Case |
|---------|-------------|----------|
| **Heading** | Large text for titles | Email headers, section titles |
| **Text** | Regular paragraph text | Body content, descriptions |
| **Button** | Clickable call-to-action | Links, CTAs, form submissions |
| **Image** | Pictures and graphics | Logos, product images, banners |
| **Spacer** | Invisible spacing element | Vertical spacing control |
| **Divider** | Horizontal line separator | Section separators |
| **Dynamic Content** | API-driven content | Personalized data, user info |

## 🎨 Customization

### Styling
- Global styles are configured in `src/index.css`
- Component styles use Tailwind utility classes
- Custom CSS classes are defined for email-specific styling

### Adding New Elements
1. Add the element type to `src/types/index.ts`
2. Create the element factory in `src/utils/templateUtils.ts`
3. Add the element to the sidebar in `src/components/ElementSidebar.tsx`
4. Implement rendering in `src/components/DraggableEmailElement.tsx`

### Theming
Customize the color scheme by modifying the Tailwind configuration:
```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: {
        // Your brand colors
      }
    }
  }
}
```

## 🔧 Development

### Project Structure
```
src/
├── components/          # React components
│   ├── ElementSidebar.tsx
│   ├── EmailCanvas.tsx
│   ├── PropertiesPanel.tsx
│   └── EmailPreview.tsx
├── hooks/              # Custom React hooks
│   └── useEmailTemplate.ts
├── services/           # API and external services
│   └── apiService.ts
├── types/             # TypeScript type definitions
│   └── index.ts
├── utils/             # Utility functions
│   └── templateUtils.ts
└── App.tsx            # Main application component
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint (if configured)

### Building for Production
```bash
npm run build
```
The built files will be in the `dist/` directory.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the existing issues in the repository
2. Create a new issue with detailed information
3. Include steps to reproduce any bugs
4. Provide environment details (OS, Node version, etc.)

## 🚀 Future Enhancements

- [ ] Template library with pre-built designs
- [ ] Advanced API authentication options
- [ ] Team collaboration features
- [ ] Version history and rollback
- [ ] A/B testing capabilities
- [ ] Integration with popular email platforms
- [ ] Advanced conditional content rules
- [ ] Multi-language support

---

Built with ❤️ using React, TypeScript, and modern web technologies.
