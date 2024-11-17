
export interface resultadosConsulta{
    id: number;
    nombre: string;
}

export interface credensiales{
email: string;
password: string;
}

export interface registroUsuario{
  
    nombre: string;
    email: string;
    password: string;
}

export interface PreguntaDTO {
    id: number;
    pregunta: string;
    grupoId: number;
  }

  export interface Respuesta {
    respuestas: RespuestaDetalle[];
  }

  export interface RespuestaDetalle {
    valor: number;
    preguntaId: number;
    usuarioId: number;
  }
  
  export interface TotalGrupo {
    total: number;
    grupoId: number;
    usuarioId: number;

  }


  