import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';

import ChatDropdown from './chat/dropdown/ChatDropdown';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChatDropdown />
  </React.StrictMode>
);