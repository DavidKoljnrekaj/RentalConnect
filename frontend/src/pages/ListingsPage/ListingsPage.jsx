import React, { useState, useEffect } from 'react';
import ListingService from '../../services/listingService';
import ListingCard from '../../components/shared/ListingCard/ListingCard'; // Reusing the component
import SearchComponent from '../../components/shared/Search/SearchComponent';
import './ListingsPage.css';

const ListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [numberOfListings, setNumberOfListings] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  
  const PAGE_SIZE = 10; // Number of listings per page

  const fetchListings = async (page) => {
    try {
      const filters = { page, limit: PAGE_SIZE };
      const response = await ListingService.getListings(filters);
      setListings(response.listings);
      setTotalPages(response.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching listings:', error);
    }
  };

  const handleSearch = (searchTerm) => {
    fetchListings({ title: searchTerm });
  };

  const toggleFilterPanel = () => {
    setFilterPanelOpen(!filterPanelOpen);
  };

  const applyFilters = () => {
    console.log('Filters applied');
    // Add filter logic here
    toggleFilterPanel();
  };

  const clearFilters = () => {
    console.log('Filters cleared');
    // Add clear filter logic here
  };

  useEffect(() => {
    fetchListings(1); // Fetch the first page when the component mounts
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchListings(newPage);
    }
  };


  return (
    <div className={`listings-page ${filterPanelOpen ? 'filter-open' : ''}`}>
      <SearchComponent onSearch={handleSearch} onToggleFilters={toggleFilterPanel} />
      <div className={`filter-panel ${filterPanelOpen ? 'open' : ''}`}>
        <button className="close-button" onClick={toggleFilterPanel}>X</button>
        <div className="filter-content">

          <button className="apply-button" onClick={applyFilters}>Apply</button>
          <button className="clear-button" onClick={clearFilters}>Clear</button>
        </div>
      </div>
      <div className="listings-number">{numberOfListings} listings found</div>
      <div className="listings-grid">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
      {/* Pagination */}
      <div className="pagination-controls">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ListingsPage;
