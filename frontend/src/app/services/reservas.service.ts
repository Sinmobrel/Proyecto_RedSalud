import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private apiUrl = 'http://localhost:3000/reservas';

  constructor(private http: HttpClient) { }

  crearReserva(reserva: any): Observable<any> {
    return this.http.post(this.apiUrl, reserva);
  }

  obtenerReservas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  eliminarReservaPorBox(boxId: string) {
    return this.http.delete(`${this.apiUrl}/box/${boxId}`);
  }

  obtenerBoxesOcupados(): Observable<any[]> {
    return this.http.get<any[]>('/boxes/ocupados');
  }

  // Nueva ruta para obtener todas las reservas reales
  obtenerTodasLasReservas(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/reservas/all');
  }

}