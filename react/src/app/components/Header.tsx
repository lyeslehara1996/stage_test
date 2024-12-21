// src/app/components/Header.tsx
import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Application</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/admin">Admin</Link>
            </li>
            <li>
              <Link href="/tvscreen">TvScreen</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
