import React from 'react';
import './AboutUs.css';
import avatar1 from "../../assets/images/avatar1.jpg"
import avatar2 from "../../assets/images/avatar2.jpg"

const AboutUs = () => {
  return (
    <section className="about-us">
      <h2>About Us</h2>
      <p className="about-description">
        At RentalConnect, we’re revolutionizing the rental experience in Croatia.
        Our mission is to make finding a home easy and transparent by offering a modern, intuitive platform.
        We’re passionate about connecting people with their perfect living spaces, all while making the process efficient and stress-free.
      </p>

      <div className="team-container">
        <div className="team-member">
          <img
            src={avatar1}
            alt="Lovre Varvodic"
            className="team-photo"
          />
          <h3>Lovre Varvodic</h3>
          <p>CEO & Founder</p>
        </div>
        <div className="team-member">
          <img
            src= {avatar2}
            alt="David Koljnrekaj"
            className="team-photo"
          />
          <h3>David Koljnrekaj</h3>
          <p>CTO</p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
