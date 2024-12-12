import React, { useState, useEffect } from 'react';
import ListingService from '../../services/listingService';
import ListingCard from '../../components/shared/ListingCard/ListingCard';
import './ProfilePage.css';

const ProfilePage = () => {
  const [favoritedListings, setFavoritedListings] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await ListingService.getFavoritedListings();
        console.log('Favorited Listings:', response); // Debug log
        setFavoritedListings(response);
      } catch (error) {
        console.error('Error fetching favorited listings:', error);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div className="profile-page">
      <h2>Your Profile</h2>
      <div className="profile-section">
        <h3>Favorited Listings</h3>
        <div className="listings-grid">
          {favoritedListings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
      </div>
    </div>
  );
};

export default ProfilePage;
