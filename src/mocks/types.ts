export interface Car {
    id: string;
    make: string;
    model: string;
    year: number;
    type: string;
    pricePerDay: number;
    rating: number;
    trips: number;
    hostName: string;
    hostImage: string;
    image: string;
    location: string;
    city: string;
    district: string;
    transmission: string;
    fuelType: string;
    seats: number;
    features: string[];
    description: string;
}

export interface District {
    name: string;
    image: string;
    carCount: number;
}
