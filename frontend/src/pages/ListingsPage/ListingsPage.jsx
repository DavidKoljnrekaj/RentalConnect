import React, { useState, useEffect } from 'react';
import ListingService from '../../services/listingService';
import ListingCard from '../../components/shared/ListingCard/ListingCard';
import SearchComponent from '../../components/shared/Search/SearchComponent';
import './ListingsPage.css';

const ListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [numberOfListings, setNumberOfListings] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);


  const [filters, setFilters] = useState({
    city: '',
    type: '',
    minPrice: '',
    maxPrice: '',
  });

  const PAGE_SIZE = 12; // Number of listings per page

  // Dropdown and combobox options
  const propertyTypes = ['Apartment', 'House', 'Studio', 'Office'];
  const cities = ['Zagreb', 'Split', 'Rijeka', 'Osijek', 'Zadar'];

  // Fetch listings based on filters and pagination
  const fetchListings = async (page) => {
    try {
      const response = await ListingService.getListings({
        ...filters,
        page,
        limit: PAGE_SIZE,
      });
      setListings(response.listings);
      setTotalPages(response.totalPages);
      setNumberOfListings(response.total)
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    setFilterPanelOpen(false);
    fetchListings(1); // Reset to page 1 when applying filters
  };

  const clearFilters = () => {
    setFilters({
      city: '',
      type: '',
      minPrice: '',
      maxPrice: '',
    });
    fetchListings(1);
    setFilterPanelOpen(false);
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
    <h3>Filters</h3>
    {/* City Combobox */}
    <label>City</label>
    <input
      list="cities"
      name="city"
      value={filters.city}
      onChange={handleFilterChange}
    />
    <datalist id="cities">
      {cities.map((city) => (
        <option key={city} value={city} />
      ))}
    </datalist>

    {/* Type Dropdown */}
    <label>Type</label>
    <select
      name="type"
      value={filters.type}
      onChange={handleFilterChange}
    >
      <option value="">Select Type</option>
      {propertyTypes.map((type) => (
        <option key={type} value={type}>
          {type}
        </option>
      ))}
    </select>

    {/* Price Fields */}
    <label>Min Price</label>
    <input
      type="number"
      name="minPrice"
      value={filters.minPrice}
      onChange={handleFilterChange}
    />
    <label>Max Price</label>
    <input
      type="number"
      name="maxPrice"
      value={filters.maxPrice}
      onChange={handleFilterChange}
    />

    {/* Buttons */}
    <div className="button-container">
      <button className="apply-button" onClick={applyFilters}>Apply</button>
      <button className="clear-button" onClick={clearFilters}>Clear</button>
    </div>
  </div>
</div>

    {/* Listings Counter */}
    <div className="listings-number">{numberOfListings} listings found</div>

    {/* Listings Grid */}
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
