import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BoxService } from '../../services/box.service';
import { ReservaService } from '../../services/reservas.service';
import { EspecialidadService } from '../../services/especialidad.service';
import { EspecialistaService } from '../../services/especialista.service';

interface Box {
  _id?: string;
  piso: number;
  box: number;
  estado?: string;
  especialidad?: string;
  especialista?: string;
  reservaId?: string;
}

@Component({
  selector: 'app-asignar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asignar.component.html',
  styleUrls: ['./asignar.component.scss']
})
export class AsignarComponent implements OnInit {
  currentYear = new Date().getFullYear();
  boxes: Box[] = [];
  boxSeleccionadoFiltro: any = '';
  boxesFiltrados: Box[] = [];

  boxSeleccionado: Box | null = null;

  especialidades: any[] = [];
  especialistas: any[] = [];
  especialistasFiltrados: any[] = [];

  especialidadSeleccionada: string = '';
  pisoSeleccionado: number | '' = '';
  fechaSeleccionada: string = '';
  horaInicioSeleccionada: string = '';
  horaFinSeleccionada: string = '';

  modalEspecialidad: string = '';
  modalEspecialista: string = '';
  modalFecha: string = '';
  modalHoraInicio: string = '';
  modalHoraFin: string = '';
  showModal: boolean = false;

  mensajeError: string = '';

  showMantenimientoModal = false;
  mantenimientoMotivo = '';
  mantenimientoFechaInicio = '';
  mantenimientoFechaFin = '';
  mantenimientoHoraInicio = '';
  mantenimientoHoraFin = '';

  paginaActual = 'asignar';
  rol = '';


  constructor(
    private boxService: BoxService,
    private router: Router,
    private reservaService: ReservaService,
    private especialidadService: EspecialidadService,
    private especialistaService: EspecialistaService

  ) { }

