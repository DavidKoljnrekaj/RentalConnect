import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import ListingService from '../../services/listingService';
import ListingCard from '../../components/shared/ListingCard/ListingCard';
import { AuthContext } from '../../context/AuthContext';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const { role } = useContext(AuthContext);

  const [myListings, setMyListings] = useState([]);
  const [favoritedListings, setFavoritedListings] = useState([]);
  const [pendingListings, setPendingListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Fetch My Listings
        const myListingsResponse = await ListingService.getMyListings();
        setMyListings(myListingsResponse.listings);

        // Fetch Favorited Listings
        const favoritedResponse = await ListingService.getFavoritedListings();
        setFavoritedListings(favoritedResponse);

        // Fetch Pending Listings (only for admin)
        if (role === 'admin') {
          const pendingResponse = await ListingService.getPendingShortListings();
          setPendingListings(pendingResponse.listings);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching listings:', error);
        setLoading(false);
      }
    };

    fetchListings();
  }, [role]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="profile-page">
      <h2>Your Profile</h2>

      <div className="profile-section">
        <h3>My Listings</h3>
        {myListings.length > 0 ? (
          <div className="listings-grid">
            {myListings.map((listing) => (
              <ListingCard 
              key={listing.id} 
              listing={listing} 
              className={`listing-card ${listing.approvalStatus}`}
              />
            ))}
          </div>
        ) : (
          <div>
            <p>You have no listings.</p>
            <Link to="/add-listing">
              <button>Add a Listing</button>
            </Link>
          </div>
        )}
      </div>

      <div className="profile-section">
        <h3>Favorited Listings</h3>
        {favoritedListings.length > 0 ? (
          <div className="listings-grid">
            {favoritedListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <p>You have no favorited listings.</p>
        )}
      </div>

      {role === 'admin' && (
        <div className="profile-section">
          <h3>Pending Approval</h3>
          {pendingListings.length > 0 ? (
            <div className="listings-grid">
              {pendingListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <p>No pending listings for approval.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
