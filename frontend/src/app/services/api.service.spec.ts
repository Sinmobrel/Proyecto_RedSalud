import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getSaludo(): Observable<string> {
    return this.http.get('http://localhost:3000/', { responseType: 'text' });
  }
}
