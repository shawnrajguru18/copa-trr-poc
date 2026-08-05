# Copa Airlines TRR POC — Stakeholder Walkthrough Guide

## Pre-Walkthrough Setup

**Location:** http://localhost:3000  
**Duration:** 15–20 minutes  
**Audience:** Revenue Management, Operations, IT, Reservation Agents

---

## Opening Remarks (2 min)

*"We're demonstrating Phase 1 of the Ticket Reissue Agentic AI system. The goal is to eliminate the manual netting calculation — Step 4 of the 9-step process — which today consumes 40–50% of agent handle time.*

*This POC shows how AI retrieves the PNR, prices the new itinerary, computes the netting automatically, and populates the TRR template with zero manual data entry. Agents move from data entry to review-and-approve."*

---

## Demo Flow

### **Step 1: PNR Retrieval (2 min)**

**What the agent sees:**
- Simple form asking for PNR code
- Single search button

**Demo action:**
1. Enter `CM123456`
2. Click "Retrieve PNR"
3. **What happens:** Simulates Amadeus API call (~800ms)
4. **Result:** Original booking details appear

**Key talking point:**
> "The system instantly retrieves the PNR from Amadeus. In production, this integrates with our existing GDS connection."

---

### **Step 2: Flight Selection (3 min)**

**What the agent sees:**
- Original itinerary displayed (JFK → PTY → JFK)
- Search buttons for each segment
- Available flight options appear after search

**Demo action:**
1. Click "Search Flights" for Segment 1 (JFK → PTY)
2. Show available flights with fares:
   - CM100: $450
   - CM102: $480
   - CM104: $420
3. Select **CM102** ($480)
4. Click "Search Flights" for Segment 2 (PTY → JFK)
5. Select **CM103** ($490)
6. Click "Proceed to Quote Review"

**Key talking point:**
> "Instead of manually looking up fares in the GDS, the agent sees real-time pricing instantly. All segments can be changed in one workflow."

---

### **Step 3: Review Quote & Netting (5 min)**

**This is the core value demonstration.**

**What the agent sees:**
- **Original Ticket** (left column)
  - Base Fare: $450.00
  - Taxes: US $11.70, YQ $25.00, YR $0.00, XF $5.60
  - Total: $492.30

- **New Ticket** (right column)
  - Base Fare: $970.00 (CM102 + CM103)
  - Taxes: US $25.22, YQ $50.00, YR $0.00, XF $5.60
  - Total: $1,050.82

- **Netting Calculation** (highlighted box)
  - Fare Difference: +$520.00
  - Change Fee: +$75.00 (Economy class)
  - Tax Adjustment (Netting): +$31.50
  - **Total Adjustment: +$626.50**

- **Financial Summary**
  - Amount Due: **$626.50**

**Key talking points:**

**For Revenue Management:**
> "Notice the netting calculation breaks down every component:
> - Fare difference is straightforward ($520 higher new fare)
> - We apply the $75 change fee per Economy class rules
> - Tax netting is automatic: we calculate US tax on the new base, adjust YQ for 2 segments vs. 1, keep YR at $0 as per current rules
> - All logic is configurable per guardrail and can be audited"

**For Operations:**
> "This replaces the manual Step 4 calculation. The agent sees the complete breakdown — no more hunting through spreadsheets or calling Revenue Management to confirm the math. If something looks wrong, they can revise the flight selection with one click."

**For Agents:**
> "No more arithmetic. No more double-checking tax codes. You see the number, verify it makes sense, and approve. If the passenger booked a third segment we didn't account for, or there's a special rule we need to apply, you can edit the amount before submission."

**Optional validation demo:**
- Scroll down to show the "New Itinerary" section
- If you select flights that trigger a warning (e.g., very high price jump), show how the system flags it

**Action:**
- Click "Approve & Proceed to TRR"

---

### **Step 4: TRR Template (3 min)**

**What the agent sees:**
- Pre-filled form with all booking details:
  - PNR Code: CM123456
  - Passenger: SMITH/JOHN
  - Email, Phone
  - Original Fare: $492.30
  - New Fare: $1,050.82
  - **Amount Due: $626.50**
  - Netting detail (one-line summary)
  - Optional notes field

