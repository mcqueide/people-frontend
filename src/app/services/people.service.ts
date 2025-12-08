import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PersonRequest, PersonResponse } from '../models/person.model';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  private http = inject(HttpClient);
  private readonly apiUrl = '/api/v1/people';

  list(page: number = 0, size: number = 20): Observable<PersonResponse[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<PersonResponse[]>(this.apiUrl, { params });
  }

  get(id: string): Observable<PersonResponse> {
    return this.http.get<PersonResponse>(`${this.apiUrl}/${id}`);
  }

  create(person: PersonRequest): Observable<PersonResponse> {
    return this.http.post<PersonResponse>(this.apiUrl, person);
  }

  update(id: string, person: PersonRequest): Observable<PersonResponse> {
    return this.http.put<PersonResponse>(`${this.apiUrl}/${id}`, person);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
