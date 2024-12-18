import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/shared/Navbar/Navbar';
import Home from './pages/home/Home';
import Register from './components/auth/Register';
import Listing from './pages/Listing/Listing';
import ListingsPage from './pages/ListingsPage/ListingsPage'
import AddListing from './pages/AddListing/AddListing';
import MapPage from './pages/MapPage/MapPage';
import ProfilePage from './pages/Profile/ProfilePage';
 
const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/listing/:id" element={<Listing />} />
        <Route path="/listings" element={<ListingsPage />} />
        <Route path="/add-listing" element={<AddListing />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
};

export default App;
