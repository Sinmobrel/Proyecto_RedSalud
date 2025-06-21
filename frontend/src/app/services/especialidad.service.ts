import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Especialidad {
  _id: string;
  nombre: string;
  descripcion?: string;
}

@Injectable({ providedIn: 'root' })
export class EspecialidadService {
  private API_URL = 'http://localhost:3000/especialidades';

  constructor(private http: HttpClient) { }

  getEspecialidades() {
    return this.http.get<any[]>('/especialidades');
  }

  getEspecialidad(id: string) {
    return this.http.get<any>(`${this.API_URL}/${id}`);
  }
}