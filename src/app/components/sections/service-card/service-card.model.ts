export interface ServiceCard {
  id: string;
  title: string;
  logo: string;
  description: string;
  is_active: boolean;
  types: ServiceType[];
}

export interface ServiceType {
  id: string;
  name: string;
  description: string[];
  price: string;
  is_active: boolean;
  service: string;
  recommended?: boolean;
}
