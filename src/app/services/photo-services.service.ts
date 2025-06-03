import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { ServiceCard } from '../components/sections/service-card/service-card.model';

@Injectable({
  providedIn: 'root'
})
export class PhotoServicesService {
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api/services/';

  constructor() { }

  // GET method to fetch all services from API
  getServices(): Observable<ServiceCard[]> {
    console.log('PhotoServicesService: Fetching services from API:', this.apiUrl);
    return this.http.get<ServiceCard[]>(this.apiUrl).pipe(
      tap((services: ServiceCard[]) => console.log('PhotoServicesService: API response:', services)),
      catchError(error => {
        console.error('PhotoServicesService: API Error:', error);
        return throwError(() => error);
      })
    );
  }
  // GET method to fetch a specific service by ID from API
  getServiceById(id: string): Observable<ServiceCard | undefined> {
    return this.http.get<ServiceCard[]>(this.apiUrl).pipe(
      map(services => {
        const service = services.find(service => service.id === id);
        console.log(`PhotoServicesService: Found service with ID ${id}:`, service);
        return service;
      }),
      catchError(error => {
        console.error('PhotoServicesService: Error fetching service by ID:', error);
        return throwError(() => error);
      })
    );
  }
}
