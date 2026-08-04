export const mockPNRs = {
  'CM123456': {
    pnrCode: 'CM123456',
    passenger: 'SMITH/JOHN',
    email: 'john.smith@example.com',
    phone: '+1-305-555-0101',
    originalBooking: {
      segments: [
        {
          id: 1,
          from: 'JFK',
          to: 'PTY',
          date: '2026-08-15',
          departure: '10:30',
          arrival: '14:45',
          flightNumber: 'CM100',
          aircraft: '737',
          cabin: 'ECONOMY',
          seatNumber: '12A'
        },
        {
          id: 2,
          from: 'PTY',
          to: 'JFK',
          date: '2026-08-22',
          departure: '16:00',
          arrival: '20:30',
          flightNumber: 'CM101',
          aircraft: '737',
          cabin: 'ECONOMY',
          seatNumber: '12A'
        }
      ],
      fareDetails: {
        base: 450.00,
        taxes: {
          US: 11.70,
          YQ: 25.00,
          YR: 0.00,
          XF: 5.60
        },
        totalTaxes: 42.30,
        total: 492.30
      }
    }
  }
};

export const copaFlights = {
  'JFK-PTY': {
    'Y': [
      {
        flightNumber: 'CM100',
        departure: '10:30',
        arrival: '14:45',
        aircraft: '737',
        fareClass: 'Y',
        baseFare: 450.00,
        seats: 250
      },
      {
        flightNumber: 'CM102',
        departure: '14:00',
        arrival: '18:15',
        aircraft: '767',
        fareClass: 'Y',
        baseFare: 480.00,
        seats: 180
      },
      {
        flightNumber: 'CM104',
        departure: '18:30',
        arrival: '22:45',
        aircraft: '737',
        fareClass: 'Y',
        baseFare: 420.00,
        seats: 120
      }
    ],
    'J': [
      {
        flightNumber: 'CM100',
        departure: '10:30',
        arrival: '14:45',
        aircraft: '737',
        fareClass: 'J',
        baseFare: 1200.00,
        seats: 30
      },
      {
        flightNumber: 'CM102',
        departure: '14:00',
        arrival: '18:15',
        aircraft: '767',
        fareClass: 'J',
        baseFare: 1250.00,
        seats: 40
      }
    ]
  },
  'PTY-JFK': {
    'Y': [
      {
        flightNumber: 'CM101',
        departure: '16:00',
        arrival: '20:30',
        aircraft: '737',
        fareClass: 'Y',
        baseFare: 460.00,
        seats: 200
      },
      {
        flightNumber: 'CM103',
        departure: '19:30',
        arrival: '00:15+1',
        aircraft: '767',
        fareClass: 'Y',
        baseFare: 490.00,
        seats: 150
      }
    ],
    'J': [
      {
        flightNumber: 'CM101',
        departure: '16:00',
        arrival: '20:30',
        aircraft: '737',
        fareClass: 'J',
        baseFare: 1300.00,
        seats: 25
      }
    ]
  }
};

export const taxRules = {
  US: { name: 'US Transportation Tax', rate: 0.026, perSegment: true },
  YQ: { name: 'Fuel Surcharge', rate: 0, fixed: 25.00, perSegment: true },
  YR: { name: 'Airline Recovery Tax', rate: 0, fixed: 0, perSegment: true },
  XF: { name: 'Admin Fee', rate: 0, fixed: 5.60, perSegment: false }
};

export const changeFeeRules = {
  Y: { name: 'Economy', changeFee: 75.00 },
  J: { name: 'Business', changeFee: 0.00 }
};

export const sampleSearchResults = {
  'JFK-PTY-2026-08-15-ECONOMY': [
    {
      flightNumber: 'CM100',
      departure: '10:30',
      arrival: '14:45',
      aircraft: '737',
      fareClass: 'Y',
      baseFare: 450.00,
      seats: 250
    },
    {
      flightNumber: 'CM102',
      departure: '14:00',
      arrival: '18:15',
      aircraft: '767',
      fareClass: 'Y',
      baseFare: 480.00,
      seats: 180
    }
  ]
};
