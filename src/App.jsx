import React, { useState } from 'react';
import PNRLookup from './components/PNRLookup';
import EligibilityCheck from './components/EligibilityCheck';
import SmartFlightSelection from './components/SmartFlightSelection';
import QuoteReview from './components/QuoteReview';
import TRRTemplate from './components/TRRTemplate';
import './styles/App.css';

function App() {
  const [currentStep, setCurrentStep] = useState('pnr-lookup');
  const [pnr, setPnr] = useState(null);
  const [eligibilityChecked, setEligibilityChecked] = useState(false);
  const [selectedFlights, setSelectedFlights] = useState(null);
  const [approvedQuote, setApprovedQuote] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handlePNRRetrieved = (pnrData) => {
    setPnr(pnrData);
    setError(null);
    setCurrentStep('eligibility-check');
  };

  const handleEligibilityChecked = () => {
    setEligibilityChecked(true);
    setError(null);
    setCurrentStep('flight-selection');
  };

  const handleFlightsSelected = (flights) => {
    setSelectedFlights(flights);
    setError(null);
    setCurrentStep('quote-review');
  };

  const handleQuoteApproved = (calculation) => {
    setApprovedQuote(calculation);
    setError(null);
    setCurrentStep('trr-template');
  };

  const handleReviseFlights = () => {
    setSelectedFlights(null);
    setApprovedQuote(null);
    setCurrentStep('flight-selection');
  };

  const handleTRRSubmitSuccess = (trrData) => {
    setSuccessMessage(`TRR ${trrData.trrNumber} submitted successfully!`);
    // No automatic reset - user will click button to proceed
  };

  const handleError = (errorMsg) => {
    setError(errorMsg);
  };

  const resetWorkflow = () => {
    setCurrentStep('pnr-lookup');
    setPnr(null);
    setEligibilityChecked(false);
    setSelectedFlights(null);
    setApprovedQuote(null);
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>Copa Airlines - Ticket Reissue (TRR) Agent Assistant</h1>
          <p className="subtitle">Automated PNR Pricing & Netting Engine</p>
        </div>
      </header>

      <div className="app-container">
        <nav className="workflow-nav">
          <ol className="steps">
            <li className={currentStep === 'pnr-lookup' ? 'active' : pnr ? 'completed' : ''}>
              1. Retrieve PNR
            </li>
            <li className={currentStep === 'eligibility-check' ? 'active' : eligibilityChecked ? 'completed' : ''}>
              1.5. Check Eligibility
            </li>
            <li className={currentStep === 'flight-selection' ? 'active' : selectedFlights ? 'completed' : ''}>
              2. Select Flights
            </li>
            <li className={currentStep === 'quote-review' ? 'active' : approvedQuote ? 'completed' : ''}>
              3. Review Quote
            </li>
            <li className={currentStep === 'trr-template' ? 'active' : ''}>
              4. Submit TRR
            </li>
          </ol>
        </nav>

        <main className="workflow-content">
          {error && (
            <div className="error-banner">
              <span>⚠️ {error}</span>
              <button onClick={() => setError(null)}>Dismiss</button>
            </div>
          )}

          {successMessage && (
            <div className="success-banner">
              <span>✓ {successMessage}</span>
            </div>
          )}

          {currentStep === 'pnr-lookup' && (
            <PNRLookup
              onPNRRetrieved={handlePNRRetrieved}
              onError={handleError}
            />
          )}

          {currentStep === 'eligibility-check' && pnr && (
            <EligibilityCheck
              originalPNR={pnr}
              onProceed={handleEligibilityChecked}
              onError={handleError}
            />
          )}

          {currentStep === 'flight-selection' && pnr && (
            <SmartFlightSelection
              originalPNR={pnr}
              onFlightsSelected={handleFlightsSelected}
              onError={handleError}
            />
          )}

          {currentStep === 'quote-review' && pnr && selectedFlights && (
            <QuoteReview
              originalPNR={pnr}
              newFlights={selectedFlights}
              onApprove={handleQuoteApproved}
              onRevise={handleReviseFlights}
            />
          )}

          {currentStep === 'trr-template' && pnr && approvedQuote && (
            <TRRTemplate
              originalPNR={pnr}
              calculation={approvedQuote}
              onSubmitSuccess={handleTRRSubmitSuccess}
              onError={handleError}
              onReset={resetWorkflow}
            />
          )}
        </main>

        {currentStep !== 'pnr-lookup' && (
          <button className="reset-btn" onClick={resetWorkflow}>
            ↺ Start New Reissue
          </button>
        )}
      </div>

      <footer className="app-footer">
        <p>POC Version 1.0 — Phase 1 MVP: Agent-Assisted Ticket Reissue</p>
      </footer>
    </div>
  );
}

export default App;
