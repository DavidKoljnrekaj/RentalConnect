import React from "react";
import "./ListingCard.css";

const ListingCard = ({ listing }) => {
  return (
    <div className="listing-card">
      <img src={listing.image} alt={listing.title} />
      <div className="listing-card-details">
        <h4>{listing.title}</h4>
        <p>${listing.price.monthlyRent}/month</p>
      </div>
    </div>
  );
};

export default ListingCard;
