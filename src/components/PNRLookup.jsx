import React, { useState } from 'react';
import { amadeusPNRRetrieval } from '../services/mockAPI';
import '../styles/PNRLookup.css';

export default function PNRLookup({ onPNRRetrieved, onError }) {
  const [pnrCode, setPnrCode] = useState('CM123456');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!pnrCode.trim()) return;

    setLoading(true);
    try {
      const result = await amadeusPNRRetrieval(pnrCode);
      onPNRRetrieved(result.data);
    } catch (error) {
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pnr-lookup">
      <h2>Step 1: Retrieve PNR from Amadeus</h2>
      <form onSubmit={handleSearch}>
        <div className="input-group">
          <label htmlFor="pnr">PNR Code:</label>
          <input
            id="pnr"
            type="text"
            value={pnrCode}
            onChange={(e) => setPnrCode(e.target.value.toUpperCase())}
            placeholder="Enter PNR code"
            maxLength="6"
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Retrieving...' : 'Retrieve PNR'}
        </button>
      </form>
      <p className="hint">Try: CM123456</p>
    </div>
  );
}
