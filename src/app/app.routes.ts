import { Routes } from '@angular/router';

import { InformacionComponent } from './Pantallas/informacion/informacion.component';
import { LoginComponent } from './Pantallas/login/login.component';
import { LogoutComponent } from './Pantallas/logout/logout.component';
import { PreguntasComponent } from './Pantallas/preguntas/preguntas.component';
import { PrincipalComponent } from './Pantallas/principal/principal.component';
import { ResultadosComponent } from './Pantallas/resultados/resultados.component';
import { CuestionariosComponent } from './Pantallas/cuestionarios/cuestionarios.component';
import { RegistroComponent } from './registro/registro.component';
import { AuthGuard } from './helpers/auth.guard';

export const routes: Routes = [
  { path: 'principal', component: PrincipalComponent},
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent, canActivate: [AuthGuard] },
  { path: 'cuestionarios', component: CuestionariosComponent, canActivate: [AuthGuard] },
  { path: 'informacion', component: InformacionComponent, canActivate: [AuthGuard] },
  { path: 'preguntas/:numero', component: PreguntasComponent, canActivate: [AuthGuard]  },
  { path: 'resultados', component: ResultadosComponent, canActivate: [AuthGuard] },
  { path: 'registro', component: RegistroComponent },
  { path: '', redirectTo: '/principal', pathMatch: 'full' },
  { path: '**', redirectTo: '/principal' }
];

