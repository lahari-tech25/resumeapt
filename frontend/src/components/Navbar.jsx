// ---------- File: src/components/Navbar.jsx ----------
// Purpose: Navigation bar with conditional rendering based on authentication status

// Navbar.jsx
import { useAuth } from '../context/authContext';

const Navbar = () => {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <nav>
      {user ? (
        <>
          <span>Welcome, {user.name}!</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <a href="/login">Login</a>
      )}
    </nav>
  );
};

export default Navbar;