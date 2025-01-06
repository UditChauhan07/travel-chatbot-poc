import React from 'react';
import styles from './PreferencesModal.module.css';
const PreferencesModal = ({ preferences, setPreferences, onClose }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
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
          <button type="button" onClick={onClose}>Save Preferences</button>
        </form>
      </div>
    </div>
  );
};

export default PreferencesModal;

