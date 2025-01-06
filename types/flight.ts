export interface FlightPreferences {
    budget: string
    class: 'economy' | 'business' | 'first'
    directFlight: boolean
    flexibleDates: boolean
  }
  
  export interface FlightSuggestion {
    airline: string
    flightNumber: string
    departure: string
    arrival: string
    price: string
    class: string
    duration: string
  }
  
  export interface FlightResponse {
    suggestions: FlightSuggestion[]
    summary: string
  }
  