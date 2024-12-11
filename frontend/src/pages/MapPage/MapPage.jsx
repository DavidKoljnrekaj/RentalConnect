import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import ListingService from '../../services/listingService';
import './MapPage.css';

// Fix for default Leaflet icon issues in React
import 'leaflet/dist/leaflet.css';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapPage = () => {
  const [mapListings, setMapListings] = useState([]);

  useEffect(() => {
    const fetchMapListings = async () => {
      try {
        const data = await ListingService.getMapListings();
        setMapListings(data);
      } catch (error) {
        console.error('Error fetching map listings:', error);
      }
    };

    fetchMapListings();
  }, []);

  return (
    <div className="map-page">
      <h1>Listings Map</h1>
      <MapContainer center={[45.815, 15.9819]} zoom={12} scrollWheelZoom={true} className="map-container">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {mapListings.map((listing) => (
          <Marker
            key={listing.id}
            position={[listing.lat, listing.lng]}
          >
            <Popup>
              <h3>{listing.title}</h3>
              <p>Rent: ${listing.price}/month</p>
              <a href={`/listing/${listing.id}`}>View Details</a>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapPage;
