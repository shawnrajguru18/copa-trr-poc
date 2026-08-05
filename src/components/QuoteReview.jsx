import React, { useEffect, useState } from 'react';
import { calculateNewQuote, validateNetting } from '../services/nettingEngine';
import '../styles/QuoteReview.css';

export default function QuoteReview({ originalPNR, newFlights, onApprove, onRevise }) {
  const [calculation, setCalculation] = useState(null);
  const [validation, setValidation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedAmountDue, setEditedAmountDue] = useState('');

  useEffect(() => {
    const fareClass = originalPNR.originalBooking.segments[0].cabin.substring(0, 1);
    const calc = calculateNewQuote(newFlights, originalPNR.originalBooking, fareClass);
    setCalculation(calc);
    setEditedAmountDue(calc.amountDue);

    const val = validateNetting(calc);
    setValidation(val);
    setLoading(false);
  }, [originalPNR, newFlights]);

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setEditedAmountDue(calculation.amountDue);
    }
  };

  const handleApproveWithOverride = () => {
    const finalCalculation = {
      ...calculation,
      amountDue: editedAmountDue,
      agentOverride: editedAmountDue !== calculation.amountDue
    };
    onApprove(finalCalculation);
  };

  if (loading || !calculation) {
    return <div className="loading">Calculating netting...</div>;
  }

  const orig = calculation.originalQuote;
  const newQuote = calculation.newQuote;
  const netting = calculation.netting;

  return (
    <div className="quote-review">
      <h2>Step 3: Review Calculated Quote & Netting</h2>

      {!validation.isValid && (
        <div className="warning">
          <strong>⚠️ Validation Issues:</strong>
          <ul>
            {validation.issues.map((issue, idx) => (
              <li key={idx}>{issue}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="quote-comparison">
        <div className="quote-section original">
          <h3>Original Ticket</h3>
          <div className="fare-breakdown">
            <div className="fare-line">
              <span>Base Fare:</span>
              <span>${orig.baseFare}</span>
            </div>
            <div className="tax-detail">
              <span className="label">Taxes:</span>
              <div className="tax-list">
                {Object.entries(orig.taxes).map(([code, amount]) => (
                  <div key={code} className="tax-item">
                    <span>{code}:</span>
                    <span>${parseFloat(amount).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="fare-line total">
              <span>Total Paid:</span>
              <span>${orig.total}</span>
            </div>
          </div>
        </div>

        <div className="quote-section new">
          <h3>New Ticket</h3>
          <div className="fare-breakdown">
            <div className="fare-line">
              <span>Base Fare:</span>
              <span>${newQuote.baseFare}</span>
            </div>
            <div className="tax-detail">
              <span className="label">Taxes:</span>
              <div className="tax-list">
                {Object.entries(newQuote.taxes).map(([code, amount]) => (
                  <div key={code} className="tax-item">
                    <span>{code}:</span>
                    <span>${parseFloat(amount).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="fare-line total">
              <span>Total New:</span>
              <span>${newQuote.total}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="netting-calculation">
        <h3>Netting Calculation (Core Engine)</h3>
        <div className="netting-detail">
          <div className="netting-line">
            <span>Fare Difference:</span>
            <span className={parseFloat(netting.fareDifference) > 0 ? 'debit' : 'credit'}>
              ${Math.abs(parseFloat(netting.fareDifference)).toFixed(2)} {parseFloat(netting.fareDifference) > 0 ? '(+)' : '(-)'}
            </span>
          </div>
          <div className="netting-line">
            <span>Change Fee:</span>
            <span className="debit">${parseFloat(netting.changeFee).toFixed(2)} (+)</span>
          </div>
          <div className="netting-line">
            <span>Tax Adjustment (Netting):</span>
            <span className={parseFloat(netting.taxAdjustment) > 0 ? 'debit' : 'credit'}>
              ${Math.abs(parseFloat(netting.taxAdjustment)).toFixed(2)} {parseFloat(netting.taxAdjustment) > 0 ? '(+)' : '(-)'}
            </span>
          </div>
          <div className="netting-line total">
            <span>Total Adjustment:</span>
            <span className={parseFloat(netting.totalAdjustment) > 0 ? 'debit' : 'credit'}>
              ${Math.abs(parseFloat(netting.totalAdjustment)).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="financial-summary">
        <h3>Financial Summary {!isEditing && '(Click "Edit" to override)'}</h3>
        {isEditing ? (
          <div className="amount-edit">
            <label>Amount Due/Refund:</label>
            <div className="edit-input-group">
              <span className="currency">$</span>
              <input
                type="number"
                step="0.01"
                value={editedAmountDue}
                onChange={(e) => setEditedAmountDue(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <p className="edit-note">Adjust if special rules, promotions, or waivers apply</p>
          </div>
        ) : (
          <>
            {parseFloat(calculation.amountDue) > 0 ? (
              <div className="amount-due">
                <span>Amount Due from Passenger:</span>
                <span className="amount">${calculation.amountDue}</span>
              </div>
            ) : (
              <div className="amount-refund">
                <span>Amount Refundable to Passenger:</span>
                <span className="amount">${calculation.amountRefundable}</span>
              </div>
            )}
          </>
        )}
      </div>

      <div className="new-flights-display">
        <h3>New Itinerary Details</h3>
        {newFlights.map((flight, idx) => {
          const getFlightLabel = () => {
            if (idx === 0) return 'Outbound Flight';
            if (idx === 1) return 'Return Flight';
            return `Leg ${idx + 1}`;
          };
          return (
            <div key={idx} className="flight-detail-card">
              <div className="flight-detail-header">
                <span className="flight-label">{getFlightLabel()}</span>
                <span className="flight-number">{flight.flightNumber}</span>
              </div>
              <div className="flight-detail-body">
                <div className="detail-row">
                  <span className="label">Route:</span>
                  <span className="value">{flight.from} → {flight.to}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Times:</span>
                  <span className="value">{flight.departure} - {flight.arrival}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Aircraft:</span>
                  <span className="value">{flight.aircraft}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Base Fare:</span>
                  <span className="value fare">${flight.baseFare.toFixed(2)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="action-buttons">
        <button onClick={onRevise} className="revise-btn">
          Revise Selection
        </button>
        <button
          onClick={handleToggleEdit}
          className="edit-btn"
        >
          {isEditing ? 'Cancel Edit' : 'Edit Amount'}
        </button>
        <button
          onClick={handleApproveWithOverride}
          className="approve-btn"
          disabled={!validation.isValid && !isEditing}
        >
          Approve & Proceed to TRR
        </button>
      </div>
    </div>
  );
}
