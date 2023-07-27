import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';

import ChatDropdown from './chat/dropdown/ChatDropdown';
import ChatBox from './chat/v2/ChatBox';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    {/* <ChatDropdown /> */}
    <ChatBox />
  </>
);