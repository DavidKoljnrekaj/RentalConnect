import httpClient from './httpClient';
import kitchenImage from '../assets/images/kitchen.jpg';

const ListingService = {
  /**
   * Fetch a single listing by ID
   * @param {string} id - The ID of the listing
   * @returns {Promise<object>} - The listing data
   */
  getListingById: async (id) => {
    
    try {
      const response = await httpClient.get(`/listings/${id}`); // API Gateway route for listings
      return response.data;
    } catch (error) {
      console.error('Error in ListingService.getListingById:', error);
      throw error.response ? error.response.data : error;
    }
    /*
    // Dummy listing data for testing
    return {
      _id: id,
      title: 'Spacious Apartment in the City Center',
      description:
        'A beautiful, fully furnished apartment located in the heart of the city. Close to amenities and public transport.',
      price: {
        monthlyRent: 1200,
        deposit: 2400,
      },
      location: {
        address: '123 Main Street',
        city: 'Zagreb',
        state: 'Zagreb',
        postalCode: '10000',
        coordinates: {
          lat: 45.815,
          lng: 15.9819,
        },
      },
      propertyDetails: {
        type: 'apartment',
        size: 85,
        bedrooms: 2,
        bathrooms: 1,
        furnished: true,
        petsAllowed: false,
      },
      utilities: {
        included: true,
        details: ['Electricity', 'Water', 'Internet'],
      },
      images: [
        'https://via.placeholder.com/600x400?text=Living+Room',
        'https://via.placeholder.com/600x400?text=Bedroom',
        'https://via.placeholder.com/600x400?text=Kitchen',
      ],
      contact: {
        name: 'John Doe',
        phone: '+385 91 123 4567',
        email: 'johndoe@example.com',
      },
      availability: {
        availableFrom: '2024-01-01',
        leaseDuration: '1 year',
      },
      createdAt: '2023-12-01T12:00:00Z',
    };*/
  },

  /**
   * Fetch related listings
   * @param {string} currentListingId - The ID of the current listing
   * @returns {Promise<object[]>} - List of related listings
   */
  getRelatedListings: async (currentListingId) => {
   
    
    try {
      const response = await httpClient.get(`/search/related-listings/${listingId}`);
      return response.data;
    } catch (error) {
      console.error('Error in ListingService.getRelatedListings:', error);
      throw error.response ? error.response.data : error;
    }
    /*
    // Dummy data for testing
    return [
      {
        id: '1',
        title: 'Cozy Studio in Downtown',
        image: kitchenImage,
        price: { monthlyRent: 800 },
      },
      {
        id: '2',
        title: 'Modern Apartment',
        image: kitchenImage,
        price: { monthlyRent: 1200 },
      },
      {
        id: '3',
        title: 'Spacious House',
        image: kitchenImage,
        price: { monthlyRent: 1500 },
      },
      {
        id: '4',
        title: 'Affordable Flat',
        image: kitchenImage,
        price: { monthlyRent: 600 },
      },
    ];*/
  },


getListings: async (filters = {}) => {
  
  try {
    console.log(filters)
    const response = await httpClient.get('/search/short-listings', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error in ListingService.getListings:', error);
    throw error.response ? error.response.data : error;
  }
 
  // Dummy data for testing
  /**const dummyListings = [
    {
      id: '1',
      title: 'Cozy Studio in Downtown',
      image: kitchenImage,
      price: { monthlyRent: 800 },
    },
    {
      id: '2',
      title: 'Modern Apartment',
      image: kitchenImage,
      price: { monthlyRent: 1200 },
    },
    {
      id: '3',
      title: 'Spacious House',
      image: kitchenImage,
      price: { monthlyRent: 1500 },
    },
    {
      id: '4',
      title: 'Affordable Flat',
      image: kitchenImage,
      price: { monthlyRent: 600 },
    },
  ];

  // Apply filters (dummy implementation)
  if (filters.title) {
    return dummyListings.filter((listing) =>
      listing.title.toLowerCase().includes(filters.title.toLowerCase())
    );
  }

  return dummyListings;*/
},

addListing: async (listingData) => {
  try {
    const response = await httpClient.post('/listings', listingData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Optional; browser will set automatically
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding listing:', error);
    throw error.response ? error.response.data : error;
  }
},


getMapListings: async () => {
  try {
    const response = await httpClient.get('/search/map-listings');
    return response.data;
  } catch (error) {
    console.error('Error fetching map listings:', error);
    throw error.response ? error.response.data : error;
  }
},

getFavoritedListings: async () => {
  try {
    const response = await httpClient.get('/listings/favorites');
    return response.data;
  } catch (error) {
    console.error('Error fetching map listings:', error);
    throw error.response ? error.response.data : error;
  }
},

getMyListings: async () => {
  try {
    const response = await httpClient.get('/search/my-listings');
    return response.data;
  } catch (error) {
    console.error('Error fetching my listings:', error);
    throw error.response ? error.response.data : error;
  }
},

getPendingShortListings: async () => {
  try {
    const response = await httpClient.get('/search/pending-short-listings');
    return response.data;
  } catch (error) {
    console.error('Error fetching pending listings:', error);
    throw error.response ? error.response.data : error;
  }
},

/**
   * Approve a listing (Admin only)
   * @param {string} id - The ID of the listing
   * @returns {Promise<void>}
   */
approveListing: async (id) => {
  try {
    await httpClient.patch(`/listings/${id}/approve`); // Call Listing Microservice
  } catch (error) {
    console.error('Error in ListingService.approveListing:', error);
    throw error.response ? error.response.data : error;
  }
},

/**
 * Reject a listing (Admin only)
 * @param {string} id - The ID of the listing
 * @returns {Promise<void>}
 */
rejectListing: async (id) => {
  try {
    await httpClient.patch(`/listings/${id}/reject`); // Call Listing Microservice
  } catch (error) {
    console.error('Error in ListingService.rejectListing:', error);
    throw error.response ? error.response.data : error;
  }
},

addToFavourites: async (listingId) => {
  try {
    await httpClient.post('users/favorites', { listingId });
  } catch (error) {
    console.error('Error adding to favourites:', error);
    throw error.response ? error.response.data : error;
  }
},

removeFromFavourites: async (listingId) => {
  try {
    await httpClient.delete('users/favorites', {
      data: { listingId },
    });
  } catch (error) {
    console.error('Error removing from favourites:', error);
    throw error.response ? error.response.data : error;
  }
},

editListing: async (id, updatedData) => {
  try {
    const response = await httpClient.put(`/listings/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error editing listing:", error);
    throw error;
  }
},


};




export default ListingService;
