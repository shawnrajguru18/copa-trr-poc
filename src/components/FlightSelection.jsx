import React, { useState, useEffect } from 'react';
import { amadeusFareSearch } from '../services/mockAPI';
import '../styles/FlightSelection.css';

export default function FlightSelection({ originalPNR, onFlightsSelected, onError }) {
  const [selectedSegments, setSelectedSegments] = useState({});
  const [searchResults, setSearchResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [expandedSegment, setExpandedSegment] = useState(null);

  const numSegments = originalPNR.originalBooking.segments.length;
  const fareClass = originalPNR.originalBooking.segments[0].cabin.substring(0, 1);

  const handleSearchFlights = async (segmentIndex) => {
    console.log('Searching flights for segment:', segmentIndex);
    const segment = originalPNR.originalBooking.segments[segmentIndex];
    const origin = segment.from;
    const destination = segment.to;

    setLoading(true);
    try {
      const result = await amadeusFareSearch(origin, destination, segment.date, fareClass);
      console.log('Search result:', result);
      setSearchResults(prev => ({
        ...prev,
        [segmentIndex]: result.data
      }));
      setExpandedSegment(segmentIndex);
    } catch (error) {
      console.error('Search error:', error);
      onError(`Failed to search flights for segment ${segmentIndex + 1}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFlight = (segmentIndex, flight) => {
    console.log('Selected flight:', flight);
    setSelectedSegments(prev => ({
      ...prev,
      [segmentIndex]: {
        ...flight,
        from: originalPNR.originalBooking.segments[segmentIndex].from,
        to: originalPNR.originalBooking.segments[segmentIndex].to
      }
    }));
  };

  const selectedCount = Object.keys(selectedSegments).length;
  const allSegmentsSelected = selectedCount === numSegments;

  const handleProceed = () => {
    console.log('Proceeding with selected segments:', selectedSegments);
    if (allSegmentsSelected) {
      const flightsArray = [];
      for (let i = 0; i < numSegments; i++) {
        flightsArray.push(selectedSegments[i]);
      }
      onFlightsSelected(flightsArray);
    }
  };

  useEffect(() => {
    console.log('Selected segments updated:', selectedSegments);
    console.log('All selected?', allSegmentsSelected);
  }, [selectedSegments]);

  return (
    <div className="flight-selection">
      <h2>Step 2: Select New Flights</h2>

      <div className="original-itinerary">
        <h3>Original Itinerary:</h3>
        <div className="segments-list">
          {originalPNR.originalBooking.segments.map((segment, idx) => {
            const getFlightLabel = () => {
              if (idx === 0) return 'Outbound Flight';
              if (idx === 1) return 'Return Flight';
              return `Leg ${idx + 1}`;
            };
            return (
            <div key={idx} className="segment-card">
              <div className="segment-header">
                <strong>{getFlightLabel()}:</strong> {segment.from} → {segment.to}
              </div>
              <div className="segment-details">
                <span>{segment.date}</span>
                <span>{segment.flightNumber}</span>
                <span>{segment.departure}</span>
              </div>
            </div>
            );
          })}
        </div>
      </div>

      <div className="new-flights-selection">
        <h3>Select New Flights:</h3>
        {originalPNR.originalBooking.segments.map((segment, idx) => {
          const getFlightLabel = () => {
            if (idx === 0) return 'Outbound Flight';
            if (idx === 1) return 'Return Flight';
            return `Leg ${idx + 1}`;
          };
          return (
          <div key={idx} className="flight-selector">
            <div className="selector-header">
              <h4>{getFlightLabel()} — {segment.from} → {segment.to}</h4>
              <button
                type="button"
                onClick={() => handleSearchFlights(idx)}
                disabled={loading}
                className="search-btn"
              >
                {loading && expandedSegment === idx ? 'Searching...' : 'Search Flights'}
              </button>
            </div>

            {selectedSegments[idx] && (
              <div className="selected-flight highlight">
                <strong>Selected:</strong> {selectedSegments[idx].flightNumber} at {selectedSegments[idx].departure}
                <span className="fare">${selectedSegments[idx].baseFare}</span>
              </div>
            )}

            {searchResults[idx] && (
              <div className="flight-options">
                {searchResults[idx].map((flight, fIdx) => (
                  <div
                    key={fIdx}
                    className={`flight-option ${selectedSegments[idx]?.flightNumber === flight.flightNumber ? 'selected' : ''}`}
                    onClick={() => handleSelectFlight(idx, flight)}
                  >
                    <div className="flight-header">
                      <span className="flight-number">{flight.flightNumber}</span>
                      <span className="date-badge">{originalPNR.originalBooking.segments[idx].date}</span>
                    </div>
                    <div className="flight-details-grid">
                      <div className="detail">
                        <span className="label">Departure:</span>
                        <span className="value">{flight.departure}</span>
                      </div>
                      <div className="detail">
                        <span className="label">Arrival:</span>
                        <span className="value">{flight.arrival}</span>
                      </div>
                      <div className="detail">
                        <span className="label">Aircraft:</span>
                        <span className="value">{flight.aircraft}</span>
                      </div>
                      <div className="detail">
                        <span className="label">Seats Available:</span>
                        <span className="value seats">{flight.seats}</span>
                      </div>
                    </div>
                    <div className="flight-footer">
                      <span className="fare">${flight.baseFare.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
        })}
      </div>

      <div className="action-buttons">
        <button
          onClick={handleProceed}
          disabled={!allSegmentsSelected}
          className="proceed-btn"
        >
          Proceed to Quote Review
        </button>
      </div>
    </div>
  );
}
