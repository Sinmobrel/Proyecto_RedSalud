import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Especialista {
  _id?: string;
  nombre: string;
  especialidad: string;
  rut: string;
  correo: string;
  telefono: string;
}

@Injectable({
  providedIn: 'root'
})
export class EspecialistaService {
  private API_URL = 'http://localhost:3000/especialistas';

  constructor(private http: HttpClient) {}

  getEspecialistas(): Observable<Especialista[]> {
    return this.http.get<Especialista[]>(this.API_URL);
  }

  crearEspecialista(especialista: Especialista): Observable<Especialista> {
    return this.http.post<Especialista>(this.API_URL, especialista);
  }

  eliminarEspecialista(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}
