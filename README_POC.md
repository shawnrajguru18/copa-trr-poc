# Copa Airlines Ticket Reissue (TRR) - Agentic AI POC

## Overview

This is a **Phase 1 MVP proof-of-concept** demonstrating an agent-assisted ticket reissue workflow for Copa Airlines. The system automates the core bottleneck: **netting calculation** (fare differences + tax adjustments) and **TRR template auto-population**.

## What This POC Demonstrates

### 1. **Intent Capture** → PNR Retrieval
- Agent enters a PNR code to retrieve the original booking from "Amadeus"
- **Try:** `CM123456`
- Mock API simulates real Amadeus API latency

### 2. **Flight Selection**
- Agent searches for new flights on the same route
- Can select alternative flights for each segment
- Flight options include real Copa Airlines-like fares and schedules

### 3. **Automated Quote Calculation**
The **core netting engine** calculates:
- **Base fare difference** — new fare minus original fare
- **Tax netting** — recalculation of:
  - US: 2.6% transportation tax
  - YQ: $25 fuel surcharge (per segment)
  - YR: Airline recovery tax
  - XF: $5.60 admin fee
- **Change fee** — applied per fare class
- **Total adjustment** — determines amount due or refundable

### 4. **Quote Review**
- Side-by-side comparison of original vs. new ticket
- Full netting breakdown (FR-4 requirement)
- Financial summary showing amount due/refund
- Validation checks to flag unusual amounts

### 5. **TRR Template Auto-Population**
- **Zero manual data entry** — all fields pre-filled from netting calculation
- PNR, passenger name, email, phone, amount due
- Agent can edit if needed before submission
- Optional notes field

### 6. **Submission & Confirmation**
- Single-click "Submit TRR to Amadeus"
- Simulated ticket number generation
- Success confirmation with submission timestamp

---

## How to Run the POC

### Starting the App
```bash
cd "C:\Users\srajguru\Desktop\TRR\trr-poc"
npm start
```

The dev server starts on **http://localhost:3000**

### Demo Walkthrough

1. **Open** http://localhost:3000 in your browser
2. **PNR Lookup**: Enter `CM123456` and click "Retrieve PNR"
3. **Flight Selection**: 
   - Click "Search Flights" for each segment
   - Select alternative flights from the dropdown
   - Click "Proceed to Quote Review"
4. **Review Quote**:
   - Examine the netting calculation details
   - See original vs. new fare breakdown
   - Review amount due/refund
   - Click "Approve & Proceed to TRR"
5. **TRR Template**:
   - All fields are auto-filled
   - Optionally click "Edit Fields" to modify
   - Click "Submit TRR to Amadeus"
6. **Success**: View the submitted TRR confirmation

---

## Technical Architecture

### Components
- **PNRLookup.jsx** — PNR retrieval UI
- **FlightSelection.jsx** — Multi-segment flight search & selection
- **QuoteReview.jsx** — Netting calculation & validation display
- **TRRTemplate.jsx** — Auto-populated template form

### Business Logic
- **nettingEngine.js** — Core pricing & netting calculations
  - `calculateTaxes()` — Applies all tax codes per fare class
  - `calculateNewQuote()` — Computes fare difference + netting
  - `validateNetting()` — Flags unusual amounts (guardrails)
  
- **mockAPI.js** — Simulated Amadeus & TRR APIs
  - `amadeusPNRRetrieval()` — Retrieves PNR
  - `amadeusFareSearch()` — Searches flights
  - `calculateRepricing()` — Prices new itinerary
  - `submitTRR()` — Submits to TRR system

### Data
- **mockData.js** — Realistic Copa Airlines flights, fares, and tax rules

---

## Key Features Implemented (MVP Phase 1)

✅ **FR-1** Intent capture (PNR code input)  
✅ **FR-2** PNR retrieval via mock API  
✅ **FR-3** Itinerary repricing  
✅ **FR-4** Netting engine (fare + tax + change fee)  
✅ **FR-5** TRR template auto-population (no manual entry)  
✅ **FR-6** Agent review & single-click approval  
✅ **FR-11** Guardrail validation (unusual amount detection)  

---

## Sample Data

### Test PNR
```
PNR: CM123456
Passenger: SMITH/JOHN
Route: JFK → PTY → JFK (round trip)
Original Fare: $492.30 (Economy)
  Base: $450.00
  Taxes: $42.30 (US, YQ, YR, XF)
```

### Available Flights
- **JFK → PTY**: CM100 ($450), CM102 ($480), CM104 ($420)
- **PTY → JFK**: CM101 ($460), CM103 ($490)

---

## Netting Example

**Original Ticket:**
- Base Fare: $450.00
- Taxes: $42.30
- Total: $492.30

**New Ticket (CM102 + CM103):**
- Base Fare: $970.00
- Taxes: $73.80
- Total: $1,043.80

**Netting Calculation:**
- Fare Difference: +$520.00
- Change Fee: +$75.00 (Economy)
- Tax Adjustment: +$31.50
- **Total Adjustment: +$626.50**
- **Amount Due: $626.50**

---

## Production Readiness Notes

This POC demonstrates the **core Phase 1 happy path**. For production (Phase 2+), add:

1. **Real Amadeus API Integration**
   - Replace mock APIs with actual Amadeus SDK
   - Handle connection errors & timeouts

2. **Autonomous Mode (Phase 2)**
   - Guardrail thresholds (e.g., < $500 and same-day)
   - Auto-submit for eligible reissues
   - Passenger notification flow

3. **Digital Channel Support (Phase 2)**
   - REST API for self-service channels
   - Mobile / web app integration

4. **Compliance & Audit**
   - Full transaction logging
   - Revenue Management approval workflow
   - Netting discrepancy escalation

5. **Error Handling**
   - Graceful fallback to agent-assisted
   - PNR lock validation
   - Fare rule conflict detection

---

## Contact & Next Steps

- **Phase 1 Timeline**: 6 weeks to production
- **Cost**: $125,000–$135,000
- **Estimated handle-time reduction**: 60–70%

For stakeholder walkthrough or integration questions, refer to the PRD:  
`PRD_1_Ticket_Reissue_TRR_Agentic_AI.md`
