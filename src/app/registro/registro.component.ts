import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { registroUsuario } from '../consulta';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  public usuario$!: Observable<registroUsuario>;
  creds: registroUsuario = {
    nombre: '',
    email: '',
    password: ''
  };
  confirmPassword: string = '';
  emailExiste: boolean = false;
  passwordError: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  // Método para validar el formato del correo
  emailValido(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Patrón básico para un email
    return emailRegex.test(email);
  }

  // Método para verificar si el correo ya existe
  async verificarEmail() {
    if (this.creds.email) {
      try {
        const exists = await this.apiService.verificarEmail(this.creds.email).toPromise();
        this.emailExiste = exists ?? false;
      } catch (error: any) {
        if (error.status === 404) {
          this.emailExiste = false; // Email no registrado
        } else {
          console.error('Error al verificar email:', error);
        }
      }
    }
  }

async register(form: NgForm) {
  if (form.valid) {
    // Validar formato del correo
    if (!this.emailValido(this.creds.email)) {
      return;
    }

    // Verificar si el correo ya existe
    await this.verificarEmail();
    if (this.emailExiste) {
      return;
    }

    // Validar longitud de la contraseña
    if (this.creds.password.length < 8) {
      this.passwordError = "La contraseña debe tener al menos 8 caracteres";
      return;
    }

    // Validar coincidencia de contraseñas
    if (this.creds.password !== this.confirmPassword) {
      this.passwordError = "Las contraseñas no coinciden";
      return;
    } else {
      this.passwordError = ""; // Limpia el error si coinciden
    }

    // Realizar el registro
    this.apiService.Registro(this.creds).subscribe(
      response => {
        console.log("Registro exitoso", response);
        this.router.navigate(['/login']);
      },
      error => {
        console.error("Error en el registro", error);
        alert("Hubo un problema al registrar el usuario");
      }
    );
  }
}
}
