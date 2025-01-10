import React, { useState } from "react";
import styles from "./PreferencesModal.module.css";
import { IoClose } from "react-icons/io5";
import { searchFlights } from "@/services/api";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
const API_MAP_URL = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;
console.log(API_MAP_URL, "API_MAP_URL--->");
const PreferencesModal = ({
  onResults,
  preferences,
  setPreferences,
  onClose,
  onLoading,
  results,
}) => {
  const [error, setError] = useState("");
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // If the return date is being updated, check the validation
    if (name === "returnDate" && preferences.departureDate) {
      const departureDate = new Date(preferences.departureDate);
      const returnDate = new Date(value);
      // Compare dates and show alert if return date is earlier than departure date
      if (returnDate < departureDate) {
        alert("Return date should be later than departure date.");
        return; // Exit the function early if the validation fails
      }
    }
    setPreferences((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleAddPreferences = async () => {
    // Check if origin matches destination
    // if (
    //   preferences.origin.toLowerCase() ===
    //     preferences.destination.toLowerCase() &&
    //   preferences.destination &&
    //   preferences.origin
    // ) {
    //   setError("Origin and destination cannot be the same.");
    //   return; // Prevent form submission
    // }
    // setError(""); // Clear error if validation passes
    onClose();
    // if (
    //   JSON.stringify(getPreferences) !== JSON.stringify(preferences) &&
    //   hasSetPreferences == "true"
    // ) {
    //   try {
    //     onLoading(true);
    //     console.log("Preferences already set. Searching for flights...");
    //     const origin = originByPreferences || localStorage.getItem("origin");
    //     const destination =
    //       destinationByPreferences || localStorage.getItem("destination");
    //     // const results = await searchFlights({
    //     //   origin,
    //     //   destination,
    //     //   ...(preferences || {}),
    //     // });
    //     onResults(results);
    //     onLoading(false);
    //     onClose();
    //   } catch (error) {
    //     console.error("Error during flight search:", error);
    //     onClose();
    //     onLoading(false);
    //     // Optionally, handle the error (e.g., show a message to the user)
    //   }
    // }
  };
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div>
          <h3 onClick={onClose}>
            <IoClose className={styles.closeIcon} />
          </h3>
        </div>
        <h2>Set Your Travel Preferences</h2>
        <form>
          {/* <div>
            <div className={styles.formGroup}>
              <label htmlFor="origin">Origin</label>
              <>
                <input
                  type="text"
                  id="origin"
                  value={preferences.origin}
                  onChange={handleChange}
                  required
                  name="origin"
                />
              </>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="destination">Destination</label>
              <>
                <input
                  type="text"
                  id="destination"
                  value={preferences.destination}
                  onChange={handleChange}
                  required
                  name="destination"
                />
              </>
            </div>
            {error && <p className={styles.error}>{error}</p>}
          </div> */}

          <div className={styles.formGroup}>
            <label htmlFor="budget">Budget Range</label>
            <input
              type="text"
              id="budget"
              name="budget"
              value={preferences.budget}
              onChange={handleChange}
              required
              placeholder="Enter your budget"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="budgetType">Budget Type</label>
            <select
              id="budgetType"
              name="budgetType"
              value={preferences.budgetType}
              onChange={handleChange}
              required
              className={styles.selectDropdown}
            >
              <option value="" disabled>
                Select Budget Type
              </option>
              <option value="domestic flight">Domestic flight</option>
              <option value="international flight">International flight</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="live">Where do you live</label>
            <>
              <input
              type="text"
              id="live"
              name="live"
              value={preferences.live}
              onChange={handleChange}
              required
            />
              {/* <GooglePlacesAutocomplete
                apiKey={API_MAP_URL}
                selectProps={{
                  onChange: (place) => console.log(place),
                }}
              /> */}
            </>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="class">Preferred Class</label>
            <select
              id="class"
              name="class"
              value={preferences.class}
              onChange={handleChange}
              className={styles.selectDropdown}
            >
              <option value="economy">Economy</option>
              <option value="business">Business</option>
              <option value="first">First Class</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="departureDate">Departure Date</label>
            <input
              type="date"
              id="departureDate"
              name="departureDate"
              value={preferences.departureDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>
              <input
                type="checkbox"
                name="isReturnFlight"
                checked={preferences.isReturnFlight}
                onChange={handleChange}
              />
              Return Flight
            </label>
          </div>
          {preferences.isReturnFlight && (
            <div className={styles.formGroup}>
              <label htmlFor="returnDate">Return Date</label>
              <input
                type="date"
                id="returnDate"
                name="returnDate"
                value={preferences.returnDate}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <div className={styles.formGroup}>
            <label>
              <input
                type="checkbox"
                name="directFlight"
                checked={preferences.directFlight}
                onChange={handleChange}
              />
              Prefer Direct Flights
            </label>
          </div>
          <div className={styles.formGroup}>
            <label>
              <input
                type="checkbox"
                name="flexibleDates"
                checked={preferences.flexibleDates}
                onChange={handleChange}
              />
              Flexible Dates
            </label>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="flyType">Do you fly for Business</label>
            <select
              id="flyType"
              name="flyType"
              value={preferences.flyType}
              onChange={handleChange}
              required
              className={styles.selectDropdown}
            >
              <option value="" disabled>
                Select
              </option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <button type="button" onClick={handleAddPreferences}>
            Save Preferences
          </button>
        </form>
      </div>
    </div>
  );
};

export default PreferencesModal;
