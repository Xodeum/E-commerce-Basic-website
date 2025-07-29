import React from 'react';
import { EmailEditor } from './components/EmailEditor';
import './App.css';

function App() {
  const handleSaveTemplate = (template: any) => {
    console.log('Template saved:', template);
    // You can add notification here or handle the saved template
  };

  return (
    <div className="App">
      <EmailEditor onSave={handleSaveTemplate} />
    </div>
  );
}

export default App;
