"use client";
import React from "react";
import { useState } from "react";
import { askQuery } from "../../services/api";
import styles from "./QueryForm.module.css";
import { RotatingLines } from "react-loader-spinner";

const QueryForm = ({ flightResults }) => {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  // const cleanResponse = (response) => {
  //   // Remove unwanted text using regex
  //   return response.replace(/\*\*.*?\*\*/g, "").trim(); // Removes text wrapped in double asterisks
  // };
  const cleanResponse = (response) => {
    // Remove text wrapped in double asterisks
    let cleaned = response.replace(/\*\*.*?\*\*/g, "").trim();
    
    // Replace each '*' with <li> wrapped in <ul> to create a list
    cleaned = cleaned.replace(/\*/g, "<br />");
  
    // Optionally, wrap content in <p> for paragraphs
    cleaned = `<p>${cleaned.replace(/<br \/>/g, "</p><p>")}</p>`;
  
    return cleaned;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await askQuery(query, flightResults);
      const cleanedResponse = cleanResponse(response);
      setAnswer(cleanedResponse);
    } catch (error) {
      console.error("Error asking query:", error);
      setAnswer(
        "Sorry, there was an error processing your query. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.queryMain}>
      <div className={styles.queryForm}>
        <h3>Have a question about your flight options?</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question about your flight options..."
            required
          />
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
                Asking...
              </div>
            ) : (
              "Ask"
            )}
          </button>
        </form>
        {answer && (
          <div className={styles.answer}>
            <h4>Answer:</h4>
            <p dangerouslySetInnerHTML={{ __html: answer }} />

          </div>
        )}
      </div>
    </div>
  );
};

export default QueryForm;
