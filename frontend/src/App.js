import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/shared/Navbar/Navbar';
import Home from './pages/home/Home';
import Login from './components/login/Login';
import Register from './components/register/Register';
import Listing from './pages/Listing/Listing';
import ListingsPage from './pages/ListingsPage/ListingsPage'

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/listing/:id" element={<Listing />} />
        <Route path="/listings" element={<ListingsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
