import React, { useEffect } from "react";
import styles from "./PreferencesModal.module.css";
import { IoClose } from "react-icons/io5";
import { searchFlights } from "@/services/api";
const PreferencesModal = ({
  onResults,
  preferences,
  setPreferences,
  onClose,
}) => {
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
  const getPreferences = localStorage.getItem("flightPreferences");
  const handleAddPreferences = async () => {
    onClose();
    if (JSON.stringify(getPreferences) !== JSON.stringify(preferences)) {
      try {
        console.log("Preferences already set. Searching for flights...");
        const origin = localStorage.getItem("origin");
        const destination = localStorage.getItem("destination");
        const results = await searchFlights({
          origin,
          destination,
          ...(preferences || {}),
        });
        onResults(results);
        onClose();
      } catch (error) {
        console.error("Error during flight search:", error);
        onClose();
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
