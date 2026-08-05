// Intelligent Refund vs Reissue Analysis
export const analyzeRefundOptions = (originalPNR, calculation) => {
  const originalTotal = originalPNR.originalBooking.fareDetails.total;
  const numSegments = originalPNR.originalBooking.segments.length;
  const atpcoCategory = originalPNR.atpcoCategory || 31;

  // Calculate refund amount based on ATPCO category
  const refundScenarios = calculateRefundScenarios(originalPNR, atpcoCategory);

  // Calculate reissue cost
  const reissueCost = calculation.amountDue;

  // Analyze which option is better
  const analysis = {
    originalTicketValue: originalTotal,
    reissueOption: {
      newFare: calculation.newQuote.baseFare,
      changeFee: calculation.changeFee,
      taxAdjustment: calculation.taxAdjustment,
      amountDue: reissueCost,
      description: `Rebook on new flight with $${reissueCost.toFixed(2)} due`
    },
    refundOptions: refundScenarios,
    recommendation: generateRefundRecommendation(refundScenarios, reissueCost, atpcoCategory),
    edgeCases: flagEdgeCases(originalPNR, calculation, refundScenarios)
  };

  return analysis;
};

const calculateRefundScenarios = (pnr, atpcoCategory) => {
  const original = pnr.originalBooking.fareDetails;
  const baseFare = original.base;
  const totalTaxes = original.totalTaxes;

  const scenarios = {};

  switch (atpcoCategory) {
    case 2: // Nonrefundable
      scenarios.fullRefund = {
        amount: 0,
        description: 'NOT ELIGIBLE - Category 2 (Nonrefundable)',
        eligible: false,
        notes: 'Ticket is nonrefundable per fare rules'
      };
      scenarios.travelCredit = {
        amount: baseFare,
        description: 'Travel Credit (100% of base fare)',
        eligible: true,
        notes: 'Offer as alternative to nonrefundable restriction'
      };
      break;

    case 16: // Advance Reservation
      const advanceRefund = baseFare - (baseFare * 0.15); // 15% penalty
      scenarios.fullRefund = {
        amount: advanceRefund,
        description: `Full Refund (Base fare minus 15% penalty)`,
        eligible: true,
        notes: 'Refund eligible for Category 16 with penalty'
      };
      scenarios.travelCredit = {
        amount: baseFare,
        description: 'Travel Credit (100% of base fare)',
        eligible: true,
        notes: 'Full value preserved if customer agrees'
      };
      break;

    case 35: // Cancellation
      const cancellationFee = baseFare * 0.20; // 20% cancellation fee
      const cancellationRefund = baseFare - cancellationFee;
      scenarios.fullRefund = {
        amount: cancellationRefund,
        description: `Refund (Base fare minus 20% cancellation fee)`,
        eligible: true,
        notes: 'Subject to 14-day advance cancellation deadline'
      };
      scenarios.travelCredit = {
        amount: baseFare,
        description: 'Travel Credit (100% of base fare)',
        eligible: true,
        notes: 'No fees if customer accepts travel credit'
      };
      break;

    case 31: // Restrictions on Changes (default)
    default:
      scenarios.fullRefund = {
        amount: baseFare - 50, // Standard change fee
        description: 'Full Refund (minus $50 change fee)',
        eligible: true,
        notes: 'Standard refund with change fee deduction'
      };
      scenarios.travelCredit = {
        amount: baseFare,
        description: 'Travel Credit (100% of base fare)',
        eligible: true,
        notes: 'Full value preserved as future travel credit'
      };
      break;
  }

  // Always include partial refund option
  scenarios.partialRefund = {
    amount: baseFare * 0.75, // 75% of base
    description: 'Partial Refund (75% of base fare)',
    eligible: true,
    notes: 'Compromise offer - retains 25% value as service charge'
  };

  return scenarios;
};

