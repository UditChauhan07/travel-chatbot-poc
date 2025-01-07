"use client";
import React, { useState } from "react";
import { searchFlights } from "../../services/api";
import styles from "./FlightSearchForm.module.css";
import { FaPlane } from "react-icons/fa";
import { RotatingLines } from "react-loader-spinner";
const FlightSearchForm = ({ onResults, preferences = {} }) => {
  console.log(preferences, "preferences-->");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      const results = await searchFlights({
        origin,
        destination,
        ...(preferences || {}),
      });
      localStorage.setItem("origin", origin);
      localStorage.setItem("destination", destination);
      onResults(results);
    } catch (error) {
      console.error("Error searching flights:", error);
      // Handle error (e.g., show error message to user)
    } finally {
      setLoading(false);
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
        <div className={styles.dateInfo}>
          <p>Departure: {preferences.departureDate}</p>
          {preferences.isReturnFlight && (
            <p>Return: {preferences.returnDate}</p>
          )}
        </div>
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
