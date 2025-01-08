"use client";
import React, { useState } from "react";
import { searchFlights } from "../../services/api";
import styles from "./FlightSearchForm.module.css";
import { FaPlane } from "react-icons/fa";
import { RotatingLines } from "react-loader-spinner";
const FlightSearchForm = ({
  onResults,
  preferences = {},
  onLoading,
  updatePreferences,
}) => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  function formatDate(dateString) {
    const date = new Date(dateString);

    // Array of month names in shortened form
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Array of weekday names
    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    // Get day, month, year, and weekday
    const day = date.getDate();
    const month = months[date.getMonth()]; // Get month name (abbreviated)
    const year = date.getFullYear();
    const weekday = weekdays[date.getDay()]; // Get the day of the week

    // Return formatted string
    return `${day} ${month} ${year} ${weekday}`;
  }

  const handleSubmit = async (e) => {
    // Check if origin matches destination
    if (origin.toLowerCase() === destination.toLowerCase()) {
      setError("Origin and destination cannot be the same.");
      return; // Prevent form submission
    }
    setError(""); // Clear error if validation passes
    e.preventDefault();
    setLoading(true);
    try {
      onLoading(true);
      const results = await searchFlights({
        origin,
        destination,
        ...(preferences || {}),
      });
      localStorage.setItem("origin", origin);
      localStorage.setItem("destination", destination);
      onResults(results);

      onLoading(false);

      setLoading(false);
    } catch (error) {
      console.error("Error searching flights:", error);
      // Handle error (e.g., show error message to user)
    } finally {
      setLoading(false);
      onLoading(false);
    }
  };
  return (
    <div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h3 className={styles.title1}>
          <FaPlane
            style={{
              transform: "rotate(-30deg)",
              transition: "transform 0.3s ease",
            }}
          />
          Find Your Perfect Flight
        </h3>
        <div className={styles.formGroup}>
          <label htmlFor="origin">Origin</label>
          <input
            type="text"
            id="origin"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="destination">Destination</label>
          <input
            type="text"
            id="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.formGroup}>
          <label htmlFor="Departure">Departure</label>
          {preferences.departureDate ? (
            <>
              {" "}
              <input
                type="date"
                value={preferences.departureDate}
                onChange={(e) => {
                  // Handle the date change and update the state
                  const updatedDate = e.target.value;
                  // Assuming you have a function to update preferences
                  updatePreferences({
                    ...preferences,
                    departureDate: updatedDate,
                  });
                }}
                placeholder="Select a departure date"
              />
            </>
          ) : (
            <>
              <input
                type="date"
                onChange={(e) => {
                  // Handle the date change and update the state
                  const updatedDate = e.target.value;
                  // Assuming you have a function to update preferences
                  updatePreferences({
                    ...preferences,
                    departureDate: updatedDate,
                  });
                }}
                placeholder="Select a departure date"
              />
            </>
          )}
        </div>

        {preferences.isReturnFlight && preferences.returnDate && (
          <p>
            Return:
            <b className={styles.blodFont}>
              {" "}
              {formatDate(preferences.returnDate)}
            </b>
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? (
            <div className={styles.loading}>
              <RotatingLines
                visible={true}
                height="20"
                width="20"
                strokeColor="white"
                strokeWidth="5"
                animationDuration="0.75"
                ariaLabel="rotating-lines-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
              Searching...
            </div>
          ) : (
            "Search Flights"
          )}
        </button>
      </form>
    </div>
  );
};

export default FlightSearchForm;
