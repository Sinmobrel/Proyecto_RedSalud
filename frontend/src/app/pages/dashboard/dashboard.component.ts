import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoxService } from '../../services/box.service';
import { EspecialistaService } from '../../services/especialista.service';
import { EspecialidadService } from '../../services/especialidad.service';
import { ReservaService } from '../../services/reservas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  cantidadBoxes = 0;
  cantidadBoxesMantenimiento = 0;
  cantidadEspecialistas = 0;
  cantidadEspecialidades = 0;
  cantidadReservas = 0;

  especialidadNombre = '';

  especialistaId: string | null = null;
  rol = '';
  usuario: any = null;
  nombreUsuario = '';
  currentYear = new Date().getFullYear();

  constructor(
    private router: Router,
    private boxService: BoxService,
    private especialistaService: EspecialistaService,
    private especialidadService: EspecialidadService,
    private reservaService: ReservaService
  ) { }

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.rol = localStorage.getItem('rol') || '';
      const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
      this.nombreUsuario = usuario.nombre || '';
      if (this.rol === 'especialista') {
        this.especialistaId = usuario._id || null;
        if (usuario.especialidad && typeof usuario.especialidad === 'object' && usuario.especialidad.nombre) {
          this.especialidadNombre = usuario.especialidad.nombre;
        } else if (usuario.especialidad) {
          this.especialidadService.getEspecialidad(usuario.especialidad).subscribe((e: any) => {
            this.especialidadNombre = e.nombre;
          });
        }
      }

      if (this.rol === 'especialista' && this.especialistaId) {
        this.reservaService.obtenerTodasLasReservas().subscribe((reservas: any[]) => {
          this.cantidadReservas = reservas.filter(r =>
            r.especialista?._id === this.especialistaId || r.especialista === this.especialistaId
          ).length;
        });
      } else {
        this.boxService.getBoxes().subscribe(boxes => {
          this.cantidadBoxes = boxes.length;
          this.cantidadBoxesMantenimiento = boxes.filter(b => b.estado === 'Mantenimiento').length;
        });
        this.especialistaService.getEspecialistas().subscribe(especialistas => {
          this.cantidadEspecialistas = especialistas.length;
        });
        this.especialidadService.getEspecialidades().subscribe(especialidades => {
          this.cantidadEspecialidades = especialidades.length;
        });
        this.reservaService.obtenerTodasLasReservas().subscribe((reservas: any[]) => {
          this.cantidadReservas = reservas.length;
        });
      }
    }
  }

  irAGestionar() {
    this.router.navigate(['/gestionar']);
  }

  irAAsignar() {
    this.router.navigate(['/asignar']);
  }

  irACalendario() {
    this.router.navigate(['/calendario']);
  }

  puedeVer(boton: string): boolean {
    if (this.rol === 'admin') return true;
    if (this.rol === 'especialista') return ['calendario'].includes(boton);
    if (this.rol === 'coordinador') return ['gestionar', 'asignar', 'calendario'].includes(boton);
    return false;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
