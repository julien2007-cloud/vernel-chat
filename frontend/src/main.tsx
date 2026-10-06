import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { initTheme } from './services/theme/theme';

// Apply light/dark before the first render so there's no flash
initTheme();

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);