const axios = require('axios');

const ListingService = {
  getShortListings: async (listingIds) => {
    try {
      console.log(`${process.env.SEARCH_SERVICE_URL}/search/short-listings`);
      console.log(listingIds)
      const response = await axios.post(`${process.env.SEARCH_SERVICE_URL}/search/short-listings`, {
        listingIds: listingIds,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching short listings:', error.message);
      throw error;
    }
  },
};

module.exports = ListingService;
