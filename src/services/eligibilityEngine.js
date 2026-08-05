// Amadeus Ticket Changer Eligibility - ATPCo Category 31 Fare Rules
import { taxRules } from '../data/mockData';

export const checkEligibility = (pnr) => {
  const ticket = pnr.originalBooking;
  const fareClass = ticket.segments[0].cabin;
  const issues = [];
  const warnings = [];
  const restrictions = [];

  // Check if ticket is eligible for exchange (ATPCo Category 31)
  const isEligible = true; // Simplified for POC - in production, check against fare rules

  // Define restrictions based on fare class
  const fareRules = {
    Y: {
      changeAllowed: true,
      penalties: { after7days: 50, after1day: 25 },
      restrictions: [
        'Changes allowed for date, flight, and routing',
        'Cabin downgrade allowed with refund',
        'Cabin upgrade subject to availability and payment'
      ],
      penaltyWaived: false
    },
    J: {
      changeAllowed: true,
      penalties: { after7days: 0, after1day: 0 },
      restrictions: [
        'Unlimited changes allowed',
        'No penalty for date or flight changes',
        'Routing changes subject to availability'
      ],
      penaltyWaived: true
    }
  };

  const rules = fareRules[fareClass] || fareRules.Y;

  // Calculate days since booking (simplified)
  const daysSinceBooking = 2;

  return {
    isEligible,
    fareClass,
    ticketNumber: ticket.segments[0].flightNumber,
    restrictions: rules.restrictions,
    penalties: {
      changeFee: rules.penaltyWaived ? 0 : (daysSinceBooking > 7 ? rules.penalties.after7days : rules.penalties.after1day),
      description: rules.penaltyWaived ? 'No penalties apply' : `$${daysSinceBooking > 7 ? rules.penalties.after7days : rules.penalties.after1day} penalty applies`
    },
    allowedChanges: {
      date: true,
      flight: true,
      routing: true,
      cabin: true,
      class: true
    },
    refundEligible: true,
    refundDescription: 'Eligible for voluntary refund if preferred over reissue',
    notes: rules.restrictions,
    issues,
    warnings,
    atpcoCategory: 31
  };
};

export const validateChangeRequest = (originalPNR, newFlights) => {
  const eligibility = checkEligibility(originalPNR);
  const issues = [];

  if (!eligibility.isEligible) {
    issues.push('Ticket is not eligible for exchange');
    return { isValid: false, issues };
  }

  // Check if requested changes are within restrictions
  const originalSegments = originalPNR.originalBooking.segments;
  newFlights.forEach((newFlight, idx) => {
    const original = originalSegments[idx];

    // Validate routing
    if (newFlight.from !== original.from || newFlight.to !== original.to) {
      if (!eligibility.allowedChanges.routing) {
        issues.push(`Routing change not allowed for segment ${idx + 1}`);
      }
    }

    // Validate date
    if (newFlight.date !== original.date) {
      if (!eligibility.allowedChanges.date) {
        issues.push(`Date change not allowed for segment ${idx + 1}`);
      }
    }
  });

  return {
    isValid: issues.length === 0,
    issues,
    eligibility
  };
};
