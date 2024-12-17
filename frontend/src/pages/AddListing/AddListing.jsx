import React, { useState } from "react";
import "./AddListing.css";
import ListingService from "../../services/listingService";

const AddListing = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: { monthlyRent: "", deposit: "" },
    location: { address: "", city: "", state: "", postalCode: "" },
    propertyDetails: {
      type: "apartment",
      size: "",
      bedrooms: "",
      bathrooms: "",
      furnished: false,
      petsAllowed: false,
    },
    utilities: {
      included: false,
      details: "",
    },
    images: [],
    contact: { name: "", phone: "", email: "" },
    availability: { availableFrom: "", leaseDuration: "" },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name.includes("price.")) {
      const key = name.split(".")[1];
      setFormData({ ...formData, price: { ...formData.price, [key]: value } });
    } else if (name.includes("location.")) {
      const key = name.split(".")[1];
      setFormData({ ...formData, location: { ...formData.location, [key]: value } });
    } else if (name.includes("propertyDetails.")) {
      const key = name.split(".")[1];
      setFormData({
        ...formData,
        propertyDetails: { ...formData.propertyDetails, [key]: value },
      });
    } else if (name.includes("utilities.")) {
      const key = name.split(".")[1];
      setFormData({ ...formData, utilities: { ...formData.utilities, [key]: value } });
    } else if (name.includes("availability.")) {
      const key = name.split(".")[1];
      setFormData({ ...formData, availability: { ...formData.availability, [key]: value } });
    } else if (name.includes("contact.")) {
      const key = name.split(".")[1];
      setFormData({ ...formData, contact: { ...formData.contact, [key]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Create a FormData object
    const formDataToSend = new FormData();
  
    // Append images
    formData.images.forEach((file) => {
      formDataToSend.append('images', file);
    });
  
    // Append the rest of the fields
    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === 'object' && !Array.isArray(value)) {
        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
          formDataToSend.append(`${key}.${nestedKey}`, nestedValue);
        });
      } else if (key !== 'images') {
        formDataToSend.append(key, value);
      }
    });
  
    try {
      const newListing = await ListingService.addListing(formDataToSend);
      alert('Listing added successfully!');
      console.log(newListing);
    } catch (error) {
      console.error('Error adding listing:', error);
      alert('Failed to add listing.');
    }
  };
  

  return (
    <div className="add-listing-container">
      <h2 className="page-title">Add New Listing</h2>
      <form className="add-listing-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <h3>Pricing</h3>

        <div className="form-group inline">
          <label>Monthly Rent</label>
          <input
            type="number"
            name="price.monthlyRent"
            value={formData.price.monthlyRent}
            onChange={handleChange}
            required
          />

          <label>Deposit</label>
          <input
            type="number"
            name="price.deposit"
            value={formData.price.deposit}
            onChange={handleChange}
            required
          />
        </div>

        <h3>Address</h3>

        <div className="form-group inline">
          <label>Address</label>
          <input
            type="text"
            name="location.address"
            value={formData.location.address}
            onChange={handleChange}
            required
          />

          <label>City</label>
          <input
            type="text"
            name="location.city"
            value={formData.location.city}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group inline">
          <label>State</label>
          <input
            type="text"
            name="location.state"
            value={formData.location.state}
            onChange={handleChange}
          />

          <label>Postal Code</label>
          <input
            type="text"
            name="location.postalCode"
            value={formData.location.postalCode}
            onChange={handleChange}
          />
        </div>

        <h3>Details</h3>

        <div className="form-group inline">
          <label>Type</label>
          <select
            name="propertyDetails.type"
            value={formData.propertyDetails.type}
            onChange={handleChange}
          >
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="studio">Studio</option>
          </select>

          <label>Size (sqm)</label>
          <input
            type="number"
            name="propertyDetails.size"
            value={formData.propertyDetails.size}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group inline">
          <label>Bedrooms</label>
          <input
            type="number"
            name="propertyDetails.bedrooms"
            value={formData.propertyDetails.bedrooms}
            onChange={handleChange}
            required
          />

          <label>Bathrooms</label>
          <input
            type="number"
            name="propertyDetails.bathrooms"
            value={formData.propertyDetails.bathrooms}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group inline">
          <label className="checkbox">
            <input
              type="checkbox"
              name="propertyDetails.furnished"
              checked={formData.propertyDetails.furnished}
              onChange={() =>
                setFormData({
                  ...formData,
                  propertyDetails: {
                    ...formData.propertyDetails,
                    furnished: !formData.propertyDetails.furnished,
                  },
                })
              }
            />
            Furnished
          </label>


          <label className="checkbox">
            <input
              label="Pets Allowed"
              type="checkbox"
              name="propertyDetails.petsAllowed"
              checked={formData.propertyDetails.petsAllowed}
              onChange={() =>
                setFormData({
                  ...formData,
                  propertyDetails: {
                    ...formData.propertyDetails,
                    petsAllowed: !formData.propertyDetails.petsAllowed,
                  },
                })
              }
            />
            Pets Allowed
          </label>



          <label className="checkbox">
          <input
            type="checkbox"
            name="utilities.included"
            checked={formData.utilities.included}
            onChange={() =>
              setFormData({
                ...formData,
                utilities: {
                  ...formData.utilities,
                  included: !formData.utilities.included,
                },
              })
            }
          />
          Utilities Included
          </label>
        </div>

        <div className="form-group">
          <label>Utilities Details</label>
          <input
            type="text"
            name="utilities.details"
            value={formData.utilities.details}
            onChange={handleChange}
            disabled={formData.utilities.included} 
            placeholder={
              !formData.utilities.included
                ? "Provide utility details (e.g., water, electricity, price)"
                : "Enable to provide details"
            }
          />
        </div>  

        <div className="form-group">
          <label>Images</label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
          />
        </div>

        <div className="form-group inline">
          <label>Available From</label>
          <input
            type="date"
            name="availability.availableFrom"
            value={formData.availability.availableFrom}
            onChange={handleChange}
            required
          />

          <label>Lease Duration</label>
          <input
            type="text"
            name="availability.leaseDuration"
            value={formData.availability.leaseDuration}
            onChange={handleChange}
            required
          />
        </div>

        <h3>Contact</h3>

        <div className="form-group inline">
          <label>Name</label>
          <input
            type="text"
            name="contact.name"
            value={formData.contact.name}
            onChange={handleChange}
            required
          />

          <label>Phone</label>
          <input
            type="text"
            name="contact.phone"
            value={formData.contact.phone}
            onChange={handleChange}
            required
          />
        
          <label>Email</label>
          <input
            type="email"
            name="contact.email"
            value={formData.contact.email}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Add Listing
        </button>
      </form>
    </div>
  );
};

export default AddListing;
