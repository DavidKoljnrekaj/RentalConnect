import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { AuthContext } from '../../../context/AuthContext';
import Login from '../../auth/Login';
import Register from '../../auth/Register';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const openLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  const openRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const closeModals = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">RentalConnect</Link>
      </div>
      <div className="navbar-right">
        <ul className="navbar-links">
          <li>
            <Link to="/">HOME</Link>
          </li>
          <li>
            <Link to="/map">MAP</Link>
          </li>
          <li>
            <Link to="/listings">LISTINGS</Link>
          </li>
        </ul>
        <div className="navbar-auth">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="navbar-profile">
                {user?.username || 'Profile'}
              </Link>
              <button onClick={logout} className="logout-button">
                Logout
              </button>
            </>
          ) : (
            <button onClick={openLogin} className="login-button">
            Log In
          </button>
          )}
        </div>
      </div>
      {showLogin && <Login onClose={closeModals} onSwitch={openRegister} />}
      {showRegister && <Register onClose={closeModals} onSwitch={openLogin} />}
    </nav>
  );
};

export default Navbar;
