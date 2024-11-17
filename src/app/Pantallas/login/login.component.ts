import { Component } from '@angular/core';
import { ApiService } from '../../api.service';
import { Observable, of } from 'rxjs';
import { credensiales } from '../../consulta';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { JsonPipe, AsyncPipe, NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { UserService } from '../../usuario.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule, MatIcon, JsonPipe, AsyncPipe, FormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  creds: credensiales = {
    email: '',
    password: ''
  };
  showError: boolean = false;
  loginError: string = ''; 

  constructor(private apiService: ApiService, private router: Router, private userService: UserService) {}

  login(form: NgForm) {
    // Validar si email y password están vacíos
    if (!this.creds.email || !this.creds.password) {
      this.showError = true;
    
      return;
    }
  
    // Llamar a obtenerUsuarioPorEmail antes de iniciar sesión
    this.apiService.getUsuarioByEmail(this.creds.email).subscribe({
      next: (usuario) => {
        this.userService.setUsuario(usuario);
        console.log("Usuario encontrado:", usuario);
        // Si el usuario existe, intenta iniciar sesión
        this.intentarLogin();
      },
      error: (error) => {
        console.error("Error al obtener usuario:", error.message);
        this.loginError = 'Usuario no encontrado para el email proporcionado.';
      }
    });
  }
  
  // Separar la lógica de inicio de sesión en un método para mayor claridad
  intentarLogin() {
    this.apiService.login(this.creds)
      .pipe(
        catchError(error => {
          console.log("Error durante el login:", error);
          if (error.status === 401) {
            this.loginError = 'No se encuentra registrado el usuario';
          } else {
            this.loginError = 'Error en el inicio de sesión. Verifique sus credenciales';
          }
          return of(null);
        })
      )
      .subscribe(response => {
        const token = localStorage.getItem('token'); // Revisa si se generó el token
        if (token) {
         
          console.log("Login exitoso, redirigiendo...");
          this.router.navigate(['/cuestionarios']);
        } else {
          console.log("Respuesta de login fallida o nula");
        }
      });
  }
  
}
