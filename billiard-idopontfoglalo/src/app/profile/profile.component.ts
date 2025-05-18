import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable, combineLatest, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { ReservationService } from '../services/reservation.service';
import { Reservation } from '../models/reservation.model';
import { User } from '../models/user.model';
import { TimeRangePipe } from '../pipes/time-range.pipe';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatBadgeModule,
    MatTooltipModule,
    TimeRangePipe
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userProfile$: Observable<User | null>;
  upcomingReservations$: Observable<Reservation[]>;
  pastReservations$: Observable<Reservation[]>;
  
  profileData$: Observable<{
    user: User | null,
    upcomingReservations: Reservation[],
    pastReservations: Reservation[]
  }>;
  
  loading = true;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private reservationService: ReservationService,
    private router: Router
  ) {
    this.userProfile$ = this.userService.getCurrentUserProfile();
    this.upcomingReservations$ = this.reservationService.getUpcomingReservations();
    
    this.pastReservations$ = this.getPastReservations();
    
    this.profileData$ = combineLatest([
      this.userProfile$,
      this.upcomingReservations$,
      this.pastReservations$
    ]).pipe(
      map(([user, upcomingReservations, pastReservations]) => ({
        user,
        upcomingReservations,
        pastReservations
      }))
    );
  }

  ngOnInit(): void {
    this.profileData$.subscribe({
      next: () => {
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
      }
    });
  }

  cancelReservation(reservationId: string): void {
    this.reservationService.deleteReservation(reservationId).subscribe({
      next: () => {
      },
      error: (error) => {
      }
    });
  }

  private getPastReservations(): Observable<Reservation[]> {
    return this.authService.user$.pipe(
      map(user => {
        if (!user) {
          return [];
        }
        return [];
      })
    );
  }
}
