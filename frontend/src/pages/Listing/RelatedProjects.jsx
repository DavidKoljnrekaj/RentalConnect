import React, { useEffect, useState } from "react";
import ListingService from "../../services/listingService";
import "./RelatedProjects.css";
import ListingCard from "../../components/shared/ListingCard/ListingCard";

const RelatedProjects = ({ currentListingId }) => {
  const [relatedListings, setRelatedListings] = useState([]);

  useEffect(() => {
    const fetchRelatedListings = async () => {
      try {
        const data = await ListingService.getRelatedListings(currentListingId);
        setRelatedListings(data);
      } catch (error) {
        console.error("Error fetching related listings:", error);
      }
    };

    fetchRelatedListings();
  }, [currentListingId]);

  if (!relatedListings.length) return <p>Loading related projects...</p>;

  return (
    <div className="related-projects">
      <h3>Related Projects</h3>
      <div className="related-listings-grid">
      {relatedListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
      </div>
    </div>
  );
};

export default RelatedProjects;
