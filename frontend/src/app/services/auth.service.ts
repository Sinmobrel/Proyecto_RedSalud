import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private API_URL = 'http://localhost:3000/login';

  constructor(private http: HttpClient) {}

  login(rut: string, password: string): Observable<any> {
  return this.http.post(this.API_URL, { rut, password });
  }
}
