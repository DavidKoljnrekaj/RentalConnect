import React from 'react';
import './WhyChooseUs.css';
import kitchenImage from '../../assets/images/kitchen.jpg';
const WhyChooseUs = () => {
  return (
    <section className="why-choose-us">
      {/* Introductory Heading */}
      <div className="intro-text">
        <h2>Discover Your Perfect Home</h2>
        <p>
          Browse our listings and discover homes that fit your lifestyle, from cozy apartments to spacious family houses.
        </p>
      </div>

      {/* Flexbox for Image and "Why Choose Us" */}
      <div className="why-choose-us-container">
        <div className="image-container">
          <img src={kitchenImage} alt="Stylish kitchen" />
        </div>
        <div className="content-container">
          <h3>Why choose us?</h3>
          <ul>
            <li>
              <strong>Wide Selection of Properties:</strong> Find rentals that match your preferences and budget.
            </li>
            <li>
              <strong>Easy-to-Use Platform:</strong> Search, browse, and connect with property owners effortlessly.
            </li>
            <li>
              <strong>Transparent Information:</strong> Up-to-date listings with detailed descriptions and photos.
            </li>
          </ul>
          <button className="contact-us-button">Contact Us</button>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
