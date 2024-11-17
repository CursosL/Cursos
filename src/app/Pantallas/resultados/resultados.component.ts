import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ApiService } from '../../api.service';
import { UserService } from '../../usuario.service';

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.css']
})

export class ResultadosComponent implements OnInit {
  totales: any[] = [];
  grupoMayor: string | null = null; // Nombre del grupo con el mayor total
  view: [number, number] = [1000, 400];

  customColors: any[] = [
    { name: 'Realista', value: '#ffcc33' },
    { name: 'Investigador', value: '#33FF57' },
    { name: 'Artista', value: '#00eaff' },
    { name: 'Social', value: '#2b6cff' },
    { name: 'Emprendedor', value: '#FF8C33' },
    { name: 'Convencional', value: '#B833FF' },
  ];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const usuarioId = this.userService.getUsuario().id;
    const gruposMap: { [key: number]: string } = {
      1: 'Realista',
      2: 'Investigador',
      3: 'Artista',
      4: 'Social',
      5: 'Emprendedor',
      6: 'Convencional',
    };

    this.apiService.getTotalesPorUsuario(usuarioId).subscribe(
      (totales) => {
        this.totales = totales.map((total: any) => ({
          name: gruposMap[total.grupoId] || 'Desconocido',
          value: total.total,
        }));

        // Encontrar el grupo con el mayor total
        if (this.totales.length > 0) {
          const grupoConMayorTotal = this.totales.reduce((prev, current) =>
            prev.value > current.value ? prev : current
          );
          this.grupoMayor = grupoConMayorTotal.name;
        }
      },
      (error) => {
        console.error('Error al obtener totales:', error);
      }
    );
  }
}