const generateRefundRecommendation = (refundScenarios, reissueCost, atpcoCategory) => {
  const recommendedRefund = Object.entries(refundScenarios)
    .filter(([_, scenario]) => scenario.eligible)
    .sort((a, b) => b[1].amount - a[1].amount)[0];

  if (!recommendedRefund) {
    return {
      recommendation: 'REISSUE',
      reasoning: 'No refund options available - recommend rebooking',
      savings: 0,
      savingsMessage: 'No refund alternative available'
    };
  }

  const [refundType, refundData] = recommendedRefund;
  const refundAmount = refundData.amount;
  const savings = refundAmount - reissueCost;

  let recommendation = 'REISSUE';
  let reasoning = '';

  if (savings > 100) {
    recommendation = 'REFUND_RECOMMENDED';
    reasoning = `AGENT RECOMMENDED: Offer refund ($${refundAmount.toFixed(2)}) instead of reissue ($${reissueCost.toFixed(2)}). Saves customer $${Math.abs(savings).toFixed(2)}.`;
  } else if (savings > 0) {
    recommendation = 'REFUND_OPTION';
    reasoning = `Refund slightly better: $${Math.abs(savings).toFixed(2)} savings. Consider offering both options.`;
  } else if (savings > -50) {
    recommendation = 'OFFER_BOTH';
    reasoning = `Cost difference minimal ($${Math.abs(savings).toFixed(2)}). Offer customer choice between refund and reissue.`;
  } else {
    recommendation = 'REISSUE_PREFERRED';
    reasoning = `Reissue is better value. Refund cost $${Math.abs(savings).toFixed(2)} more than rebooking.`;
  }

  return {
    recommendation,
    reasoning,
    refundType,
    refundAmount,
    reissueCost,
    savings,
    savingsMessage: savings > 0
      ? `Refund saves $${savings.toFixed(2)}`
      : `Reissue is $${Math.abs(savings).toFixed(2)} cheaper`
  };
};

const flagEdgeCases = (pnr, calculation, refundScenarios) => {
  const flags = [];
  const originalFare = pnr.originalBooking.fareDetails.base;
  const newFare = calculation.newQuote.baseFare;

  // Flag if new flight is significantly cheaper
  if (newFare < originalFare * 0.8) {
    flags.push({
      type: 'CHEAPER_ALTERNATIVE',
      severity: 'low',
      message: `New flight is ${((1 - newFare / originalFare) * 100).toFixed(0)}% cheaper - rebooking recommended`
    });
  }

  // Flag if new flight is significantly more expensive
  if (newFare > originalFare * 1.3 && calculation.amountDue > 200) {
    flags.push({
      type: 'EXPENSIVE_REBOOKING',
      severity: 'high',
      message: `Rebooking costs $${calculation.amountDue.toFixed(2)} - consider refund alternative`
    });
  }

  // Flag nonrefundable tickets
  if (pnr.atpcoCategory === 2) {
    flags.push({
      type: 'NONREFUNDABLE',
      severity: 'high',
      message: 'Category 2 (Nonrefundable) - Only travel credit available, not cash refund'
    });
  }

  // Flag high change fees
  if (calculation.changeFee > 150) {
    flags.push({
      type: 'HIGH_CHANGE_FEE',
      severity: 'medium',
      message: `Change fee of $${calculation.changeFee.toFixed(2)} is substantial - review with supervisor`
    });
  }

  return flags;
};

export const formatRefundAnalysisForDisplay = (analysis) => {
  return {
    ...analysis,
    recommendation: {
      ...analysis.recommendation,
      icon: getRecommendationIcon(analysis.recommendation.recommendation),
      color: getRecommendationColor(analysis.recommendation.recommendation)
    }
  };
};

const getRecommendationIcon = (recommendation) => {
  switch (recommendation) {
    case 'REFUND_RECOMMENDED':
      return '💰';
    case 'REFUND_OPTION':
      return '🤔';
    case 'OFFER_BOTH':
      return '⚖️';
    case 'REISSUE_PREFERRED':
      return '✈️';
    default:
      return '➡️';
  }
};

const getRecommendationColor = (recommendation) => {
  switch (recommendation) {
    case 'REFUND_RECOMMENDED':
      return '#4CAF50'; // green
    case 'REFUND_OPTION':
      return '#FFC107'; // amber
    case 'OFFER_BOTH':
      return '#2196F3'; // blue
    case 'REISSUE_PREFERRED':
      return '#FF9800'; // orange
    default:
      return '#999';
  }
};
