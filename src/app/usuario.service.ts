import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usuario: any = null;

  constructor() {
    // Al iniciar, intenta cargar el usuario desde el localStorage
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      this.usuario = JSON.parse(usuarioGuardado);
    }
  }

  setUsuario(usuario: any) {
    this.usuario = usuario;
    localStorage.setItem('usuario', JSON.stringify(usuario)); // Guarda en localStorage
  }

  getUsuario() {
    return this.usuario;
  }

  clearUsuario() {
    this.usuario = null;
    localStorage.removeItem('usuario'); // Elimina del localStorage
  }

  isAuthenticated(): boolean {
    return this.usuario != null;
  }
}
