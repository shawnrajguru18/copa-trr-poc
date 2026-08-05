import { taxRules, changeFeeRules } from '../data/mockData';

export const calculateTaxes = (baseFare, numSegments) => {
  const taxes = {};

  Object.entries(taxRules).forEach(([code, rule]) => {
    if (rule.perSegment) {
      if (rule.fixed) {
        taxes[code] = rule.fixed * numSegments;
      } else {
        taxes[code] = baseFare * rule.rate;
      }
    } else {
      taxes[code] = rule.fixed;
    }
  });

  return taxes;
};

export const calculateTotalTaxes = (taxes) => {
  return Object.values(taxes).reduce((sum, val) => sum + val, 0);
};

export const calculateNewQuote = (newFlights, originalBooking, fareClass) => {
  const numSegments = newFlights.length;

  // Calculate new base fare
  const newBaseFare = newFlights.reduce((sum, flight) => sum + flight.baseFare, 0);

  // Calculate new taxes
  const newTaxes = calculateTaxes(newBaseFare, numSegments);
  const newTotalTaxes = calculateTotalTaxes(newTaxes);
  const newTotal = newBaseFare + newTotalTaxes;

  // Calculate original totals
  const originalBaseFare = originalBooking.fareDetails.base;
  const originalTotalTaxes = originalBooking.fareDetails.taxes.US +
    originalBooking.fareDetails.taxes.YQ +
    originalBooking.fareDetails.taxes.YR +
    originalBooking.fareDetails.taxes.XF;
  const originalTotal = originalBooking.fareDetails.total;

  // Calculate fare difference
  const fareDifference = newBaseFare - originalBaseFare;

  // Apply change fee
  const changeFee = changeFeeRules[fareClass].changeFee;

  // Calculate tax adjustment (netting)
  const taxAdjustment = newTotalTaxes - originalTotalTaxes;

  // Calculate total adjustment
  const totalAdjustment = fareDifference + taxAdjustment + changeFee;

  // Calculate amount due/refund
  const amountDue = Math.max(0, totalAdjustment);
  const amountRefundable = Math.max(0, -totalAdjustment);

  return {
    originalQuote: {
      baseFare: originalBaseFare.toFixed(2),
      taxes: originalBooking.fareDetails.taxes,
      totalTaxes: originalTotalTaxes.toFixed(2),
      total: originalTotal.toFixed(2)
    },
    newQuote: {
      baseFare: newBaseFare.toFixed(2),
      taxes: newTaxes,
      totalTaxes: newTotalTaxes.toFixed(2),
      total: newTotal.toFixed(2)
    },
    netting: {
      fareDifference: fareDifference.toFixed(2),
      changeFee: changeFee.toFixed(2),
      taxAdjustment: taxAdjustment.toFixed(2),
      totalAdjustment: totalAdjustment.toFixed(2)
    },
    amountDue: amountDue.toFixed(2),
    amountRefundable: amountRefundable.toFixed(2),
    newFlights: newFlights.map(f => ({
      flightNumber: f.flightNumber,
      departure: f.departure,
      arrival: f.arrival,
      aircraft: f.aircraft
    }))
  };
};

export const validateNetting = (calculation) => {
  const issues = [];

  const newTotal = parseFloat(calculation.newQuote.total);
  const originalTotal = parseFloat(calculation.originalQuote.total);
  const fareDifference = parseFloat(calculation.netting.fareDifference);
  const taxAdjustment = parseFloat(calculation.netting.taxAdjustment);

  // Verify: newTotal should equal originalTotal + fareDifference + taxAdjustment
  // (changeFee is separate - it's an adjustment, not part of the ticket fare)
  const expectedTotal = originalTotal + fareDifference + taxAdjustment;

  if (Math.abs(newTotal - expectedTotal) > 0.01) {
    issues.push(`Total calculation mismatch: expected ${expectedTotal.toFixed(2)}, got ${newTotal.toFixed(2)}`);
  }

  if (parseFloat(calculation.netting.fareDifference) < -1000) {
    issues.push('Unusually large fare credit');
  }

  if (parseFloat(calculation.amountDue) > 5000) {
    issues.push('Unusually large amount due');
  }

  return {
    isValid: issues.length === 0,
    issues
  };
};
