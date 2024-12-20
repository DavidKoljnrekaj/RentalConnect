import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; // Import AuthContext
import "../AddListing/AddListing.css"; // Reuse the styles from AddListing
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import ListingService from "../../services/listingService";

const EditListing = () => {
  const { id } = useParams(); // Get listing ID from URL
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const data = await ListingService.getListingById(id);
        if (data.createdBy !== userId) {
          alert("You are not authorized to edit this listing.");
          navigate("/"); // Redirect to home or another page
        } else {
          setFormData({
            ...data,
            existingImages: data.images || [], // Populate existingImages with GCS links
          });
        }
      } catch (error) {
        console.error("Error fetching listing:", error);
        navigate("/"); // Redirect if an error occurs
      }
    };
    fetchListing();
  }, [id, userId, navigate]);

  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: { monthlyRent: "", deposit: "" },
    location: { address: "", city: "", state: "", postalCode: "", coordinates: { lat: null, lng: null } },
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
    existingImages: [], // Array for existing images
    contact: { name: "", phone: "", email: "" },
    availability: { availableFrom: "", leaseDuration: "" },
  });


  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prevData) => ({
      ...prevData,
      images: [...prevData.images, ...files],
    }));
  };

  const handleRemoveExistingImage = (imageUrl) => {
    setFormData((prevData) => ({
      ...prevData,
      existingImages: prevData.existingImages.filter((img) => img !== imageUrl),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("price.")) {
      const key = name.split(".")[1];
      setFormData({ ...formData, price: { ...formData.price, [key]: value } });
    } else if (name.includes("location.")) {
      const key = name.split(".")[1];
      setFormData({
        ...formData,
        location: { ...formData.location, [key]: value },
      });
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

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toISOString().split("T")[0]; // Extract "yyyy-MM-dd"
  };

  const LocationSelector = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        setFormData((prevData) => ({
          ...prevData,
          location: { ...prevData.location, coordinates: { lat, lng } },
        }));
      },
    });
    return null;
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.location.coordinates.lat || !formData.location.coordinates.lng) {
      alert("Please select a location on the map.");
      return;
    }

    const formDataToSend = new FormData();

    // Add new images
    formData.images.forEach((file) => {
      formDataToSend.append("images", file);
    });

    // Add existing images
    formData.existingImages.forEach((imageUrl) => {
      formDataToSend.append("existingImages", imageUrl);
    });

    // Add other fields
    const appendNestedData = (prefix, data) => {
      if (typeof data === "object" && data !== null && !Array.isArray(data)) {
        Object.entries(data).forEach(([key, value]) => {
          appendNestedData(`${prefix}.${key}`, value);
        });
      } else {
        formDataToSend.append(prefix, data);
      }
    };

    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "images" && key !== "existingImages") {
        appendNestedData(key, value);
      }
    });

    try {
      const updatedListing = await ListingService.editListing(id, formDataToSend);
      alert("Listing updated successfully!");
      console.log(updatedListing);
    } catch (error) {
      console.error("Error updating listing:", error);
      alert("Failed to update listing.");
    }
  };

  return (
    <div className="add-listing-container">
      <h2 className="page-title">Edit Listing</h2>
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
          <label>Existing Images</label>
          <div className="existing-images">
            {formData.existingImages.map((imageUrl, index) => (
              <div key={index} className="image-container">
                <img src={imageUrl} alt={`Listing image ${index + 1}`} className="listing-image" />
                <button
                  type="button"
                  className="remove-image-button"
                  onClick={() => handleRemoveExistingImage(imageUrl)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <label>Upload New Images</label>
          <input type="file" multiple onChange={handleImageUpload} />
        </div>

        <div className="form-group inline">
          <label>Available From</label>
          <input
            type="date"
            name="availability.availableFrom"
            value={formatDate(formData.availability.availableFrom)}
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
        <h3>Select Location on Map</h3>
        <MapContainer
          center={
            formData.location.coordinates.lat && formData.location.coordinates.lng
              ? [formData.location.coordinates.lat, formData.location.coordinates.lng]
              : [45.815, 15.9819] // Default center
          }
          zoom={12}
          scrollWheelZoom={true}
          style={{ height: "300px", marginBottom: "1rem" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
          />
          <LocationSelector />
          {formData.location.coordinates.lat && formData.location.coordinates.lng && (
            <Marker position={[formData.location.coordinates.lat, formData.location.coordinates.lng]} />
          )}
        </MapContainer>

        <button type="submit" className="submit-button">
          Update Listing
        </button>
      </form>
    </div>
  );
};

export default EditListing;
