import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  rut = '';
  password = '';
  error = '';

  currentYear = new Date().getFullYear();

  constructor(private auth: AuthService, private router: Router) { }

  login() {
    this.auth.login(this.rut, this.password).subscribe({
      next: (res) => {
        console.log(res);
        // Guarda el tipo de usuario y el token si lo necesitas
        localStorage.setItem('rol', res.usuario.tipo); // 'admin', 'coordinador', 'especialista'
        localStorage.setItem('usuario', JSON.stringify(res.usuario.datos)); // datos completos del usuario referenciado
        localStorage.setItem('token', res.token); // si usas JWT

        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.error.mensaje || 'Usuario o contraseña incorrectos';
      }
    });
  }

  onRutInput(event: any) {
    let value = event.target.value.replace(/[^0-9]/g, ''); // Solo números
    if (value.length > 8) value = value.slice(0, 9); // Máximo 9 caracteres (8+1)
    if (value.length > 1) {
      // Inserta el guion antes del último dígito
      value = value.slice(0, value.length - 1) + '-' + value.slice(-1);
    }
    event.target.value = value;
    this.rut = value;
  }
}
