export interface PriceVariation {
  id: string;
  itemType: string;
  customerCategory: "MALE" | "FEMALE" | "CHILD" | "UNISEX";
  price: number;
  description?: string;
  isActive: boolean;
}

export interface Service {
  id: string;
  number: string;
  category: string;
  price: number;
  estimatedTime: string;
  status: "Active" | "Inactive";
  name: string;
  duration: string;
  description: string;
  image: string | null;
  orders: number;
  priceVariations: PriceVariation[];
}

export const categories = ["Laundry", "Dry Cleaning", "Ironing"];

export const initialServices: Service[] = [
  {
    id: "S001",
    number: "001",
    category: "Laundry",
    price: 200,
    estimatedTime: "2 hours",
    status: "Active",
    name: "Wash & Fold",
    duration: "24 hours",
    description: "Professional washing and folding service for all types of clothes",
    image: "/services/wash-fold.jpg",
    orders: 5,
    priceVariations: [
      {
        id: "PV001",
        itemType: "Shirt",
        customerCategory: "MALE",
        price: 50,
        description: "Regular shirt",
        isActive: true,
      },
      {
        id: "PV002",
        itemType: "Jeans",
        customerCategory: "UNISEX",
        price: 100,
        description: "Regular jeans",
        isActive: true,
      },
    ],
  },
  {
    id: "S002",
    number: "002",
    category: "Dry Cleaning",
    price: 400,
    estimatedTime: "1.5 hours",
    status: "Inactive",
    name: "Dry Clean",
    duration: "48 hours",
    description: "Expert dry cleaning service for delicate and special care garments",
    image: "/services/dry-clean.jpg",
    orders: 3,
    priceVariations: [],
  },
  {
    id: "S003",
    number: "003",
    category: "Ironing",
    price: 100,
    estimatedTime: "12 hours",
    status: "Active",
    name: "Iron Only",
    duration: "12 hours",
    description: "Professional ironing service to keep your clothes wrinkle-free",
    image: null,
    orders: 2,
    priceVariations: [],
  },
]; 