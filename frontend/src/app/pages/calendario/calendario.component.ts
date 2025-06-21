import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { format, getDay, parseISO } from 'date-fns';
import { FormsModule } from '@angular/forms';
import { BoxService } from '../../services/box.service';
import { ReservaService } from '../../services/reservas.service';
import { EspecialidadService } from '../../services/especialidad.service';
import { EspecialistaService } from '../../services/especialista.service';


@Component({
  selector: 'app-calendario',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss']
})
export class CalendarioComponent {

  currentYear = new Date().getFullYear();
  especialidades: any[] = [];
  especialistas: any[] = [];

  especialidadSeleccionada: string = '';
  especialistaSeleccionado: string = '';

  fechaSeleccionada: string = '';

  reservaSeleccionada: any = null;
  mostrarModal: boolean = false;

  diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  horasDelDia = ['08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00'];

  // Ejemplo de reservas para mostrar bloques verdes
  reservas: any[] = [];

  rol = '';
  especialistaId: string | null = null;

  paginaActual = 'calendario';

  constructor(
    private reservaService: ReservaService,
    private boxService: BoxService,
    private router: Router
  ) { }

  ngOnInit() {

    const hoy = new Date();
    this.fechaSeleccionada = hoy.toISOString().substring(0, 10);

    if (typeof window !== 'undefined') {
      this.rol = localStorage.getItem('rol') || '';
      if (this.rol === 'especialista') {
        const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
        this.especialistaId = usuario._id || null;
      }
    }
    this.cargarReservas();
    this.reservaService.obtenerTodasLasReservas().subscribe(reservasRaw => {
      this.procesarReservas(reservasRaw);
    });
  }

  goTo(ruta: string) {
    if (ruta === 'login') {
      this.router.navigate(['/login']);
    } else {
      this.paginaActual = ruta;
      this.router.navigate(['/' + ruta]);
    }
  }

  cargarReservas() {
    this.reservaService.obtenerTodasLasReservas().subscribe(reservasRaw => {
      //console.log('RESERVAS RAW:', reservasRaw);
      this.procesarReservas(reservasRaw);
    });
  }

  procesarReservas(reservasRaw: any[]) {
    let reservasFiltradas = reservasRaw.filter(r => r.fechaInicio);

    // Si es especialista, filtra solo sus reservas
    if (this.rol === 'especialista' && this.especialistaId) {
      reservasFiltradas = reservasFiltradas.filter(r =>
        (r.especialista?._id === this.especialistaId) || (r.especialista === this.especialistaId)
      );
    }

    this.reservas = reservasFiltradas
      .map(r => {
        const fechaStr = typeof r.fechaInicio === 'string'
          ? r.fechaInicio
          : r.fechaInicio?.$date;
        const fechaFinStr = typeof r.fechaFin === 'string'
          ? r.fechaFin
          : r.fechaFin?.$date;
        if (!fechaStr) return null;
        const fecha = parseISO(fechaStr);
        const diaSemana = (getDay(fecha) + 6) % 7;
        const horaInicio = fechaStr.substring(11, 16);
        const horaFin = fechaFinStr ? fechaFinStr.substring(11, 16) : '';
        return {
          ...r,
          dia: diaSemana,
          hora: horaInicio,
          horaInicio,
          horaFin,
          especialidadId: r.especialidad?._id,
          especialidadNombre: r.especialidad?.nombre,
          especialistaId: r.especialista?._id,
          especialistaNombre: r.especialista?.nombre,
          boxId: r.box?._id,
          boxNumero: typeof r.box === 'number' ? r.box : r.box?.numero || r.box?.nombre || '',
          piso: r.piso ?? '',
          fechaInicio: fechaStr
        };
      })
      .filter(r => r !== null);

    // Filtros únicos
    this.especialidades = Array.from(
      new Map(
        this.reservas
          .filter(r => r.especialidadId && r.especialidadNombre)
          .map(r => [r.especialidadId, { _id: r.especialidadId, nombre: r.especialidadNombre }])
      ).values()
    );

    this.especialistas = Array.from(
      new Map(
        this.reservas
          .filter(r => r.especialistaId && r.especialistaNombre)
          .map(r => [r.especialistaId, { _id: r.especialistaId, nombre: r.especialistaNombre }])
      ).values()
    );

    //console.log('RESERVAS PROCESADAS:', this.reservas);
  }

  getReserva(dia: number, hora: string) {
    return this.reservas.find(r => {
      // Compara día
      if (r.dia !== dia) return false;

      // Compara hora dentro del rango
      const horaInicio = r.horaInicio || r.hora; // asegúrate de tener ambos
      const horaFin = r.horaFin || r.hora;
      if (hora < horaInicio || hora >= horaFin) return false;

      // Filtros
      if (this.especialidadSeleccionada && r.especialidadId?.toString() !== this.especialidadSeleccionada.toString()) return false;
      if (this.especialistaSeleccionado && r.especialistaId?.toString() !== this.especialistaSeleccionado.toString()) return false;
      if (this.fechaSeleccionada && !r.fechaInicio.startsWith(this.fechaSeleccionada)) return false;

      return true;
    });
  }

  esInicioReserva(r: any, hora: string) {
    return r.horaInicio === hora;
  }

  calcularSpan(reserva: any): number {
    // Calcula cuántos bloques de 15 minutos abarca la reserva
    const inicio = reserva.horaInicio.split(':');
    const fin = reserva.horaFin.split(':');
    const minutosInicio = parseInt(inicio[0], 10) * 60 + parseInt(inicio[1], 10);
    const minutosFin = parseInt(fin[0], 10) * 60 + parseInt(fin[1], 10);
    return Math.max(1, (minutosFin - minutosInicio) / 15);
  }

  abrirModalReserva(reserva: any) {
    //console.log('Reserva seleccionada:', reserva);
    this.reservaSeleccionada = reserva;
    this.mostrarModal = true;
  }

  cerrarModalReserva() {
    this.mostrarModal = false;
    this.reservaSeleccionada = null;
  }

  puedeVer(pagina: string): boolean {
    if (this.rol === 'admin') return true;
    if (this.rol === 'especialista') return ['dashboard', 'calendario'].includes(pagina);
    if (this.rol === 'coordinador') return ['dashboard', 'gestionar', 'asignar', 'calendario'].includes(pagina);
    return false;
  }
}
