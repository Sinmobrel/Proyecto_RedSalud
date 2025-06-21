import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Box {
  _id?: string;
  piso: number;
  box: number;
  estado?: string;
  especialidad?: string;
  especialista?: string;
  reservaId?: string;
}

@Injectable({ providedIn: 'root' })
export class BoxService {
  private API_URL = 'http://localhost:3000/boxes';

  constructor(private http: HttpClient) { }

  getBoxes(params: any = {}): Observable<Box[]> {
    return this.http.get<Box[]>(this.API_URL, { params });
  }

  updateBox(id: string, data: Partial<Box>): Observable<Box> {
    return this.http.put<Box>(`${this.API_URL}/${id}`, data);
  }

  getEspecialidades(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/especialidades`);
  }

  getPisos(): Observable<number[]> {
    return this.http.get<number[]>(`${this.API_URL}/pisos`);
  }

  getFechas(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/fechas`);
  }

  getBoxesOcupados(params: any) {
    return this.http.get<Box[]>('/boxes/ocupados', { params });
  }

  actualizarReserva(reserva: any) {
    return this.http.put(`/reservas/${reserva._id}`, reserva);
  }

  eliminarReserva(id: string) {
    return this.http.delete(`/reservas/${id}`);
  }

  // Poner un box en mantenimiento
  ponerEnMantenimiento(boxId: string, motivo: string = '', fechaInicio: string = '', fechaFin: string = '') {
    return this.http.post('/boxmantenimientos', { boxId, motivo, fechaInicio, fechaFin });
  }

  // Quitar mantenimiento a un box
  quitarMantenimiento(boxId: string) {
    return this.http.delete(`/boxmantenimientos/${boxId}`);
  }

  getBoxesMantenimiento() {
    return this.http.get<any[]>('boxes/mantenimiento');
  }

  eliminarMantenimiento(id: string) {
    return this.http.delete(`boxes/mantenimiento/${id}`);
  }

  actualizarMantenimiento(mantenimiento: any) {
    return this.http.put(`/boxes/mantenimiento/${mantenimiento._id}`, mantenimiento);
  }
}