import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe, JsonPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { ApiService } from '../../api.service';
import { UserService } from '../../usuario.service';
import { MatSnackBar } from '@angular/material/snack-bar'; // Importa MatSnackBar para mostrar mensajes

@Component({
  selector: 'app-cuestionarios',
  standalone: true,
  imports: [MatButtonModule, MatDivider, MatIconModule, JsonPipe, AsyncPipe,NgFor,NgClass,NgIf],
  templateUrl: './cuestionarios.component.html',
  styleUrls: ['./cuestionarios.component.css']
})


export class CuestionariosComponent implements OnInit {
  gruposMap: { [key: number]: string } = {
    1: 'Realista',
    2: 'Investigador',
    3: 'Artista',
    4: 'Social',
    5: 'Emprendedor',
    6: 'Convencional',
  };
  totales: { grupoId: number; total: number }[] = [];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar // Inyección del servicio MatSnackBar
  ) {}
  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && this.router.url === '/cuestionarios') {
        this.cargarTotales();
      }
    });
  
    this.cargarTotales();
  }
  
  private cargarTotales(): void {
    const usuarioId = this.userService.getUsuario().id;
  
    this.apiService.getTotalesPorUsuario(usuarioId).subscribe(
      (totales) => {
        this.totales = totales;
        console.log('Totales obtenidos:', totales);
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error al obtener totales:', error);
      }
    );
  }

  esCompletado(grupoId: number): boolean {
    
    return this.totales.some((total) => total.grupoId === grupoId && total.total > 0);
  }

  onContestar(grupoId: number): void {
    if (this.esCompletado(grupoId)) {
      // Mostrar un mensaje si ya está completado
      this.snackBar.open('Esta encuesta ya ha sido contestada.', 'Cerrar', {
        duration: 3000, // Duración del mensaje (en ms)
        verticalPosition: 'top', // Posición del mensaje
        horizontalPosition: 'center',
      });
    } else {
      // Navegar si no está completado
      console.log(`Número enviado: ${grupoId}`);
      this.router.navigate(['/preguntas', grupoId]);
    }
  }
}
