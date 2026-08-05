import React, { useEffect, useState } from 'react';
import { checkEligibility } from '../services/eligibilityEngine';
import '../styles/EligibilityCheck.css';

export default function EligibilityCheck({ originalPNR, onProceed, onError }) {
  const [eligibility, setEligibility] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const elig = checkEligibility(originalPNR);
      setEligibility(elig);
      setLoading(false);
    } catch (error) {
      onError('Failed to check ticket eligibility');
      setLoading(false);
    }
  }, [originalPNR, onError]);

  if (loading) {
    return <div className="loading">Checking ticket eligibility...</div>;
  }

  if (!eligibility) {
    return <div className="error">Failed to load eligibility information</div>;
  }

  return (
    <div className="eligibility-check">
      <h2>Step 1.5: Verify Ticket Eligibility (ATPCo Category {eligibility.atpcoCategory}: {eligibility.categoryName})</h2>

      {eligibility.isEligible ? (
        <div className="eligibility-content">
          <div className="eligibility-status eligible">
            <h3>✓ Ticket is Eligible for Exchange</h3>
            <p>This ticket can be reissued or refunded</p>
          </div>

          <div className="ticket-info">
            <h3>Ticket Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Fare Class:</span>
                <span className="value">{eligibility.fareClass}</span>
              </div>
              <div className="info-item">
                <span className="label">ATPCo Category:</span>
                <span className="value">{eligibility.atpcoCategory} - {eligibility.categoryName}</span>
              </div>
              <div className="info-item">
                <span className="label">Change Penalty:</span>
                <span className="value penalty">{eligibility.penalties.description}</span>
              </div>
            </div>
          </div>

          <div className="allowed-changes">
            <h3>Allowed Changes</h3>
            <div className="changes-list">
              <div className={`change-item ${eligibility.allowedChanges.date ? 'allowed' : 'blocked'}`}>
                <span className="icon">{eligibility.allowedChanges.date ? '✓' : '✕'}</span>
                <span>Date Changes</span>
              </div>
              <div className={`change-item ${eligibility.allowedChanges.flight ? 'allowed' : 'blocked'}`}>
                <span className="icon">{eligibility.allowedChanges.flight ? '✓' : '✕'}</span>
                <span>Flight Changes</span>
              </div>
              <div className={`change-item ${eligibility.allowedChanges.routing ? 'allowed' : 'blocked'}`}>
                <span className="icon">{eligibility.allowedChanges.routing ? '✓' : '✕'}</span>
                <span>Routing Changes</span>
              </div>
              <div className={`change-item ${eligibility.allowedChanges.cabin ? 'allowed' : 'blocked'}`}>
                <span className="icon">{eligibility.allowedChanges.cabin ? '✓' : '✕'}</span>
                <span>Cabin Changes</span>
              </div>
              <div className={`change-item ${eligibility.allowedChanges.class ? 'allowed' : 'blocked'}`}>
                <span className="icon">{eligibility.allowedChanges.class ? '✓' : '✕'}</span>
                <span>Class Changes</span>
              </div>
            </div>
          </div>

          <div className="fare-restrictions">
            <h3>Fare Rule Restrictions</h3>
            <ul className="restrictions-list">
              {eligibility.restrictions.map((restriction, idx) => (
                <li key={idx}>{restriction}</li>
              ))}
            </ul>
          </div>

          <div className={`refund-option ${!eligibility.refundEligible ? 'not-eligible' : ''}`}>
            <h3>Refund Options</h3>
            <p className="refund-info">
              {eligibility.refundEligible ? '✓' : '✕'} {eligibility.refundDescription}
            </p>
          </div>

          <div className="action-buttons">
            <button onClick={onProceed} className="proceed-btn">
              Proceed with Reissue
            </button>
          </div>
        </div>
      ) : (
        <div className="eligibility-status ineligible">
          <h3>✕ Ticket is Not Eligible for Exchange</h3>
          <p>This ticket cannot be reissued due to fare restrictions.</p>
          <div className="issues-list">
            {eligibility.issues.map((issue, idx) => (
              <p key={idx} className="issue">{issue}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
