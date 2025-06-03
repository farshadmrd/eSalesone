import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Profile {
  id: string; 
  name: string;
  job_title: string;
  job_description: string;
  profile_picture: string;
  secondary_picture: string;
  title: string;
  description: string;
  log_bar_images: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ProfilesService {
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api/profiles/';

  constructor() { }
  // GET method to fetch all profiles
  getProfiles(): Observable<Profile[]> {
    return this.http.get<Profile[]>(this.apiUrl);
  }

  // GET method to fetch the last profile from the array
  getLastProfile(): Observable<Profile | null> {
    return this.http.get<Profile[]>(this.apiUrl).pipe(
      map((profiles: Profile[]) => {
        if (profiles && profiles.length > 0) {
          return profiles[profiles.length - 1]; // Get the last element
        }
        return null; // Return null if array is empty
      })
    );
  }
  // GET method to fetch a specific profile by ID
  getProfileById(id: string): Observable<Profile> {
    return this.http.get<Profile>(`${this.apiUrl}${id}/`);
  }
  // GET method to fetch logo bar images from the last profile
  getLogoBarImages(): Observable<string[]> {
    return this.getLastProfile().pipe(
      map((profile: Profile | null) => {
        if (profile && profile.log_bar_images) {
          return profile.log_bar_images;
        }
        return []; // Return empty array if no profile or no log_bar_images
      })
    );
  }
}
