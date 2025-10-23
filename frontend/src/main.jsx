import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import logoImage from './assets/image.png';

const ensureFavicon = (href) => {
  const existing = document.querySelector("link[rel='icon']");
  if (existing) {
    existing.type = 'image/png';
    existing.href = href;
    return;
  }

  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/png';
  link.href = href;
  document.head.appendChild(link);
};

ensureFavicon(logoImage);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
