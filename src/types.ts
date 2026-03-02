import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  fabric: string;
  size: string[];
  colors: string[];
  images: string[];
  rating: number;
  reviews: number;
  stock: number;
  isWinter?: boolean;
  trending?: boolean;
}

export type Category = 'Bedsheets' | 'Pillow Covers' | 'Cushion Covers' | 'Blankets' | 'Comforters' | 'Home Textile';

export const CATEGORIES: Category[] = ['Bedsheets', 'Pillow Covers', 'Cushion Covers', 'Blankets', 'Comforters', 'Home Textile'];
export const FABRICS = ['Cotton', 'Silk', 'Linen', 'Velvet', 'Wool'];
export const SIZES = ['Single', 'Double', 'King', 'Queen'];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Egyptian Cotton King Bedsheet',
    description: 'Experience the ultimate luxury with our 1000 thread count Egyptian cotton bedsheet. Soft, breathable, and elegantly finished.',
    price: 120,
    discountPrice: 99,
    category: 'Bedsheets',
    fabric: 'Cotton',
    size: ['King', 'Queen'],
    colors: ['White', 'Beige', 'Sage'],
    images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800'],
    rating: 4.8,
    reviews: 124,
    stock: 15,
    trending: true
  },
  {
    id: '2',
    name: 'Velvet Cushion Cover Set',
    description: 'Add a touch of sophistication to your living room with these plush velvet cushion covers in warm earth tones.',
    price: 45,
    category: 'Cushion Covers',
    fabric: 'Velvet',
    size: ['Standard'],
    colors: ['Brown', 'Charcoal', 'Sage'],
    images: ['https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=800'],
    rating: 4.5,
    reviews: 89,
    stock: 42,
    isWinter: true
  },
  {
    id: '3',
    name: 'Hand-Woven Woolen Blanket',
    description: 'Stay cozy during chilly nights with our premium hand-woven woolen blanket. Perfect for layering.',
    price: 150,
    discountPrice: 135,
    category: 'Blankets',
    fabric: 'Wool',
    size: ['Double', 'King'],
    colors: ['Beige', 'Grey'],
    images: ['https://images.unsplash.com/photo-1580305751101-6df6ec73f1f2?auto=format&fit=crop&q=80&w=800'],
    rating: 4.9,
    reviews: 56,
    stock: 8,
    isWinter: true,
    trending: true
  },
  {
    id: '4',
    name: 'Silk Pillow Case Pair',
    description: 'Gentle on your skin and hair, our 100% mulberry silk pillowcases provide a cooling and luxurious sleep experience.',
    price: 60,
    category: 'Pillow Covers',
    fabric: 'Silk',
    size: ['Standard', 'King'],
    colors: ['Champagne', 'White', 'Rose'],
    images: ['https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80&w=800'],
    rating: 4.7,
    reviews: 210,
    stock: 25
  },
  {
    id: '5',
    name: 'Linen Comforter Set',
    description: 'A breathable and naturally textured linen comforter set that gets softer with every wash.',
    price: 220,
    category: 'Comforters',
    fabric: 'Linen',
    size: ['Queen', 'King'],
    colors: ['Natural', 'Sage'],
    images: ['https://images.unsplash.com/photo-1505693419173-42b925886275?auto=format&fit=crop&q=80&w=800'],
    rating: 4.6,
    reviews: 45,
    stock: 12
  }
];
