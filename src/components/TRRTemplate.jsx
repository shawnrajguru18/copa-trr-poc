import React, { useState } from 'react';
import { submitTRR } from '../services/mockAPI';
import '../styles/TRRTemplate.css';

export default function TRRTemplate({ originalPNR, calculation, onSubmitSuccess, onError, onReset }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);

  const handleEdit = () => {
    setEditing(!editing);
    if (!editing) {
      setEditedData({
        pnrCode: originalPNR.pnrCode,
        passengerName: originalPNR.passenger,
        email: originalPNR.email,
        phone: originalPNR.phone,
        amountDue: calculation.amountDue,
        notes: ''
      });
    }
  };

  const handleEditChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const trrData = editedData || {
        pnrCode: originalPNR.pnrCode,
        passengerName: originalPNR.passenger,
        email: originalPNR.email,
        phone: originalPNR.phone,
        amountDue: calculation.amountDue,
        notes: ''
      };

      const result = await submitTRR(trrData);
      setSubmitted(result.data);
      onSubmitSuccess(result.data);
    } catch (error) {
      onError('Failed to submit TRR');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="trr-template success">
        <h2>✓ TRR Successfully Submitted</h2>
        <div className="success-details">
          <div className="detail-line">
            <span>TRR Number:</span>
            <strong>{submitted.trrNumber}</strong>
          </div>
          <div className="detail-line">
            <span>PNR Code:</span>
            <strong>{submitted.pnrCode}</strong>
          </div>
          <div className="detail-line">
            <span>Passenger:</span>
            <strong>{submitted.passengerName}</strong>
          </div>
          <div className="detail-line">
            <span>Amount Collected:</span>
            <strong>${submitted.amountCollected}</strong>
          </div>
          <div className="detail-line">
            <span>Submitted:</span>
            <strong>{new Date(submitted.timestamp).toLocaleString()}</strong>
          </div>
          <p className="message">{submitted.message}</p>
          <button
            onClick={onReset}
            className="continue-btn"
          >
            ↺ Start New Reissue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="trr-template">
      <h2>Step 4: TRR Template (Auto-Populated)</h2>

      <div className="template-notice">
        ✓ All fields automatically populated from netting calculation.
        {editing && ' Click fields below to edit.'}
      </div>

      <div className="template-form">
        <fieldset>
          <legend>Booking Information</legend>

          <div className="form-group">
            <label>PNR Code:</label>
            {editing ? (
              <input
                type="text"
                value={editedData.pnrCode}
                onChange={(e) => handleEditChange('pnrCode', e.target.value)}
              />
            ) : (
              <div className="form-display">{originalPNR.pnrCode}</div>
            )}
          </div>

          <div className="form-group">
            <label>Passenger Name:</label>
            {editing ? (
              <input
                type="text"
                value={editedData.passengerName}
                onChange={(e) => handleEditChange('passengerName', e.target.value)}
              />
            ) : (
              <div className="form-display">{originalPNR.passenger}</div>
            )}
          </div>

          <div className="form-group">
            <label>Email:</label>
            {editing ? (
              <input
                type="email"
                value={editedData.email}
                onChange={(e) => handleEditChange('email', e.target.value)}
              />
            ) : (
              <div className="form-display">{originalPNR.email}</div>
            )}
          </div>

          <div className="form-group">
            <label>Phone:</label>
            {editing ? (
              <input
                type="tel"
                value={editedData.phone}
                onChange={(e) => handleEditChange('phone', e.target.value)}
              />
            ) : (
              <div className="form-display">{originalPNR.phone}</div>
            )}
          </div>
        </fieldset>

        <fieldset>
          <legend>Reissue Financial Details</legend>

          <div className="form-group">
            <label>Original Fare:</label>
            <div className="form-display">${calculation.originalQuote.total}</div>
          </div>

          <div className="form-group">
            <label>New Fare:</label>
            <div className="form-display">${calculation.newQuote.total}</div>
          </div>

          <div className="form-group highlight">
            <label>Amount Due:</label>
            {editing ? (
              <input
                type="number"
                step="0.01"
                value={editedData.amountDue}
                onChange={(e) => handleEditChange('amountDue', e.target.value)}
              />
            ) : (
              <div className="form-display amount">${calculation.amountDue}</div>
            )}
          </div>

          <div className="form-group">
            <label>Netting Detail:</label>
            <div className="form-display code">
              Fare Diff: ${calculation.netting.fareDifference} +
              Change Fee: ${calculation.netting.changeFee} +
              Tax Adj: ${calculation.netting.taxAdjustment}
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Agent Notes</legend>
          <div className="form-group">
            <label>Notes (optional):</label>
            {editing ? (
              <textarea
                value={editedData.notes}
                onChange={(e) => handleEditChange('notes', e.target.value)}
                rows="3"
                placeholder="Add any notes about this reissue..."
              />
            ) : (
              <div className="form-display">{editedData?.notes || '(No notes)'}</div>
            )}
          </div>
        </fieldset>
      </div>

      <div className="action-buttons">
        <button
          type="button"
          onClick={handleEdit}
          className="edit-btn"
          disabled={submitting}
        >
          {editing ? 'Done Editing' : 'Edit Fields'}
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="submit-btn"
          disabled={submitting}
        >
          {submitting ? 'Submitting to Amadeus...' : 'Submit TRR to Amadeus'}
        </button>
      </div>
    </div>
  );
}
