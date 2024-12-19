import React, { useState, useEffect, useContext } from 'react';
import ListingService from '../../services/listingService';
import { AuthContext } from '../../context/AuthContext';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import './Listing.css';
import RelatedProjects from "./RelatedProjects";


const Listing = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAdditionalDetails, setShowAdditionalDetails] = useState(false);
  const [isFavourited, setIsFavourited] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const { role, userId, isAuthenticated } = useContext(AuthContext);

  
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const data = await ListingService.getListingById(id);
        setListing(data);

        // Check if the listing is already favourited
        if (isAuthenticated) {
          const favourites = await ListingService.getFavoritedListings();
          console.log(favourites);
          setIsFavourited(favourites.some((fav) => fav._id === id));
        }
      } catch (error) {
        console.error('Error fetching listing:', error);
      }
    };

    fetchListing();
  }, [id, isAuthenticated]);

  const handleApproval = async (action) => {
    try {
      if (action === 'approve') {
        await ListingService.approveListing(id);
      } else if (action === 'reject') {
        await ListingService.rejectListing(id);
      }

      // Refresh the listing data
      const updatedListing = await ListingService.getListingById(id);
      setListing(updatedListing);
    } catch (error) {
      console.error(`Error ${action}ing listing:`, error);
    }
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : listing.images.length - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex < listing.images.length - 1 ? prevIndex + 1 : 0));
  };

  const handleFavouriteToggle = async () => {
    if (!isAuthenticated) {
      setShowLoginPopup(true);
      return;
    }

    try {
      if (isFavourited) {
        await ListingService.removeFromFavourites(id);
        setIsFavourited(false);
      } else {
        await ListingService.addToFavourites(id);
        setIsFavourited(true);
      }
    } catch (error) {
      console.error('Error toggling favourites:', error);
    }
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
        <button onClick={handleFavouriteToggle} className="favourite-button">
            {isFavourited ? 'Remove from Favourites' : 'Add to Favourites'}
          </button>

          {/* Login popup */}
          {showLoginPopup && (
            <div className="popup">
              <p>You need to be logged in to add favourites.</p>
              <button onClick={() => setShowLoginPopup(false)}>Close</button>
            </div>
          )}
        {/* Approval Feature for Admins */}
        {(role === 'admin' || userId === listing.createdBy) && (
            <div className="admin-approval-section">
              <h3>Approval Status</h3>
              <p>
                Current Status:{' '}
                <span className={`status-${listing.approvalStatus}`}>
                  {listing.approvalStatus}
                </span>
              </p>
              {/* Admin Actions */}
              {role === 'admin' && (
                <div>
                  <button
                    onClick={() => handleApproval('approve')}
                    className="approve-button"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproval('reject')}
                    className="reject-button"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          )}
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
          <p>Pets Allowed: {listing.propertyDetails?.petsAllowed ? 'Yes' : 'No'}</p>
          <p>Available From: {listing.availability?.availableFrom 
            ? new Date(listing.availability.availableFrom).toLocaleDateString() 
            : 'Not Available'}
          </p>
          <p>Lease Duration: {listing.availability?.leaseDuration || 'Not Specified'}</p>
          <p>Contact Name: {listing.contact?.name || 'N/A'}</p>
          <p>Contact Phone: {listing.contact?.phone || 'N/A'}</p>
          <p>Contact Email: {listing.contact?.email || 'N/A'}</p>
          
          {listing.location?.state && <p>State: {listing.location.state}</p>}
          {listing.location?.postalCode && <p>Postal Code: {listing.location.postalCode}</p>}
          
          {listing.location?.coordinates?.lat && listing.location?.coordinates?.lng && (
            <p>
              Coordinates: Lat {listing.location.coordinates.lat}, Lng {listing.location.coordinates.lng}
            </p>
          )}
          
          {listing.utilities?.details && Array.isArray(listing.utilities.details) && (
            <p>Included Utilities: {listing.utilities.details.join(', ')}</p>
          )}
        </div>
      </div>
      {listing.location?.coordinates?.lat && listing.location?.coordinates?.lng && (
          <div style={{ marginTop: '2rem', marginLeft: '7%', marginRight: '7%' }}>
            <h3>Listing Location</h3>
            <MapContainer
              center={[listing.location.coordinates.lat, listing.location.coordinates.lng]}
              zoom={15}
              scrollWheelZoom={false}
              style={{ height: '300px', width: '100%', borderRadius: '10px', border: '1px solid #ccc' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
              />
              <Marker position={[listing.location.coordinates.lat, listing.location.coordinates.lng]} />
            </MapContainer>
          </div>
        )}
      <RelatedProjects currentListingId={id} />
    </div>
  );
};

export default Listing;
