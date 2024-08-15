import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { isAuthenticated, login, logout } = useContext(AuthContext);

  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          Web3 Voting System
        </Link>
        <div>
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={login}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded"
            >
              Login
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;