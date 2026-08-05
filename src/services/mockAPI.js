import { mockPNRs, copaFlights } from '../data/mockData';

// Simulate API delay
const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

export const amadeusPNRRetrieval = async (pnrCode) => {
  await delay();

  const pnr = mockPNRs[pnrCode.toUpperCase()];
  if (!pnr) {
    throw new Error(`PNR ${pnrCode} not found`);
  }

  return {
    status: 'success',
    data: pnr
  };
};

export const amadeusFareSearch = async (origin, destination, date, fareClass = 'Y') => {
  await delay();

  const route = `${origin}-${destination}`;
  const flights = copaFlights[route]?.[fareClass];

  if (!flights) {
    return {
      status: 'success',
      data: []
    };
  }

  return {
    status: 'success',
    data: flights
  };
};

export const calculateRepricing = async (originalPNR, newSegments) => {
  await delay(600);

  const fareClass = originalPNR.originalBooking.segments[0].cabin.substring(0, 1);

  // Get flight details for repricing
  const flightDetails = newSegments.map(segment => {
    const route = `${segment.from}-${segment.to}`;
    const flights = copaFlights[route]?.[fareClass];
    const flight = flights?.find(f => f.flightNumber === segment.flightNumber);

    return {
      ...segment,
      ...flight
    };
  });

  // Calculate netting (simplified version for API response)
  const newBaseFare = flightDetails.reduce((sum, f) => sum + (f.baseFare || 0), 0);
  const newTaxes = {
    US: newBaseFare * 0.026,
    YQ: 25.00,
    YR: 0.00,
    XF: 5.60
  };

  const newTotal = newBaseFare + Object.values(newTaxes).reduce((a, b) => a + b, 0);
  const originalTotal = originalPNR.originalBooking.fareDetails.total;
  const fareDifference = newTotal - originalTotal;

  return {
    status: 'success',
    data: {
      quote: {
        baseFare: newBaseFare.toFixed(2),
        taxes: newTaxes,
        total: newTotal.toFixed(2)
      },
      netting: {
        originalTotal: originalTotal.toFixed(2),
        newTotal: newTotal.toFixed(2),
        fareDifference: fareDifference.toFixed(2),
        amountDue: Math.max(0, fareDifference).toFixed(2)
      }
    }
  };
};

export const submitTRR = async (trrData) => {
  await delay(1000);

  // Simulate random TRR ticket number generation (11-digit Copa ticket format)
  const ticketNumber = '001' + Math.floor(Math.random() * 900000000 + 100000000);

  return {
    status: 'success',
    data: {
      trrNumber: ticketNumber,
      timestamp: new Date().toISOString(),
      pnrCode: trrData.pnrCode,
      passengerName: trrData.passengerName,
      amountCollected: trrData.amountDue,
      message: 'TRR successfully submitted to Amadeus'
    }
  };
};

export const validateReissueEligibility = async (pnr) => {
  await delay(300);

  // Check guardrails for autonomous vs assisted
  const total = parseFloat(pnr.originalBooking.fareDetails.total);

  return {
    status: 'success',
    data: {
      eligible: true,
      mode: total < 500 ? 'autonomous' : 'assisted',
      guardrails: {
        maxAutonomousAmount: 500,
        eligibleFareClasses: ['Y', 'K', 'L', 'M', 'N', 'Q', 'S', 'T', 'U', 'V', 'W', 'X'],
        sameDayOnly: true,
        restrictions: []
      }
    }
  };
};
