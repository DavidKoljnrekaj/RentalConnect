import React from "react";
import { useNavigate } from "react-router-dom";
import "./ListingCard.css";

const ListingCard = ({ listing }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/listing/${listing._id}`); // Redirect to the listing details page
  };
  const defaultImage = "../../../assets/images/kitchen.jpg";

  return (
    <div className="listing-card" onClick={handleCardClick}>
      <img src={listing.image || defaultImage} alt={listing.title} />
      <div className="listing-card-details">
        <h4>{listing.title}</h4>
        <p>${listing.price.monthlyRent}/month</p>
      </div>
    </div>
  );
};

export default ListingCard;