**Key talking point:**
> "Zero manual entry. The template is already filled. Every field came from the netting calculation or the original PNR. The agent can add notes if needed, but the data entry is 100% automated. This was the secondary bottleneck — now it's instant."

**Demo action (optional):**
1. Click "Edit Fields" to show the form is editable (if agent needs to override something)
2. Click "Done Editing"
3. Click "Submit TRR to Amadeus"

---

### **Step 5: Confirmation (2 min)**

**What the agent sees:**
- Success banner with TRR number
- Submission timestamp
- Confirmation message

**Key talking point:**
> "The TRR is submitted to Amadeus. In production, this integrates with your TRR API or terminal emulation. The reissue is complete — no follow-up, no manual entry, no callbacks."

---

## Q&A Guide

### **Q: What if the new fare is lower? Do we issue a refund?**
**A:** The system calculates a negative adjustment. Instead of "Amount Due," it shows "Amount Refundable." The agent approves the refund, and the TRR system handles the credit.

### **Q: Can the agent override the netting calculation?**
**A:** Yes. The agent can edit the "Amount Due" field before submission if a special rule applies (e.g., waived change fee, negotiated fare). Each override is logged for compliance.

### **Q: How do we handle complex fares (award, codeshare, interline)?**
**A:** Phase 1 (MVP) is agent-assisted with guardrails. Complex fares route to an agent for review. Phase 2 and 3 expand the guardrail envelope based on production confidence and Revenue Management sign-off.

### **Q: What's the integration effort?**
**A:** Phase 0 (Discovery) validates two paths: Amadeus API or terminal emulation. Phase 1 builds the UI and netting engine. Integration is the main dependency — estimated 2–3 weeks for a typical GDS connection.

### **Q: How fast is this vs. manual reissue?**
**A:** Manual process: 9 steps, ~15 minutes. POC flow: 4 steps, ~3 minutes (including agent review). Phase 2 autonomous mode eliminates agent review for eligible reissues (~95% faster).

### **Q: What about guardrails for autonomous reissues?**
**A:** Phase 2 will define thresholds: e.g., reissues under $500, same-day, standard fares only. Revenue Management configures and can expand these over time as the system proves itself.

### **Q: Can passengers use this for self-service?**
**A:** Not in Phase 1. Phase 2 (Digital Expansion) exposes this to web/mobile channels. Right now it's agent-only to build confidence.

---

## Closing Remarks (2 min)

*"This POC proves the core concept: automated netting and TRR template population work. The real value emerges when we:*

1. *Integrate with your Amadeus connection (Phase 0 discovery validates the path)*
2. *Expand to autonomous mode for simple date/flight changes (Phase 2)*
3. *Open digital channels so passengers self-serve (Phase 2)*

*Phase 1 (6 weeks, ~$130k) gets us to production with agent-assisted reissues and a 60–70% handle-time reduction. From there, Phase 2 (6 weeks) adds autonomous mode and digital channels, pushing handle time down 95%+ and cutting TRR-driven call volume by 50%+.*

*Questions?"*

---

## Technical Details for IT (Optional)

If IT stakeholders want to see the architecture:

**Netting Engine:**
- Open `src/services/nettingEngine.js` — shows the tax calculation and validation logic
- Open `src/data/mockData.js` — shows Copa fares, tax codes, and change-fee rules

**Mock API:**
- Open `src/services/mockAPI.js` — shows the Amadeus and TRR API contract (can be replaced with real APIs in Phase 1)

**Key Files:**
- `src/components/` — React UI components (reusable, testable)
- `src/styles/` — Responsive CSS (works on desktop, tablet, mobile)

---

## Handoff Checklist

After the walkthrough:

- [ ] Confirm Amadeus API or terminal emulation path for Phase 0
- [ ] Validate TRR API / programmatic intake readiness
- [ ] Agree on initial guardrail thresholds (autonomous vs. assisted)
- [ ] Schedule Phase 0 discovery kickoff
- [ ] Align on Phase 1 timeline and team ownership

---

## Supporting Documents

- **PRD:** `PRD_1_Ticket_Reissue_TRR_Agentic_AI.md` — full product requirements
- **POC README:** `README_POC.md` — technical overview and run instructions
