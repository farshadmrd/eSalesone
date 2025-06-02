import { Injectable } from '@angular/core';
import { ServiceCard } from '../components/sections/service-card/service-card.model';

@Injectable({
  providedIn: 'root'
})
export class PhotoServicesService {
  private services: ServiceCard[] = [
    {
      id: 1,
      icon: 'assets/img/services/photo-icon.svg', 
      title: 'Photography',
      description: 'Professional photography for every occasion with expert gear and guidance.',
      pricing: [
        {
          name: 'Basic',
          price: 199,
          features: [
            '2-hour photoshoot',
            '50 edited photos',
            // 'Digital download',
            '1 location'
          ]
        },
        {
          name: 'Standard',
          price: 399,
          recommended: true,
          features: [
            '4-hour photoshoot',
            '120 edited photos',
            // 'Digital download',
            'Up to 3 locations',
            'Online gallery'
          ]
        },
        {
          name: 'Premium',
          price: 699,
          features: [
            'Full-day photoshoot',
            '250+ edited photos',
            // 'Digital download & USB',
            'Unlimited locations',
            'Online gallery',
            'Printed photo album'
          ]
        }
      ]
    },
    {
      id: 2,
      icon: 'assets/img/services/web-icon.svg', 
      title: 'Web & Mobile App',
      description: 'Transforming ideas into exceptional web and mobile app experiences.',
      pricing: [
        {
          name: 'Basic Website',
          price: 999,
          features: [
            '5 page website',
            'Responsive design',
            'Basic SEO',
            // 'Contact form'
          ]
        },
        {
          name: 'E-commerce',
          price: 2499,
          recommended: true,
          features: [
            'Up to 100 products',
            'Payment integration',
            // 'Customer accounts',
            'Order management',
            'Mobile responsive'
          ]
        },
        {
          name: 'Custom App',
          price: 4999,
          features: [
            'iOS & Android',
            'Custom UI/UX design',
            'Backend integration',
            // 'User authentication',
            'Push notifications',
            '1 month support'
          ]
        }
      ]
    },
    {
      id: 3,
      icon: 'assets/img/services/design-icon.svg', 
      title: 'Design & Creative',
      description: 'Crafting visually stunning designs that connect with your audience.',
      pricing: [
        {
          name: 'Logo & Brand',
          price: 599,
          features: [
            'Logo design',
            'Color palette',
            // 'Typography',
            'Brand guidelines'
          ]
        },
        {
          name: 'Marketing Materials',
          price: 899,
          recommended: true,
          features: [
            'Business cards',
            'Brochures',
            'Social media graphics',
            // 'Email templates',
            'Print materials'
          ]
        },
        {
          name: 'Complete Package',
          price: 1499,
          features: [
            'Logo & branding',
            'Marketing materials',
            'Web banners',
            'Packaging design',
            'Illustrations',
            // 'Video intro'
          ]
        }
      ]
    },
    {
      id: 4,
      icon: 'assets/img/services/dev-icon.svg', // You'll need to create or add this icon
      title: 'Development',
      description: 'Bringing your vision to life with the latest technology and design trends.',
      pricing: [
        {
          name: 'Frontend',
          price: 1499,
          features: [
            'HTML/CSS/JS',
            'Responsive design',
            'Frontend frameworks',
            // 'Performance optimization'
          ]
        },
        {
          name: 'Full Stack',
          price: 2999,
          recommended: true,
          features: [
            'Frontend & Backend',
            'Database design',
            'API integration',
            // 'Authentication',
            'Deployment'
          ]
        },
        {
          name: 'Enterprise',
          price: 5999,
          features: [
            'Full stack development',
            'Scalable architecture',
            'Load testing',
            'Security audit',
            // 'Documentation',
            '6 months support'
          ]
        }
      ]
    }
  ];

  getServices(): ServiceCard[] {
    return this.services;
  }

  getServiceById(id: number): ServiceCard | undefined {
    return this.services.find(service => service.id === id);
  }
}
