export interface ServiceCard {
  id: number;
  icon: string;
  title: string;
  description: string;
  pricing?: ServicePricing[];
}

export interface ServicePricing {
  name: string;
  price: number;
  features: string[];
  recommended?: boolean;
}
