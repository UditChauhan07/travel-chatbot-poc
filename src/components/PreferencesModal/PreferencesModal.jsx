import React, { useState } from "react";
import styles from "./PreferencesModal.module.css";
import { IoClose } from "react-icons/io5";
import { searchFlights } from "@/services/api";
const PreferencesModal = ({
  onResults,
  preferences,
  setPreferences,
  onClose,
  onLoading,
  results,
}) => {
  const [originByPreferences, setOriginByPreferences] = useState("");
  const [destinationByPreferences, setDestinationByPreferences] = useState("");
  const getPreferences = localStorage.getItem("flightPreferences");
  const hasSetPreferences = localStorage.getItem("hasSetPreferences");
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
    if (
      originByPreferences.toLowerCase() ===
      destinationByPreferences.toLowerCase()
    &&originByPreferences&&destinationByPreferences) {
      setError("Origin and destination cannot be the same.");
      return; // Prevent form submission
    }
    setError(""); // Clear error if validation passes
    onClose();
    if (
      JSON.stringify(getPreferences) !== JSON.stringify(preferences) &&
      hasSetPreferences == "true"
    ) {
      try {
        onLoading(true);
        console.log("Preferences already set. Searching for flights...");
        const origin = originByPreferences || localStorage.getItem("origin");
        const destination =
          destinationByPreferences || localStorage.getItem("destination");
        const results = await searchFlights({
          origin,
          destination,
          ...(preferences || {}),
        });
        onResults(results);
        onLoading(false);
        onClose();
      } catch (error) {
        console.error("Error during flight search:", error);
        onClose();
        onLoading(false);
        // Optionally, handle the error (e.g., show a message to the user)
      }
    }
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
          {results && (
            <div>
              <div className={styles.formGroup}>
                <label htmlFor="origin">Origin</label>
                <input
                  type="text"
                  id="origin"
                  value={originByPreferences}
                  onChange={(e) => setOriginByPreferences(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="destination">Destination</label>
                <input
                  type="text"
                  id="destination"
                  value={destinationByPreferences}
                  onChange={(e) => setDestinationByPreferences(e.target.value)}
                  required
                />
              </div>
              {error && <p className={styles.error}>{error}</p>}
            </div>
          )}
          <div className={styles.formGroup}>
            <label htmlFor="budget">Budget (USD)</label>
            <input
              type="number"
              id="budget"
              name="budget"
              value={preferences.budget}
              onChange={handleChange}
              required
            />
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
          <button type="button" onClick={handleAddPreferences}>
            Save Preferences
          </button>
        </form>
      </div>
    </div>
  );
};

export default PreferencesModal;
