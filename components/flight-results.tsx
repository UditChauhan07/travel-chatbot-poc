// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import type { FlightResponse } from "../types/flight";
import styles from "./Result.module.css";
interface FlightResultsProps {
  results: FlightResponse;
}
export function FlightResults({ results }: FlightResultsProps) {
  return (
    <div className="">
      <div className={styles.summeryCardMain}>
        <div className={styles.summeryCard}>
          <div className={styles.header}>
            <span className={styles.airline}>Summary</span>
          </div>
          <div className={styles.details}>
            <div className={styles.detailRow}>
              <span className={styles.label}>{results.summary}</span>
            </div>
          </div>{" "}
        </div>
      </div>
      <div className={styles.cardMain}>
        {results.suggestions.map((flight, index) => (
          <a
            key={index}
            href={flight.bookingLink}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.cardLink} // Add CSS for styling the link
          >
            <div key={index} className={styles.card}>
              <div className={styles.header}>
                <span className={styles.airline}>{flight.airline}</span>
                <span className={styles.price}>{flight.price}</span>
              </div>
              <div className={styles.details}>
                <div className={styles.detailRow}>
                  <span className={styles.label}>Flight:</span>
                  <span className={styles.value}>{flight.flightNumber}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.label}>Departure:</span>
                  <span className={styles.value}>{flight.departure}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.label}>Arrival:</span>
                  <span className={styles.value}>{flight.arrival}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.label}>Duration:</span>
                  <span className={styles.value}>{flight.duration}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.label}>Class:</span>
                  <span className={styles.value}>{flight.class}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.label}>Booking Link:</span>
                  <span className={styles.value}>{flight.bookingLink}</span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
