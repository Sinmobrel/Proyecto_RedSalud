import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BoxService, Box } from '../../services/box.service';
import { EspecialidadService } from '../../services/especialidad.service';
import { EspecialistaService } from '../../services/especialista.service';

@Component({
  selector: 'app-gestionar',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './gestionar.component.html',
  styleUrls: ['./gestionar.component.scss']
})
export class GestionarComponent implements OnInit {

  currentYear = new Date().getFullYear();
  boxes: Box[] = [];
  especialidades: any[] = [];
  especialidadSeleccionada: string = '';
  especialistas: any[] = [];
  especialistasFiltrados: any[] = [];

  pisoSeleccionado: string = '';

  fechaSeleccionada: string = '';

  selectedBox: Box | null = null;

  allBoxes: Box[] = [];

  modalAbierto = false;
  modalReserva: any = null;

  boxSeleccionado: Box | null = null;

  modalEspecialidad: string = '';
  modalEspecialista: string = '';
  modalFecha: string = '';
  modalHoraInicio: string = '';
  modalHoraFin: string = '';

  mensajeError: string = '';

  paginaActual = 'gestionar';

  rol = '';

  modalMantenimientoAbierto = false;
  boxesMantenimiento: any[] = [];
  modalEditarMantenimientoAbierto = false;
  modalMantenimiento: any = {};

  constructor(private boxService: BoxService, private router: Router, private especialidadService: EspecialidadService, private especialistaService: EspecialistaService) { }

