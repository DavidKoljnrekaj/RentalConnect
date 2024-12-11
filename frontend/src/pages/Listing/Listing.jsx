import React, { useState, useEffect } from 'react';
import ListingService from '../../services/listingService';
import { useParams } from 'react-router-dom';
import './Listing.css';
import RelatedProjects from "./RelatedProjects";


const Listing = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAdditionalDetails, setShowAdditionalDetails] = useState(false);
  
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const data = await ListingService.getListingById(id);
        setListing(data);
      } catch (error) {
        console.error('Error fetching listing:', error);
      }
    };

    fetchListing();
  }, [id]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : listing.images.length - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex < listing.images.length - 1 ? prevIndex + 1 : 0));
  };

  if (!listing) return <p>Loading...</p>;

  return (
    <div className="listing-page">
    <div className="listing">
      <div className="image-slider">
        {listing.images && listing.images.length > 0 ? (
          <>
            <button className="prev-button" onClick={handlePrevImage}>&lt;</button>
            <img src={listing.images[currentImageIndex]} alt="Property" className="main-image" />
            <button className="next-button" onClick={handleNextImage}>&gt;</button>
          </>
        ) : (
          <div className="placeholder-image">No Images Available</div>
        )}
        <div className="image-indicators">
          {listing.images.map((_, index) => (
            <span
              key={index}
              className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
            ></span>
          ))}
        </div>
      </div>

      <div className="listing-details">
        <h2>{listing.title}</h2>
        <h3>Description</h3>
        <p>{listing.description}</p>
        <h3>Pricing</h3>
        <p>Monthly Rent: ${listing.price.monthlyRent}</p>
        <p>Deposit: ${listing.price.deposit}</p>
        <p>Utilities: {listing.utilities.included ? 'Included' : 'Not Included'}</p>
        <h3>Details</h3>
        <p>Property Type: {listing.propertyDetails.type}</p>
        <p>Furnished: {listing.propertyDetails.furnished ? 'Yes' : 'No'}</p>
        <p>Size in sqm: {listing.propertyDetails.size}</p>
        <p>Room Number: {listing.propertyDetails.bedrooms}</p>
        <p>Bathroom Number: {listing.propertyDetails.bathrooms}</p>
      </div>
      </div>
      <button
        className="toggle-details-button"
        onClick={() => setShowAdditionalDetails(!showAdditionalDetails)}
      >
        {showAdditionalDetails ? 'Hide Additional Details' : 'Show Additional Details'}
      </button>
      <div
        className={`additional-details-container ${
          showAdditionalDetails ? 'open' : ''
        }`}
      >
        <div className="additional-details">
          <h3>Additional Details</h3>
          <p>Pets Allowed: {listing.propertyDetails.petsAllowed ? 'Yes' : 'No'}</p>
          <p>Available From: {new Date(listing.availability.availableFrom).toLocaleDateString()}</p>
          <p>Lease Duration: {listing.availability.leaseDuration}</p>
          <p>Contact Name: {listing.contact.name}</p>
          <p>Contact Phone: {listing.contact.phone}</p>
          <p>Contact Email: {listing.contact.email}</p>
          {listing.location.state && <p>State: {listing.location.state}</p>}
          {listing.location.postalCode && <p>Postal Code: {listing.location.postalCode}</p>}
          {listing.location.coordinates.lat && listing.location.coordinates.lng && (
            <p>
              Coordinates: Lat {listing.location.coordinates.lat}, Lng {listing.location.coordinates.lng}
            </p>
          )}
          {listing.utilities.details && (
            <p>Included Utilities: {listing.utilities.details.join(', ')}</p>
          )}
        </div>
      </div>
      <RelatedProjects currentListingId={id} />
    </div>
  );
};

export default Listing;
