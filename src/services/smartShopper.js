// Amadeus Ticket Changer Shopper - Smart flight recommendations with calendar view
import { copaFlights } from '../data/mockData';

export const getCalendarView = (origin, destination, baseDate, fareClass = 'Y', daysAround = 3) => {
  const results = {};
  const baseDateObj = new Date(baseDate);

  // Generate dates ±3 days from base date
  for (let i = -daysAround; i <= daysAround; i++) {
    const date = new Date(baseDateObj);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];

    const route = `${origin}-${destination}`;
    const flights = copaFlights[route]?.[fareClass] || [];

    results[dateStr] = flights.map(flight => ({
      ...flight,
      date: dateStr,
      daysFromBase: i,
      dateLabel: formatDateLabel(date, i)
    }));
  }

  return results;
};

const formatDateLabel = (date, daysFromBase) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayName = days[date.getDay()];
  const dayNum = date.getDate();

  if (daysFromBase === 0) {
    return `${dayName} ${dayNum} (Today)`;
  } else if (daysFromBase === 1) {
    return `${dayName} ${dayNum} (+1 day)`;
  } else if (daysFromBase === -1) {
    return `${dayName} ${dayNum} (-1 day)`;
  } else {
    return `${dayName} ${dayNum} (${daysFromBase > 0 ? '+' : ''}${daysFromBase} days)`;
  }
};

export const rankRecommendations = (flights, originalFare, preferences = {}) => {
  const {
    preferCheaper = true,
    preferEarlier = true,
    preferDirect = true,
    maxPriceIncrease = 500
  } = preferences;

  return flights
    .map(flight => {
      let score = 0;
      let reasons = [];

      // Price ranking
      const priceDiff = flight.baseFare - originalFare;
      const savingsPct = priceDiff < 0 ? Math.abs(priceDiff) / originalFare * 100 : 0;

      if (preferCheaper && priceDiff < 0) {
        score += (savingsPct / 10) * 30; // Up to 30 points for savings
        reasons.push(`Save $${Math.abs(priceDiff).toFixed(2)}`);
      } else if (priceDiff <= 50) {
        score += 15; // Good price
        reasons.push('Similar price');
      }

      // Time ranking (prefer morning departures)
      const depTime = parseInt(flight.departure.split(':')[0]);
      if (preferEarlier && depTime >= 8 && depTime <= 12) {
        score += 20; // Good departure time
        reasons.push('Good departure time');
      } else if (depTime < 6 || depTime > 18) {
        score -= 10; // Inconvenient time
      }

      // Availability
      if (flight.seats > 50) {
        score += 10;
        reasons.push('High availability');
      } else if (flight.seats < 10) {
        score -= 5;
        reasons.push('Limited seats');
      }

      // Filter out overpriced options
      if (priceDiff > maxPriceIncrease) {
        score = -999; // De-rank significantly
      }

      return {
        ...flight,
        score,
        priceDiff,
        reasons,
        badge: getBadge(score, priceDiff, flight.seats)
      };
    })
    .sort((a, b) => b.score - a.score)
    .map((flight, idx) => ({
      ...flight,
      rank: idx + 1,
      isTopPick: idx === 0
    }));
};

const getBadge = (score, priceDiff, seats) => {
  if (score >= 50) return 'BEST_VALUE';
  if (priceDiff < 0) return 'CHEAPER';
  if (seats > 100) return 'HIGH_AVAILABILITY';
  return null;
};

export const getTravelBoardView = (origin, destination, date, fareClass = 'Y', limit = 200) => {
  const route = `${origin}-${destination}`;
  const allFlights = copaFlights[route]?.[fareClass] || [];

  // In a real scenario, this would show up to 200 flights for a date
  // For POC, we'll just return what we have with rankings
  return allFlights
    .slice(0, limit)
    .map((flight, idx) => ({
      ...flight,
      date,
      rank: idx + 1
    }));
};

export const generateSmartRecommendation = (originalSegment, calendarFlights, baseFare) => {
  // Find the best option across all dates
  const allFlights = [];
  Object.entries(calendarFlights).forEach(([date, flights]) => {
    allFlights.push(...flights);
  });

  const ranked = rankRecommendations(allFlights, baseFare);
  const topPick = ranked[0];

  return {
    topPick,
    topAlternatives: ranked.slice(0, 5),
    recommendations: {
      cheapest: ranked.filter(f => f.badge === 'CHEAPER')[0],
      bestTiming: ranked.filter(f => f.reasons.includes('Good departure time'))[0],
      mostAvailable: ranked.filter(f => f.badge === 'HIGH_AVAILABILITY')[0]
    }
  };
};

export const calculateFareComparison = (originalFare, newFare, taxes = {}) => {
  const difference = newFare - originalFare;
  const percentChange = (difference / originalFare) * 100;

  return {
    originalFare: originalFare.toFixed(2),
    newFare: newFare.toFixed(2),
    difference: difference.toFixed(2),
    percentChange: percentChange.toFixed(1),
    isCheaper: difference < 0,
    isSimilar: Math.abs(difference) < 50,
    savingsMessage: difference < 0 ? `Save $${Math.abs(difference).toFixed(2)}` : `+$${difference.toFixed(2)}`
  };
};