  ngOnInit() {
    // Carga todos los boxes para los filtros

    if (typeof window !== 'undefined') {
      this.rol = localStorage.getItem('rol') || '';
    }

    this.boxService.getBoxes({}).subscribe(data => {
      this.allBoxes = data;
      this.cargarBoxes();
    });

    this.especialidadService.getEspecialidades().subscribe(data => {
      this.especialidades = data;
    });

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

  cargarBoxes() {
    const params: any = {};
    if (this.pisoSeleccionado) params.piso = this.pisoSeleccionado;
    if (this.especialidadSeleccionada) params.especialidad = this.especialidadSeleccionada;
    if (this.fechaSeleccionada) params.fecha = this.fechaSeleccionada; // <-- ¡Esto es clave!

    this.boxService.getBoxesOcupados(params).subscribe(data => {
      this.boxes = data;
      this.selectedBox = null;
    });
  }

  get pisos(): number[] {
    return Array.from(new Set(this.allBoxes.map(b => b.piso)));
  }

  get boxesFiltrados(): Box[] {
    return this.boxes.filter(box => {
      if (this.especialidadSeleccionada === '') return true;
      if (!box.especialidad) return false;

      if (typeof box.especialidad === 'object' && (box.especialidad as any)._id) {
        return String((box.especialidad as any)._id) === String(this.especialidadSeleccionada);
      }
      return String(box.especialidad) === String(this.especialidadSeleccionada);
    }).filter(box =>
      this.pisoSeleccionado === '' || box.piso === +this.pisoSeleccionado
    );
  }

  get especialidadesFiltradas(): any[] {
    const map = new Map();
    this.allBoxes.forEach(box => {
      if (
        box.especialidad &&
        typeof box.especialidad === 'object' &&
        (box.especialidad as any)._id
      ) {
        map.set((box.especialidad as any)._id, box.especialidad);
      }
    });
    return Array.from(map.values());
  }

  cargarEspecialistas() {
    this.especialistaService.getEspecialistas().subscribe(data => {
      this.especialistas = data;
    });
  }

  getNombreEspecialidad(especialidad: any): string {
    if (!especialidad) return 'Sin asignar';
    if (typeof especialidad === 'object') {
      if ('nombre' in especialidad && typeof especialidad.nombre === 'string') {
        return especialidad.nombre;
      }
      if ('_id' in especialidad) {
        return especialidad._id;
      }
      // Si el objeto está anidado, intenta acceder a un nivel más
      if ('especialidad' in especialidad && typeof especialidad.especialidad === 'object') {
        return this.getNombreEspecialidad(especialidad.especialidad);
      }
      return 'Sin asignar';
    }
    return String(especialidad);
  }

  filtrarEspecialistas() {
    if (this.modalReserva && this.modalReserva.especialidad && typeof this.modalReserva.especialidad === 'object') {
      this.especialistasFiltrados = this.especialistas.filter(
        esp => esp.especialidad === this.modalReserva.especialidad._id
      );
    } else if (this.modalReserva && this.modalReserva.especialidad) {
      this.especialistasFiltrados = this.especialistas.filter(
        esp => esp.especialidad === this.modalReserva.especialidad
      );
    } else {
      this.especialistasFiltrados = this.especialistas;
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
    this.modalAbierto = true;
    this.filtrarEspecialistas();
  }

  abrirModal(box: Box, event: Event) {
    event.stopPropagation();
    this.modalReserva = { ...box };
    this.modalReserva._id = box.reservaId;
    this.modalReserva.box = box._id;
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.modalReserva = null;
  }

  guardarEdicion() {

    if (
      !this.modalReserva.especialidad ||
      !this.modalReserva.especialista ||
      !this.modalReserva.fecha ||
      !this.modalReserva.horaInicio ||
      !this.modalReserva.horaFin
    ) {
      this.mensajeError = 'Por favor, completa todos los campos obligatorios.';
      return;
    }

    this.mensajeError = '';

    // Combina fecha y horas en formato ISO para el backend
    const fecha = this.modalReserva.fecha; // "2025-06-19"
    const horaInicio = this.modalReserva.horaInicio; // "13:00"
    const horaFin = this.modalReserva.horaFin; // "13:15"

    this.modalReserva.fechaInicio = `${fecha}T${horaInicio}:00.000Z`;
    this.modalReserva.fechaFin = `${fecha}T${horaFin}:00.000Z`;

    // Elimina los campos auxiliares antes de enviar al backend
    delete this.modalReserva.fecha;
    delete this.modalReserva.horaInicio;
    delete this.modalReserva.horaFin;

    this.boxService.actualizarReserva(this.modalReserva).subscribe(() => {
      this.cargarBoxes();
      this.cerrarModal();
    });
  }

  // Suponiendo que cada box tiene una propiedad reserva con el _id de la reserva activa
  eliminarReserva(box: Box, event: Event) {
    event.stopPropagation();
    const reservaId = box.reservaId;
    if (typeof reservaId === 'string') {
      if (confirm('¿Estás seguro de que deseas eliminar esta reserva?')) {
        this.boxService.eliminarReserva(reservaId).subscribe(() => {
          this.cargarBoxes();
        });
      }
    }
  }

  puedeVer(pagina: string): boolean {
    if (this.rol === 'admin') return true;
    if (this.rol === 'especialista') return ['dashboard', 'calendario'].includes(pagina);
    if (this.rol === 'coordinador') return ['dashboard', 'gestionar', 'asignar', 'calendario'].includes(pagina);
    return false;
  }

  abrirModalMantenimiento() {
    this.boxService.getBoxesMantenimiento().subscribe(data => {
      this.boxesMantenimiento = data;
      this.modalMantenimientoAbierto = true;
    });
  }

  editarMantenimiento(box: any) {
    // Abre un modal o formulario para editar el mantenimiento
    // Puedes reutilizar tu modal actual o crear uno nuevo para edición
    // Ejemplo simple:
    this.modalReserva = { ...box };
    this.modalReserva._id = box._idMantenimiento || box._id; // Asegúrate de tener el id del mantenimiento
    this.modalAbierto = true;
  }

  eliminarMantenimiento(box: any) {
    if (confirm('¿Estás seguro de eliminar este mantenimiento?')) {
      const id = box._idMantenimiento || box._id; // Asegúrate de tener el id del mantenimiento
      this.boxService.eliminarMantenimiento(id).subscribe(() => {
        this.abrirModalMantenimiento(); // Recarga la lista
      });
    }
  }

  cerrarModalMantenimiento() {
    this.modalMantenimientoAbierto = false;
  }

  editarMantenimientoBox(box: any) {
    this.modalMantenimiento = { ...box };
    this.modalEditarMantenimientoAbierto = true;
  }

  cerrarModalEditarMantenimiento() {
    this.modalEditarMantenimientoAbierto = false;
    this.modalMantenimiento = {};
  }

  guardarEdicionMantenimiento() {
    // Llama a tu servicio para actualizar el mantenimiento
    this.boxService.actualizarMantenimiento(this.modalMantenimiento).subscribe(() => {
      this.abrirModalMantenimiento(); // Recarga la lista
      this.cerrarModalEditarMantenimiento();
    });
  }
}