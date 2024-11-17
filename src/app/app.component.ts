import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { UserService } from './usuario.service';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,RouterOutlet,RouterLink,RouterLinkActive,MatButtonModule,MatIconModule,MatDivider,MatListModule ],

  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  title = 'CursosCliente';
  constructor(public apiService: ApiService, private router: Router, private userService: UserService) {}


  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/principal']); 
    this.userService.clearUsuario();
  }
}

