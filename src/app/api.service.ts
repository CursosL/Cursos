import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { credensiales, PreguntaDTO, registroUsuario, Respuesta, RespuestaDetalle, resultadosConsulta, TotalGrupo } from './consulta';


@Injectable({
  providedIn: 'root' // Esto hace que el servicio esté disponible en toda la aplicación.
})

export class ApiService {
  constructor(private http: HttpClient) {}

  getPreguntasByGrupoId(grupoId: number): Observable<PreguntaDTO[]> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const params = new HttpParams().set('grupoId', grupoId.toString());
  
    return this.http.get<PreguntaDTO[]>('https://beneficial-reprieve-production.up.railway.app/api/preguntas/grupo', { headers, params }).pipe(
      catchError(this.handleError)
    );
  }

  getData(): Observable<resultadosConsulta> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<resultadosConsulta>('https://beneficial-reprieve-production.up.railway.app/api/grupos', { headers });
  }

  login(creds:credensiales){
    return this.http.post('https://beneficial-reprieve-production.up.railway.app/login',creds,{
      observe:'response'
    }).pipe(map((response: HttpResponse<any>)=>{
      const body = response.body;
      const headers = response.headers;

      const bearerToken = headers.get('Authorization')!;
      const token = bearerToken.replace('Bearer ', '');

      localStorage.setItem('token',token);
      
      return body;
    }))
  }

  getToken(){
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken(); // Devuelve true si hay token
  }


  Registro(creds: registroUsuario) {
    return this.http.post('https://beneficial-reprieve-production.up.railway.app/api/usuarios', creds, {
      observe: 'response'  // Observa solo la respuesta completa, sin procesar el cuerpo
    }).pipe(map((response: HttpResponse<any>) => {
      if (response.status === 201) {
        console.log("Usuario registrado con éxito");
      }
      return null;  // Retorna null para no enviar nada al componente
    }));
  }

  verificarEmail(email: string): Observable<boolean> {
    return this.http.get<boolean>(`https://beneficial-reprieve-production.up.railway.app/api/usuarios/buscar?email=${email}`);
  }


  private apiUrl = 'https://beneficial-reprieve-production.up.railway.app/api/usuarios/buscard';
  
  getUsuarioByEmail(email: string): Observable<registroUsuario> {
    const params = new HttpParams().set('email', email.trim());

    return this.http.get<registroUsuario>(this.apiUrl, { params }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 404) {
      return throwError(() => new Error(`Usuario no encontrado para el email proporcionado.`));
    } else {
      return throwError(() => new Error(`Ocurrió un error: ${error.message}`));
    }
  }



  guardarRespuestas(respuestas: RespuestaDetalle[]): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    });
  
    return this.http.post('https://beneficial-reprieve-production.up.railway.app/api/respuestas/guardar', respuestas, { headers }).pipe(
        map(response => {
            console.log("Respuestas guardadas con éxito", response);
            return response;
        }),
        catchError(this.handleError)
    );
  }

  guardarTotalGrupo(totalGrupo: TotalGrupo): Observable<TotalGrupo> {
    const token = this.getToken();  // Obtén el token de autenticación
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    // Aquí hacemos el POST a la API
    return this.http.post<TotalGrupo>('https://beneficial-reprieve-production.up.railway.app/api/totales', totalGrupo, { headers }).pipe(
      map(response => {
        console.log("TotalGrupo guardado con éxito", response);
        return response;
      }),
      catchError(this.handleError)
    );
  }

  
  getTotalesPorUsuario(usuarioId: number): Observable<TotalGrupo[]> {
    const token = this.getToken(); // Obtén el token de autenticación
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Incluye el token si es necesario
      'Content-Type': 'application/json'
    });
  
    const params = new HttpParams().set('usuarioId', usuarioId.toString());
  
    return this.http.get<TotalGrupo[]>('https://beneficial-reprieve-production.up.railway.app/api/totales/usuario', { headers, params }).pipe(
      catchError(() => {
        console.error("Error al obtener los datos. Retornando un arreglo vacío.");
        return of([]); // Retorna un arreglo vacío en caso de error
      })
    );
  }
  








}