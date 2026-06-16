// App bootstrap: mounts the React application into the root DOM node.
import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Upload from './upload';
import Paste from './paste';
import './style.css';

const SITE_NAME = window.__CONFIG__?.SITE_NAME || 'KittyPost';
const REPO_URL = window.__CONFIG__?.REPO_URL || '/';
const maxAgeHours = Number(window.__CONFIG__?.PASTE_MAX_AGE_HOURS) || 24;
const retentionLabel = maxAgeHours === 1 ? '1 hour' : `${maxAgeHours} hours`;

/** App shell with routing between upload and paste views. */
const App = () => {
  useEffect(() => {
    document.title = SITE_NAME;
  }, []);

  return (
    <Router>
      <div id="container">
        <div id="header">
          <h1 id="site_name">
            <a className="siteLink" href="/">{SITE_NAME}</a>
          </h1>
        </div>
        <Routes>
          <Route path="/:uuid" element={<Paste />} />
          <Route path="/" element={<Upload />} />
        </Routes>
        <footer>
          <p>All pastes are deleted after {retentionLabel}</p>
          <p>Find the source for this project <a href={REPO_URL}>on GitHub</a></p>
        </footer>
      </div>
    </Router>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);