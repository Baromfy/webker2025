import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-navbar',
  imports: [
    MatButtonModule, 
    MatToolbarModule, 
    MatIconModule,
    MatMenuModule,
    CommonModule, 
    RouterModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  user$: Observable<User | null>;
  
  constructor(private authService: AuthService) {
    this.user$ = this.authService.user$;
  }
  
  ngOnInit(): void {
    // Component initialization logic if needed
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
      },
      error: (error) => {
      }
    });
  }
}