  ngOnInit() {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.rol = localStorage.getItem('rol') || '';
    } else {
      this.rol = '';
    }
    this.cargarBoxes();
    this.cargarEspecialidades();
    this.cargarEspecialistas();
  }

  goTo(ruta: string) {
    if (ruta === 'login') {
      this.router.navigate(['/login']);
    } else {
      this.paginaActual = ruta;
      this.router.navigate(['/' + ruta]);
    }
  }

  cargarEspecialidades() {
    this.especialidadService.getEspecialidades().subscribe(data => {
      this.especialidades = data;
    });
  }

  cargarEspecialistas() {
    this.especialistaService.getEspecialistas().subscribe(data => {
      this.especialistas = data;
    });
  }

  get boxesPorPiso(): { piso: number, boxes: Box[] }[] {
    const grupos: { [piso: number]: Box[] } = {};
    this.boxes.forEach(box => {
      if (!grupos[box.piso]) grupos[box.piso] = [];
      grupos[box.piso].push(box);
    });
    return Object.keys(grupos)
      .sort((a, b) => +a - +b)
      .map(piso => ({ piso: +piso, boxes: grupos[+piso] }));
  }

  get boxesPorPisoFiltrados(): { piso: number, boxes: Box[] }[] {
    // Si hay un piso seleccionado, solo muestra ese grupo
    if (this.pisoSeleccionado !== '') {
      const piso = +this.pisoSeleccionado;
      return [{
        piso,
        boxes: this.boxes.filter(box => box.piso === piso)
      }];
    }
    // Si no hay filtro, muestra todos agrupados por piso
    const grupos: { [piso: number]: Box[] } = {};
    this.boxes.forEach(box => {
      if (!grupos[box.piso]) grupos[box.piso] = [];
      grupos[box.piso].push(box);
    });
    return Object.keys(grupos)
      .sort((a, b) => +a - +b)
      .map(piso => ({ piso: +piso, boxes: grupos[+piso] }));
  }

  get pisos(): number[] {
    return Array.from(new Set(this.boxes.map(b => b.piso)));
  }

  cargarBoxes() {
    const params: any = {};
    this.boxService.getBoxes(params).subscribe(data => {
      this.boxes = data;
      this.filtrarBoxes();
    });
  }

  filtrarBoxes() {
    if (this.pisoSeleccionado) {
      this.boxesFiltrados = this.boxes.filter(box => box.piso == this.pisoSeleccionado);
    } else {
      this.boxesFiltrados = this.boxes;
    }
  }

  seleccionarBox(box: Box) {
    this.boxSeleccionado = box;
    if (typeof box.especialidad === 'object' && box.especialidad !== null) {
      this.modalEspecialidad = (box.especialidad as any)._id;
    } else {
      this.modalEspecialidad = box.especialidad || '';
    }
    this.modalEspecialista = '';
    this.modalFecha = this.fechaSeleccionada || '';
    this.modalHoraInicio = '';
    this.modalHoraFin = '';
    this.showModal = true;
    this.filtrarEspecialistas();
  }

  filtrarEspecialistas() {
    if (this.modalEspecialidad) {
      this.especialistasFiltrados = this.especialistas.filter(
        esp => esp.especialidad === this.modalEspecialidad
      );
    } else {
      this.especialistasFiltrados = this.especialistas;
    }
  }

  restaurarFiltros() {
    this.especialidadSeleccionada = '';
    this.pisoSeleccionado = '';
    this.fechaSeleccionada = '';
    this.horaInicioSeleccionada = '';
    this.horaFinSeleccionada = '';
    this.cargarBoxes();
  }

  confirmarAsignacion() {
    if (
      this.boxSeleccionado &&
      this.modalEspecialidad &&
      this.modalEspecialista &&
      this.modalFecha &&
      this.modalHoraInicio &&
      this.modalHoraFin
    ) {
      const fechaInicio = new Date(`${this.modalFecha}T${this.modalHoraInicio}`);
      const fechaFin = new Date(`${this.modalFecha}T${this.modalHoraFin}`);

      const reserva = {
        box: this.boxSeleccionado._id,
        especialidad: this.modalEspecialidad,
        especialista: this.modalEspecialista,
        fechaInicio: fechaInicio.toISOString(),
        fechaFin: fechaFin.toISOString(),
        estado: 'Ocupado'
      };

      this.reservaService.crearReserva(reserva).subscribe({
        next: () => {
          this.cargarBoxes();
          this.cerrarModal();
          this.mensajeError = '';
        },
        error: (err) => {
          this.mensajeError = err.error?.error || 'No se pudo asignar la reserva.';
        }
      });
    } else {
      this.mensajeError = 'Completa todos los campos.'; // <-- Agrega esto
    }
  }

  liberarBox(box: Box | null) {
    if (!box || !box.reservaId) return;
    this.reservaService.eliminarReservaPorBox(box.reservaId).subscribe(() => {
      this.cargarBoxes();
      this.cerrarModal();
    });
  }

  toggleMantenimiento(box: Box | null) {
    if (!box) return;
    if (box.estado === 'Mantenimiento') {
      // Quitar mantenimiento
      this.boxService.quitarMantenimiento(box._id!).subscribe(() => {
        this.cargarBoxes();
        this.cerrarModal();
      });
    } else {
      // Poner en mantenimiento (puedes pedir motivo y fechas si quieres)
      this.boxService.ponerEnMantenimiento(box._id!).subscribe(() => {
        this.cargarBoxes();
        this.cerrarModal();
      });
    }
  }

  abrirMantenimientoModal(box: Box) {
    this.boxSeleccionado = box;
    this.showMantenimientoModal = true;
    this.mantenimientoMotivo = '';
    this.mantenimientoFechaInicio = '';
    this.mantenimientoFechaFin = '';
    this.mensajeError = '';
  }

  cerrarMantenimientoModal() {
    this.showMantenimientoModal = false;
  }

  confirmarMantenimiento() {
    if (
      !this.mantenimientoMotivo ||
      !this.mantenimientoFechaInicio ||
      !this.mantenimientoHoraInicio ||
      !this.mantenimientoFechaFin ||
      !this.mantenimientoHoraFin
    ) {
      this.mensajeError = 'Completa todos los campos.';
      return;
    }
    const fechaInicio = `${this.mantenimientoFechaInicio}T${this.mantenimientoHoraInicio}:00.000Z`;
    const fechaFin = `${this.mantenimientoFechaFin}T${this.mantenimientoHoraFin}:00.000Z`;

    this.boxService.ponerEnMantenimiento(
      this.boxSeleccionado!._id!,
      this.mantenimientoMotivo,
      fechaInicio,
      fechaFin
    ).subscribe(() => {
      this.cargarBoxes();
      this.cerrarMantenimientoModal();
      this.cerrarModal();
    });
  }

  cerrarModal() {
    this.showModal = false;
    this.boxSeleccionado = null;
    this.modalEspecialidad = '';
    this.modalEspecialista = '';
    this.modalFecha = '';
    this.modalHoraInicio = '';
    this.modalHoraFin = '';
  }

  puedeVer(pagina: string): boolean {
    if (this.rol === 'admin') return true;
    if (this.rol === 'especialista') return ['dashboard', 'calendario'].includes(pagina);
    if (this.rol === 'coordinador') return ['dashboard', 'gestionar', 'asignar', 'calendario'].includes(pagina);
    return false;
  }

}