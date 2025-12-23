// src/components/common/UserLayout.jsx
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

const UserLayout = ({ children }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      <Navbar />

      {isHome ? (
        // Home page: full-width, no outer padding/box
        <main className="w-full">
          {children}
        </main>
      ) : (
        // Other pages: keep centered container with padding
        <main className="w-full">
          {children}
        </main>
      )}
    </div>
  );
};

export default UserLayout;
