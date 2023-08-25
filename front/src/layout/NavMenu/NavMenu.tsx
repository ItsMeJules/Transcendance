import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const GlobalNavDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='dropdown'>
      <button onClick={toggleDropdown}>
        Menu
      </button>
      {isOpen && (
        <div className="dropdown-content">
          <Link to="/profile/me">Profile</Link>
          <Link to="/settings">Settings</Link>
          <Link to="/home">Home</Link>
        </div>
      )}
    </div>
  );
}

export default GlobalNavDropdown;