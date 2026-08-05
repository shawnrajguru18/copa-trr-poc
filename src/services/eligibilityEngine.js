// Amadeus Ticket Changer Eligibility - ATPCo Category 31 Fare Rules
import { taxRules } from '../data/mockData';

export const checkEligibility = (pnr) => {
  const ticket = pnr.originalBooking;
  const fareClass = ticket.segments[0].cabin;
  const atpcoCategory = pnr.atpcoCategory || 31;
  const issues = [];
  const warnings = [];

  // ATPCO Category-specific rules
  const categoryRules = {
    2: {
      name: 'Nonrefundability',
      isEligible: true,
      restrictions: [
        'Changes allowed for date and flight only',
        'No routing changes permitted',
        'NO REFUNDS - Ticket is nonrefundable',
        'Change fees apply at 100% of ticket value'
      ],
      allowedChanges: { date: true, flight: true, routing: false, cabin: false, class: false },
      penalties: { after7days: 125, after1day: 75 },
      penaltyWaived: false,
      refundEligible: false,
      refundDescription: 'NOT ELIGIBLE - Ticket is nonrefundable per Category 2 rules'
    },
    16: {
      name: 'Advance Reservation/Ticketing',
      isEligible: true,
      restrictions: [
        'Minimum 7 days advance reservation required',
        'Changes allowed with penalties',
        'Must maintain advance purchase requirement for new flights',
        'Downgrade not allowed'
      ],
      allowedChanges: { date: true, flight: true, routing: true, cabin: false, class: false },
      penalties: { after7days: 85, after1day: 50 },
      penaltyWaived: false,
      refundEligible: true,
      refundDescription: 'Partial refund eligible minus applicable taxes and fees'
    },
    31: {
      name: 'Restrictions on Changes',
      isEligible: true,
      restrictions: [
        'Changes allowed for date, flight, and routing',
        'Cabin downgrade allowed with refund',
        'Cabin upgrade subject to availability and payment'
      ],
      allowedChanges: { date: true, flight: true, routing: true, cabin: true, class: true },
      penalties: { after7days: 50, after1day: 25 },
      penaltyWaived: false,
      refundEligible: true,
      refundDescription: 'Eligible for voluntary refund if preferred over reissue'
    },
    35: {
      name: 'Cancellation',
      isEligible: true,
      restrictions: [
        'Cancellation allowed up to 14 days before departure',
        'After 14 days: cancellation fee applies',
        'Changes allowed with standard change fees',
        'High penalty for cancellations within 48 hours'
      ],
      allowedChanges: { date: true, flight: true, routing: true, cabin: true, class: true },
      penalties: { after7days: 100, after1day: 150 },
      penaltyWaived: false,
      refundEligible: true,
      refundDescription: 'Refund eligible minus cancellation fees if within 14 days of departure'
    }
  };

  const rules = categoryRules[atpcoCategory] || categoryRules[31];
  const daysSinceBooking = 2;

  return {
    isEligible: rules.isEligible,
    fareClass,
    ticketNumber: ticket.segments[0].flightNumber,
    restrictions: rules.restrictions,
    penalties: {
      changeFee: rules.penaltyWaived ? 0 : (daysSinceBooking > 7 ? rules.penalties.after7days : rules.penalties.after1day),
      description: rules.penaltyWaived ? 'No penalties apply' : `$${daysSinceBooking > 7 ? rules.penalties.after7days : rules.penalties.after1day} penalty applies`
    },
    allowedChanges: rules.allowedChanges,
    refundEligible: rules.refundEligible,
    refundDescription: rules.refundDescription,
    notes: rules.restrictions,
    issues,
    warnings,
    atpcoCategory,
    categoryName: rules.name
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
