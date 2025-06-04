import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { 
    path: 'home', 
    loadComponent: () => import('./components/pages/home/home.component').then(c => c.HomeComponent) 
  },
  { 
    path: 'about', 
    loadComponent: () => import('./components/pages/about-me/about-me.component').then(c => c.AboutMeComponent) 
  },
  { 
    path: 'services', 
    loadComponent: () => import('./components/pages/my-services/my-services.component').then(c => c.MyServicesComponent) 
  },  { 
    path: 'checkout', 
    loadComponent: () => import('./components/pages/checkout/checkout.component').then(c => c.CheckoutComponent) 
  },
  { 
    path: 'thank-you', 
    loadComponent: () => import('./components/pages/thank-you/thank-you.component').then(c => c.ThankYouComponent) 
  },
  { path: '**', redirectTo: '/home' }
];
