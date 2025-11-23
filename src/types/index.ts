export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  type: 'SUV' | 'Sedan' | 'Sports' | 'Truck' | 'Van' | 'Electric' | 'Luxury';
  pricePerDay: number;
  rating: number;
  trips: number;
  hostName: string;
  hostImage: string;
  image: string;
  location: string; // Display string
  city: string;     // Filterable city
  district: string; // Filterable district
  transmission: 'Automatic' | 'Manual';
  fuelType: 'Gas' | 'Electric' | 'Hybrid';
  seats: number;
  features: string[];
  description: string;
}

export interface SearchFilters {
  location?: string;
  startDate?: string;
  endDate?: string;
  minPrice?: number;
  maxPrice?: number;
  type?: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  recommendedCarIds?: string[];
}

export interface District {
  name: string;
  image: string;
  carCount: number;
}