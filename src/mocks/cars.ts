import { Car, District } from './types';

export const AZ_CITIES = [
  'Baku',
  'Sumqayit',
  'Ganja',
  'Mingachevir',
  'Lankaran',
  'Nakhchivan',
  'Shirvan',
  'Sheki',
  'Qabala',
  'Qusar'
];

export const MOCK_CARS: Car[] = [
  {
    id: '1',
    make: 'Toyota',
    model: 'Prado',
    year: 2023,
    type: 'SUV',
    pricePerDay: 120,
    rating: 4.95,
    trips: 142,
    hostName: 'Elvin Mammadov',
    hostImage: 'https://picsum.photos/100/100?random=101',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80',
    location: 'Baku, Sabayil',
    city: 'Baku',
    district: 'Sabayil',
    transmission: 'Automatic',
    fuelType: 'Gas',
    seats: 7,
    features: ['GPS', 'Bluetooth', 'Heated Seats', 'Sunroof'],
    description: 'Perfect condition Land Cruiser Prado. Ideal for family trips around Azerbaijan.'
  },
  {
    id: '2',
    make: 'Porsche',
    model: 'Panamera',
    year: 2022,
    type: 'Sports',
    pricePerDay: 350,
    rating: 5.0,
    trips: 28,
    hostName: 'Leyla Aliyeva',
    hostImage: 'https://picsum.photos/100/100?random=102',
    image: 'https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&w=800&q=80',
    location: 'Baku, Port Baku',
    city: 'Baku',
    district: 'Sabayil',
    transmission: 'Automatic',
    fuelType: 'Gas',
    seats: 4,
    features: ['Sport Mode', 'Premium Sound', 'Leather Interior', 'Panorama'],
    description: 'Luxury driving experience. Available for weddings and VIP guests.'
  },
  {
    id: '3',
    make: 'Hyundai',
    model: 'Elantra',
    year: 2021,
    type: 'Sedan',
    pricePerDay: 55,
    rating: 4.8,
    trips: 215,
    hostName: 'City Cars LLC',
    hostImage: 'https://picsum.photos/100/100?random=103',
    image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=800&q=80',
    location: 'Baku, Yasamal',
    city: 'Baku',
    district: 'Yasamal',
    transmission: 'Automatic',
    fuelType: 'Gas',
    seats: 5,
    features: ['Bluetooth', 'Rear Camera', 'Economy Mode'],
    description: 'Economical and comfortable sedan for city driving.'
  },
  {
    id: '4',
    make: 'Kia',
    model: 'Sportage',
    year: 2023,
    type: 'SUV',
    pricePerDay: 85,
    rating: 4.9,
    trips: 89,
    hostName: 'Rashad Guliyev',
    hostImage: 'https://picsum.photos/100/100?random=104',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c698d9?auto=format&fit=crop&w=800&q=80',
    location: 'Baku, Genclik',
    city: 'Baku',
    district: 'Nasimi',
    transmission: 'Automatic',
    fuelType: 'Gas',
    seats: 5,
    features: ['Apple CarPlay', 'Spacious Trunk', 'Lane Assist'],
    description: 'Great compact SUV for both city and highway driving.'
  },
  {
    id: '5',
    make: 'Mercedes-Benz',
    model: 'G-Class',
    year: 2022,
    type: 'Luxury',
    pricePerDay: 450,
    rating: 5.0,
    trips: 32,
    hostName: 'Elite Drives Baku',
    hostImage: 'https://picsum.photos/100/100?random=105',
    image: 'https://images.unsplash.com/photo-1520031441872-2651429e42f9?auto=format&fit=crop&w=800&q=80',
    location: 'Baku, White City',
    city: 'Baku',
    district: 'Khatai',
    transmission: 'Automatic',
    fuelType: 'Gas',
    seats: 5,
    features: ['Massage Seats', 'Burmester Audio', 'Ambient Lighting', 'V8 Engine'],
    description: 'The ultimate status symbol. Available for photo shoots and events.'
  },
  {
    id: '6',
    make: 'Lada',
    model: 'Niva Legend',
    year: 2024,
    type: 'SUV',
    pricePerDay: 45,
    rating: 4.92,
    trips: 64,
    hostName: 'Mountain Tours',
    hostImage: 'https://picsum.photos/100/100?random=106',
    image: 'https://images.unsplash.com/photo-1549830149-5fb0c5601786?auto=format&fit=crop&w=800&q=80',
    location: 'Qusar',
    city: 'Qusar',
    district: 'Center',
    transmission: 'Manual',
    fuelType: 'Gas',
    seats: 4,
    features: ['4x4', 'Roof Rack', 'Off-road Tires'],
    description: 'The classic off-roader. Perfect for trips to Shahdag.'
  }
];

export const BAKU_DISTRICTS: District[] = [
  {
    name: 'Sabayil',
    image: 'https://images.unsplash.com/photo-1539650116455-251d93d5ce0a?auto=format&fit=crop&w=800&q=80',
    carCount: 156
  },
  {
    name: 'Nasimi',
    image: 'https://images.unsplash.com/photo-1628754835837-33cb8c39d415?auto=format&fit=crop&w=800&q=80',
    carCount: 94
  },
  {
    name: 'Yasamal',
    image: 'https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&w=800&q=80',
    carCount: 82
  },
  {
    name: 'Khatai',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80',
    carCount: 112
  }
];