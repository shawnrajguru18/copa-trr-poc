import React, { useState, useEffect } from 'react';
import { getCalendarView, rankRecommendations, generateSmartRecommendation } from '../services/smartShopper';
import '../styles/SmartFlightSelection.css';

export default function SmartFlightSelection({ originalPNR, onFlightsSelected, onError }) {
  const [selectedSegments, setSelectedSegments] = useState({});
  const [calendarViews, setCalendarViews] = useState({});
  const [recommendations, setRecommendations] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeSegment, setActiveSegment] = useState(null);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'travelboard'

  const numSegments = originalPNR.originalBooking.segments.length;
  const fareClass = originalPNR.originalBooking.segments[0].cabin;

  const handleSearchFlights = async (segmentIndex) => {
    const segment = originalPNR.originalBooking.segments[segmentIndex];
    setLoading(true);
    setActiveSegment(segmentIndex);

    try {
      // Get calendar view (±3 days)
      const calendar = getCalendarView(
        segment.from,
        segment.to,
        segment.date,
        fareClass,
        3
      );

      setCalendarViews(prev => ({
        ...prev,
        [segmentIndex]: calendar
      }));

      // Generate smart recommendations
      const originalFare = originalPNR.originalBooking.fareDetails.base / numSegments;
      const rec = generateSmartRecommendation(segment, calendar, originalFare);

      setRecommendations(prev => ({
        ...prev,
        [segmentIndex]: rec
      }));
    } catch (error) {
      onError(`Failed to search flights for segment ${segmentIndex + 1}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFlight = (segmentIndex, flight) => {
    console.log('handleSelectFlight called with:', { segmentIndex, flight });
    setSelectedSegments(prev => ({
      ...prev,
      [segmentIndex]: {
        ...flight,
        from: originalPNR.originalBooking.segments[segmentIndex].from,
        to: originalPNR.originalBooking.segments[segmentIndex].to,
        selectedDate: flight.date,
        selectedFlightKey: `${flight.flightNumber}-${flight.date}-${flight.departure}`
      }
    }));
  };

  const selectedCount = Object.keys(selectedSegments).length;
  const allSegmentsSelected = selectedCount === numSegments;

  const handleProceed = () => {
    if (allSegmentsSelected) {
      const flightsArray = [];
      for (let i = 0; i < numSegments; i++) {
        flightsArray.push(selectedSegments[i]);
      }
      onFlightsSelected(flightsArray);
    }
  };

  const getFlightLabel = (idx) => {
    if (idx === 0) return 'Outbound Flight';
    if (idx === 1) return 'Return Flight';
    return `Leg ${idx + 1}`;
  };

  return (
    <div className="smart-flight-selection">
      <h2>Step 2: Smart Flight Selection (Amadeus Ticket Changer Shopper)</h2>

      <div className="shopper-intro">
        <p>📊 Browse available flights by calendar date or explore all options. Our smart ranking highlights the best value alternatives.</p>
      </div>

      <div className="original-itinerary">
        <h3>Original Itinerary:</h3>
        <div className="segments-list">
          {originalPNR.originalBooking.segments.map((segment, idx) => (
            <div key={idx} className="segment-card">
              <div className="segment-header">
                <strong>{getFlightLabel(idx)}:</strong> {segment.from} → {segment.to}
              </div>
              <div className="segment-details">
                <span>{segment.date}</span>
                <span>{segment.flightNumber}</span>
                <span>${(originalPNR.originalBooking.fareDetails.base / numSegments).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flight-selector-section">
        <h3>Find Alternative Flights</h3>
        {originalPNR.originalBooking.segments.map((segment, idx) => (
          <div key={idx} className="flight-selector-container">
            <div className="selector-header">
              <h4>{getFlightLabel(idx)} — {segment.from} → {segment.to}</h4>
              <div className="selector-controls">
                <button
                  type="button"
                  onClick={() => handleSearchFlights(idx)}
                  disabled={loading && activeSegment === idx}
                  className="search-btn"
                >
                  {loading && activeSegment === idx ? '🔍 Searching...' : '🔍 Search Flights'}
                </button>
                {selectedSegments[idx] && (
                  <span className="selection-badge">✓ Selected</span>
                )}
              </div>
            </div>

            {selectedSegments[idx] && (
              <div className="selected-flight">
                <strong>✓ Selected:</strong> {selectedSegments[idx].flightNumber} at {selectedSegments[idx].departure}
                <span className="fare">${selectedSegments[idx].baseFare.toFixed(2)}</span>
              </div>
            )}

            {calendarViews[idx] && (
              <div className="calendar-view">
                <div className="calendar-header">
                  <h5>Calendar View (±3 days)</h5>
                  {recommendations[idx]?.topPick && (
                    <div className="smart-pick">
                      💡 Smart Pick: {recommendations[idx].topPick.flightNumber}
                      <span className="reason">{recommendations[idx].topPick.reasons[0]}</span>
                    </div>
                  )}
                </div>

                <div className="calendar-dates">
                  {Object.entries(calendarViews[idx]).map(([date, flights]) => (
                    <div key={date} className="calendar-date-group">
                      <div className="date-header">
                        {flights[0]?.dateLabel || date}
                      </div>
                      <div className="flights-for-date">
                        {flights.map((flight, fIdx) => {
                          const flightKey = `${flight.flightNumber}-${date}-${flight.departure}`;
                          const isSelected = selectedSegments[idx]?.selectedFlightKey === flightKey;
                          const ranked = recommendations[idx]?.topAlternatives?.find(
                            f => f.flightNumber === flight.flightNumber
                          );
                          const rank = ranked?.rank;

                          return (
                            <div
                              key={flightKey}
                              className={`flight-card ${isSelected ? 'selected' : ''} ${rank === 1 ? 'top-pick' : ''}`}
                              onClick={() => {
                                console.log('Selected flight:', flight.flightNumber);
                                handleSelectFlight(idx, flight);
                              }}
                            >
                              {rank === 1 && <div className="badge-top-pick">🏆 BEST VALUE</div>}
                              {ranked?.badge && rank !== 1 && (
                                <div className={`badge ${ranked.badge.toLowerCase()}`}>
                                  {ranked.badge.replace(/_/g, ' ')}
                                </div>
                              )}

                              <div className="flight-number-badge">
                                {flight.flightNumber}
                              </div>
                              <div className="flight-main">
                                <span className="times">{flight.departure} - {flight.arrival}</span>
                              </div>

                              <div className="flight-details">
                                <span className="aircraft">{flight.aircraft}</span>
                                <span className="seats">{flight.seats} seats</span>
                              </div>

                              <div className="flight-footer">
                                <span className="fare">${flight.baseFare.toFixed(2)}</span>
                                {ranked && (
                                  <div className="recommendation-reason">
                                    {ranked.reasons.map((r, i) => (
                                      <span key={i} className="reason-tag">{r}</span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {recommendations[idx]?.recommendations && (
                  <div className="alternative-recommendations">
                    <h5>Other Great Options</h5>
                    <div className="recommendations-row">
                      {recommendations[idx].recommendations.cheapest && (
                        <div className="alt-option">
                          <span className="label">💰 Cheapest:</span>
                          <span className="flight">{recommendations[idx].recommendations.cheapest.flightNumber}</span>
                          <span className="fare">${recommendations[idx].recommendations.cheapest.baseFare.toFixed(2)}</span>
                        </div>
                      )}
                      {recommendations[idx].recommendations.bestTiming && (
                        <div className="alt-option">
                          <span className="label">⏰ Best Time:</span>
                          <span className="flight">{recommendations[idx].recommendations.bestTiming.flightNumber}</span>
                          <span className="time">{recommendations[idx].recommendations.bestTiming.departure}</span>
                        </div>
                      )}
                      {recommendations[idx].recommendations.mostAvailable && (
                        <div className="alt-option">
                          <span className="label">✈️ High Availability:</span>
                          <span className="flight">{recommendations[idx].recommendations.mostAvailable.flightNumber}</span>
                          <span className="seats">{recommendations[idx].recommendations.mostAvailable.seats} seats</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
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
