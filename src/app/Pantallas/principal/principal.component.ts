import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider'; // Corrige el import de MatDividerModule
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../usuario.service';




@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatDividerModule],
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css'] // Cambia styleUrl a styleUrls
})
export class PrincipalComponent {
  constructor(
    private userService: UserService // Inyecta UserService
  ) { }
  ngOnInit(): void {
    // Eliminar el token del localStorage al cargar la ruta principal
    localStorage.removeItem('token');
    this.userService.clearUsuario();
  }
}





