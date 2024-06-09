import React from 'react';

export function Banner({ isOpen, toggleMenu }:any) {
  return (
 
    <nav className={`bg-gray-100 dark:bg-gray-900 ${isOpen ? 'translate-x-full fixed top-0 right-0 h-full' : 'translate-x-0'  }`} >
      <div>
        <ul className="space-y-2">
          <li>
            <p className="block p-2 bg-white dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
              Banner
            </p>
          </li>
        </ul>
      </div>
    </nav>
  );
};
