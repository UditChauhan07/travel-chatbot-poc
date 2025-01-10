"use client";
import React, { useState, useEffect } from "react";
// import Layout from './components/Layout/Layout';
import FlightSearchForm from "./components/FlightSearchForm/FlightSearchForm";
import { FlightResults } from "../components/flight-results";
import PreferencesModal from "./components/PreferencesModal/PreferencesModal";
import QueryForm from "./components/QueryForm/QueryForm";
import styles from "./App.module.css";
import { IoChevronBackCircleSharp } from "react-icons/io5";
import { RotatingLines } from "react-loader-spinner";
function App() {
  const [results, setResults] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [loading, setLoading] = useState();
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
    try {
      setLoading(true);
      setResults(data);
      setHasError(false);
      setTimeout(() => {
        setLoading(false);
      }, 200);
    } catch (error) {
      setLoading(false);
      window.location.reload();
    }
  };
  const handleClosePreferences = () => {
    setShowPreferences(false);
    localStorage.setItem("hasSetPreferences", "true");
  };
  const handleResetPreferences = () => {
    setShowPreferences(true);
    // localStorage.removeItem("hasSetPreferences");
  };
  const handleBack = () => {
    window.location.reload();
  };
  const handleLoading = () => {
    setLoading(true);
  };
  //updatePreferences
  const updatePreferences = (newPreferences) => {
    setPreferences((prevPreferences) => ({
      ...prevPreferences,
      ...newPreferences,
    }));
  };

  return (
    // <Layout>
    <>
      {/* {results && (
        <div className={styles.backBtn}>
          <button onClick={handleBack}>
            {" "}
            <IoChevronBackCircleSharp className={styles.backBtnIcon} />
            Back
          </button>
        </div>
      )} */}
      <h1 className={styles.title}>AI Flight Assistant</h1>
      {/* {results === null && (
        <FlightSearchForm
          onResults={handleResults}
          preferences={preferences}
          onLoading={handleLoading}
          updatePreferences={updatePreferences}
        />
      )} */}
      <div className={styles.chatDivMain}>
        <div className={styles.chatDiv}>
          {/* {preferences && loading ? (
            <div className={styles.resultlLoader}>
              {" "}
              <RotatingLines
                visible={true}
                height="80"
                width="80"
                strokeColor="black"
                strokeWidth="5"
                animationDuration="0.75"
                ariaLabel="rotating-lines-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            </div>
          ) : (
            preferences && <FlightResults results={results} />
          )} */}
          {preferences && <QueryForm flightResults={results}      preferences={preferences} />}
        </div>{" "}
      </div>
      {preferences && (
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
          onLoading={handleLoading}
          results={results}
        />
      )}
    </>
    // </Layout>
  );
}
export default App;
