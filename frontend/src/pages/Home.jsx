import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <main className="page">
      <section
        className="clean-block clean-hero"
        style={{
          backgroundImage: "url('../../public/variant.jpg')",
          color: "rgba(200, 200, 200, 0.7)",
        }}
      >
        <div className="text">
          <h2 className="text-primary-emphasis">Welcome to Rental Connect</h2>
          <p className="fw-semibold text-primary-emphasis">
            Explore our listings, view properties on the map, and experience a hassle-free renting process. Ready to find your next place to live?
          </p>
          <button className="btn btn-outline-dark btn-lg link-body-emphasis">
            Explore Listings
          </button>
        </div>
      </section>
      <section className="clean-block clean-info dark">
        <div className="container">
          <div className="block-heading">
            <h2 className="text-info">Discover Your Perfect Home</h2>
            <p>
              Browse our listings and discover homes that fit your lifestyle, from cozy apartments to spacious family houses.
            </p>
          </div>
          <div className="row align-items-center">
            <div className="col-md-6">
              <img
                className="img-thumbnail"
                alt="apartment, room, house"
                src="../../public/g9407e9e939fe07dd7d1303afb65ec820dc7c97a59b3da0e3a55a31e42f5ad97ac2cb6bc6a63eb7bc92b1b60e4a2b523645486846ef39b41035562bd0cfe3c7c1_640.jpg"
              />
            </div>
            <div className="col-md-6">
              <h3 className="text-info">Why choose us?</h3>
              <p>
                <strong>Wide Selection of Properties:</strong> Find rentals that match your preferences and budget.
                <br />
                <strong>Easy-to-Use Platform:</strong> Search, browse, and connect with property owners effortlessly.
                <br />
                <strong>Transparent Information:</strong> Up-to-date listings with detailed descriptions and photos.
              </p>
              <button className="btn btn-outline-primary btn-lg text-start">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
