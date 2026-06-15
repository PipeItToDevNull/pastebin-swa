// App bootstrap: mounts the React application into the root DOM node.
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './style.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);