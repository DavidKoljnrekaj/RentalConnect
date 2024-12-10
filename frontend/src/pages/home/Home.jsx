import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import WhyChooseUs from './WhyChooseUs';
import AboutUs from './AboutUs';

const Home = () => {
  return (
    <div>
      <div className="hero-container">
        <div className="hero-content">
          <h1>Welcome to Rental Connect</h1>
          <p>
            Explore our listings, view properties on the map, and experience a hassle-free renting process. Ready to find your next place to live?
          </p>
          <Link to="/listings" className="hero-button">
            Explore Listings
          </Link>
        </div>
      </div>
      <WhyChooseUs />
      <AboutUs />
    </div>
  );
};

export default Home;
