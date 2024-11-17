// Define la interfaz para el detalle de cada respuesta
export interface RespuestaDetalle {
  preguntaId: number;
  valor: number;
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../api.service';
import { PreguntaDTO, Respuesta, TotalGrupo } from '../../consulta';
import { AsyncPipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../usuario.service';

@Component({
  selector: 'app-preguntas',
  standalone: true,
  imports: [MatButtonModule, MatDivider, MatIconModule, JsonPipe, AsyncPipe, NgFor, NgIf],
  templateUrl: './preguntas.component.html',
  styleUrls: ['./preguntas.component.css']
})

export class PreguntasComponent implements OnInit {
  numero!: number;
  preguntas: PreguntaDTO[] = [];
  respuestas: RespuestaDetalle[] = [];
  nombres: string[] = ["", "REALISTA", "INVESTIGADOR", "ARTISTA", "SOCIAL", "EMPLEADOR", "CONVENCIONAL"];
  nombreInteres!: string;
  errorMensaje: string = ''; // Variable para almacenar el mensaje de error
  totalRespuestas: number = 0; // Variable para almacenar el total de las respuestas

  constructor(private route: ActivatedRoute, private apiService: ApiService,private userService: UserService, private routerr: Router) {}

  ngOnInit(): void {
    this.numero = Number(this.route.snapshot.paramMap.get('numero'));
    this.nombreInteres = this.nombres[this.numero] || "Interés desconocido";
    console.log(`Número recibido: ${this.numero}`);
    this.obtenerPreguntas();



  }

  obtenerPreguntas(): void {
    this.apiService.getPreguntasByGrupoId(this.numero).subscribe({
      next: (preguntas) => {
        this.preguntas = preguntas;
        console.log('Preguntas recibidas:', this.preguntas);
      },
      error: (err) => {
        console.error('Error al obtener preguntas:', err);
      }
    });
  }

  guardarRespuesta(preguntaId: number, valor: number): void {
    const respuestaIndex = this.respuestas.findIndex(r => r.preguntaId === preguntaId);
    if (respuestaIndex !== -1) {
      this.respuestas[respuestaIndex].valor = valor;
    } else {
      this.respuestas.push({ preguntaId, valor });
    }
    this.actualizarSumaRespuestas();
  }
    // Función para sumar los valores de las respuestas
    actualizarSumaRespuestas(): void {
      this.totalRespuestas = this.respuestas.reduce((total, respuesta) => total + respuesta.valor, 0);
      console.log('Suma de las respuestas:', this.totalRespuestas);
    }

  guardarRespuestas(): void {
    const todasContestadas = this.preguntas.every(pregunta =>
      this.respuestas.some(respuesta => respuesta.preguntaId === pregunta.id)
    );
  
    if (!todasContestadas) {
      this.errorMensaje = 'Por favor, contesta todas las preguntas antes de finalizar.';
    } else {
      this.errorMensaje = '';
      const usuarioId = this.userService.getUsuario().id;
  
      // Mapea las respuestas directamente, sin la propiedad 'respuestas'
      const respuestasParaEnviar = this.respuestas.map(respuesta => ({
        valor: respuesta.valor,
        preguntaId: respuesta.preguntaId,
        usuarioId: usuarioId
      }));
  
      console.log(respuestasParaEnviar);
      console.log('Suma de las respuestas:', this.totalRespuestas);

      const totalGrupo: TotalGrupo = {
        total: this.totalRespuestas,  // Suma de las respuestas
        grupoId: this.numero,  // El grupo actual (según la variable 'numero')
        usuarioId: usuarioId  // El ID del usuario
      };

      this.apiService.guardarRespuestas(respuestasParaEnviar).subscribe({
        next: () => console.log('Respuestas guardadas con éxito'),
        error: (err) => console.error('Error al guardar respuestas:', err)
      });

      this.apiService.guardarTotalGrupo(totalGrupo).subscribe({
        next: (response) => {
          console.log('TotalGrupo guardado con éxito:', response);
          // Aquí puedes agregar cualquier acción posterior a la respuesta de la API
        },
        error: (err) => {
          console.error('Error al guardar el TotalGrupo:', err);
          this.errorMensaje = 'Hubo un problema al guardar el TotalGrupo';
        }
      });

      this.routerr.navigate(['/cuestionarios']);
    }
  }


}
