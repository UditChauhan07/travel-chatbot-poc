"use client";
import React, { useState, useEffect } from "react";
// import Layout from './components/Layout/Layout';
import FlightSearchForm from "./components/FlightSearchForm/FlightSearchForm";
import { FlightResults } from "../components/flight-results";
import PreferencesModal from "./components/PreferencesModal/PreferencesModal";
import QueryForm from "./components/QueryForm/QueryForm";
import styles from "./App.module.css";
import { IoChevronBackCircleSharp } from "react-icons/io5";
function App() {
  const [results, setResults] = useState(null);
  const [hasError, setHasError] = useState(false); 
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    budget: "",
    class: "economy",
    departureDate: "",
    isReturnFlight: false,
    returnDate: "",
    directFlight: false,
    flexibleDates: false,
  });
  useEffect(() => {
    // This ensures the code runs only on the client-side
    const savedPreferences = localStorage.getItem("flightPreferences");
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);
  useEffect(() => {
    const hasSetPreferences = localStorage.getItem("hasSetPreferences");
    if (!hasSetPreferences) {
      setShowPreferences(true);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("flightPreferences", JSON.stringify(preferences));
  }, [preferences]);
  const handleResults = (data) => {

    setResults(data);
    setHasError(false);
  };

  const handleClosePreferences = () => {
    setShowPreferences(false);
    localStorage.setItem("hasSetPreferences", "true");
    
  };
  const handleResetPreferences = () => {
    setShowPreferences(true);
    localStorage.removeItem("hasSetPreferences");
  };
  const handleBack = () => {
    window.location.reload();
  };
  return (
    // <Layout>
    <>
      {results && (
        <div className={styles.backBtn}>
          <button onClick={handleBack}>
            {" "}
            <IoChevronBackCircleSharp className={styles.backBtnIcon} />
            Back
          </button>
        </div>
      )}
      <h1 className={styles.title}>AI Flight Assistant</h1>
      {results === null && (
        <FlightSearchForm
          onResults={handleResults}
          preferences={preferences}
          // onResetPreferences={handleResetPreferences}
        />
      )}

      {results && <FlightResults results={results} />}
      {results && <QueryForm flightResults={results} />}
      {results && (
        <div className={styles.resetPreferencesButton}>
          {" "}
          <button
            type="button"
            // onClick={onResetPreferences}
            onClick={handleResetPreferences}
            className={styles.resetButton}
          >
            Reset Preferences
          </button>
        </div>
      )}
      {showPreferences && (
        <PreferencesModal
        onResults={handleResults}
          preferences={preferences}
          setPreferences={setPreferences}
          onClose={handleClosePreferences}
        />
      )}
    </>
    // </Layout>
  );
}
export default App;
