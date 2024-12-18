import React from "react";
import { useNavigate } from "react-router-dom";
import "./ListingCard.css";

const ListingCard = ({ listing, className }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/listing/${listing._id}`); // Redirect to the listing details page
  };

  return (
    <div className={className || "listing-card"} onClick={handleCardClick}>
      <img src={listing.images} alt={listing.title} />
      <div className="listing-card-details">
        <h4>{listing.title}</h4>
        <p>${listing.price.monthlyRent}/month</p>
      </div>
    </div>
  );
};

export default ListingCard;
