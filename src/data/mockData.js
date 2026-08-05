export const mockPNRs = {
  'CM123456': {
    pnrCode: 'CM123456',
    passenger: 'SMITH/JOHN',
    email: 'john.smith@example.com',
    phone: '+1-305-555-0101',
    atpcoCategory: 31,
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
          cabin: 'Y',
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
          cabin: 'Y',
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
  },
  'CM234567': {
    pnrCode: 'CM234567',
    passenger: 'JOHNSON/SARAH',
    email: 'sarah.johnson@example.com',
    phone: '+1-305-555-0102',
    atpcoCategory: 2,
    originalBooking: {
      segments: [
        {
          id: 1,
          from: 'MIA',
          to: 'PTY',
          date: '2026-09-10',
          departure: '08:00',
          arrival: '10:30',
          flightNumber: 'CM200',
          aircraft: '737',
          cabin: 'Y',
          seatNumber: '15B'
        },
        {
          id: 2,
          from: 'PTY',
          to: 'MIA',
          date: '2026-09-17',
          departure: '11:00',
          arrival: '13:30',
          flightNumber: 'CM201',
          aircraft: '737',
          cabin: 'Y',
          seatNumber: '15B'
        }
      ],
      fareDetails: {
        base: 320.00,
        taxes: {
          US: 8.50,
          YQ: 18.00,
          YR: 0.00,
          XF: 4.20
        },
        totalTaxes: 30.70,
        total: 350.70
      }
    }
  },
  'CM345678': {
    pnrCode: 'CM345678',
    passenger: 'WILLIAMS/MICHAEL',
    email: 'michael.williams@example.com',
    phone: '+1-305-555-0103',
    atpcoCategory: 16,
    originalBooking: {
      segments: [
        {
          id: 1,
          from: 'BOS',
          to: 'PTY',
          date: '2026-08-20',
          departure: '07:00',
          arrival: '13:00',
          flightNumber: 'CM300',
          aircraft: '767',
          cabin: 'Y',
          seatNumber: '22C'
        },
        {
          id: 2,
          from: 'PTY',
          to: 'BOS',
          date: '2026-08-27',
          departure: '14:30',
          arrival: '20:30',
          flightNumber: 'CM301',
          aircraft: '767',
          cabin: 'Y',
          seatNumber: '22C'
        }
      ],
      fareDetails: {
        base: 580.00,
        taxes: {
          US: 15.00,
          YQ: 32.00,
          YR: 0.00,
          XF: 7.20
        },
        totalTaxes: 54.20,
        total: 634.20
      }
    }
  },
  'CM456789': {
    pnrCode: 'CM456789',
    passenger: 'BROWN/DAVID',
    email: 'david.brown@example.com',
    phone: '+1-305-555-0104',
    atpcoCategory: 35,
    originalBooking: {
      segments: [
        {
          id: 1,
          from: 'LAX',
          to: 'PTY',
          date: '2026-09-05',
          departure: '21:00',
          arrival: '06:30',
          flightNumber: 'CM400',
          aircraft: '767',
          cabin: 'Y',
          seatNumber: '32A'
        },
        {
          id: 2,
          from: 'PTY',
          to: 'LAX',
          date: '2026-09-12',
          departure: '22:00',
          arrival: '07:00',
          flightNumber: 'CM401',
          aircraft: '767',
          cabin: 'Y',
          seatNumber: '32A'
        }
      ],
      fareDetails: {
        base: 650.00,
        taxes: {
          US: 18.00,
          YQ: 40.00,
          YR: 0.00,
          XF: 8.50
        },
        totalTaxes: 66.50,
        total: 716.50
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
  },
  'MIA-PTY': {
    'Y': [
      {
        flightNumber: 'CM200',
        departure: '08:00',
        arrival: '10:30',
        aircraft: '737',
        fareClass: 'Y',
        baseFare: 320.00,
        seats: 280
      },
      {
        flightNumber: 'CM202',
        departure: '12:00',
        arrival: '14:30',
        aircraft: '737',
        fareClass: 'Y',
        baseFare: 310.00,
        seats: 200
      },
      {
        flightNumber: 'CM204',
        departure: '16:30',
        arrival: '19:00',
        aircraft: '737',
        fareClass: 'Y',
        baseFare: 330.00,
        seats: 150
      }
    ]
  },
  'PTY-MIA': {
    'Y': [
      {
        flightNumber: 'CM201',
        departure: '11:00',
        arrival: '13:30',
        aircraft: '737',
        fareClass: 'Y',
        baseFare: 325.00,
        seats: 220
      },
      {
        flightNumber: 'CM203',
        departure: '15:00',
        arrival: '17:30',
        aircraft: '737',
        fareClass: 'Y',
        baseFare: 315.00,
        seats: 180
      }
    ]
  },
  'BOS-PTY': {
    'Y': [
      {
        flightNumber: 'CM300',
        departure: '07:00',
        arrival: '13:00',
        aircraft: '767',
        fareClass: 'Y',
        baseFare: 580.00,
        seats: 200
      },
      {
        flightNumber: 'CM302',
        departure: '10:30',
        arrival: '16:30',
        aircraft: '767',
        fareClass: 'Y',
        baseFare: 590.00,
        seats: 160
      },
      {
        flightNumber: 'CM304',
        departure: '18:00',
        arrival: '00:00+1',
        aircraft: '737',
        fareClass: 'Y',
        baseFare: 550.00,
        seats: 220
      }
    ]
  },
  'PTY-BOS': {
    'Y': [
      {
        flightNumber: 'CM301',
        departure: '14:30',
        arrival: '20:30',
        aircraft: '767',
        fareClass: 'Y',
        baseFare: 585.00,
        seats: 180
      },
      {
        flightNumber: 'CM303',
        departure: '19:00',
        arrival: '01:00+1',
        aircraft: '767',
        fareClass: 'Y',
        baseFare: 595.00,
        seats: 140
      }
    ]
  },
  'LAX-PTY': {
    'Y': [
      {
        flightNumber: 'CM400',
        departure: '21:00',
        arrival: '06:30',
        aircraft: '767',
        fareClass: 'Y',
        baseFare: 650.00,
        seats: 190
      },
      {
        flightNumber: 'CM402',
        departure: '22:30',
        arrival: '08:00',
        aircraft: '767',
        fareClass: 'Y',
        baseFare: 660.00,
        seats: 150
      }
    ]
  },
  'PTY-LAX': {
    'Y': [
      {
        flightNumber: 'CM401',
        departure: '22:00',
        arrival: '07:00',
        aircraft: '767',
        fareClass: 'Y',
        baseFare: 655.00,
        seats: 170
      },
      {
        flightNumber: 'CM403',
        departure: '23:00',
        arrival: '08:00',
        aircraft: '767',
        fareClass: 'Y',
        baseFare: 665.00,
        seats: 130
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
