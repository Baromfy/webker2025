import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable, catchError, forkJoin, map, of, tap } from 'rxjs';

import { TimeRangePipe } from '../pipes/time-range.pipe';
import { ReservationService } from '../services/reservation.service';
import { TableService } from '../services/table.service';
import { AuthService } from '../services/auth.service';
import { Reservation } from '../models/reservation.model';
import { BilliardTable } from '../models/billiardTable.model';
import { SnookerTable } from '../models/snookerTable.model.number';

type Table = BilliardTable | SnookerTable;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatExpansionModule,
    MatBadgeModule,
    MatListModule,
    MatChipsModule,
    MatTooltipModule,
    MatSnackBarModule,
    TimeRangePipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Reservations with optional table data
  upcomingReservations: (Reservation & { table?: Table })[] = [];
  
  loading = true;
  
  selectedStatus = 'all';
  
  constructor(
    private reservationService: ReservationService,
    private tableService: TableService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadReservations();
  }
  
  // Load reservations safely with error handling
  loadReservations(): void {
    this.loading = true;
    
    this.reservationService.getUpcomingReservations()
      .pipe(
        catchError(error => {
          this.snackBar.open('Hiba történt a foglalások betöltése során', 'Bezár', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          return of([]);
        })
      )
      .subscribe(reservations => {
        this.upcomingReservations = reservations.map(reservation => ({
          ...reservation,
          table: { number: parseInt(reservation.tableId.substring(reservation.tableId.length - 1)) } as Table
        }));
        
        this.loadTableData();
        this.loading = false;
      });
  }
  
  loadTableData(): void {
    this.upcomingReservations.forEach((reservation, index) => {
      const tableId = reservation.tableId;
      
      this.tableService.getBilliardTable(tableId)
        .pipe(
          catchError(() => {
            return this.tableService.getSnookerTable(tableId).pipe(
              catchError(() => {
                return of(null);
              })
            );
          })
        )
        .subscribe(tableData => {
          if (tableData) {
            this.upcomingReservations[index] = {
              ...this.upcomingReservations[index],
              table: tableData
            };
          }
        });
    });
  }
  
  cancelReservation(reservation: Reservation): void {
    if (!reservation.id) {
      this.snackBar.open('Hiba történt a foglalás azonosításakor', 'Bezár', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }
    
    this.loading = true;
    this.reservationService.deleteReservation(reservation.id).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open('Foglalás sikeresen törölve', 'Bezár', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.loadReservations();
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open(
          'Hiba történt a foglalás törlésekor: ' + error.message,
          'Bezár',
          {
            duration: 5000,
            panelClass: ['error-snackbar']
          }
        );
      }
    });
  }
  
  addReservation(): void {
    window.location.href = '/reservation';
  }
  
  isPastEndTime(reservation: Reservation): boolean {
    return new Date(reservation.endTime) < new Date();
  }
  
  isActiveReservation(reservation: Reservation): boolean {
    const now = new Date();
    return new Date(reservation.startTime) <= now && new Date(reservation.endTime) >= now;
  }
  
  getStatusText(reservation: Reservation): string {
    if (this.isPastEndTime(reservation)) {
      return 'Lejárt';
    } else if (this.isActiveReservation(reservation)) {
      return 'Aktív';
    } else {
      return 'Közelgő';
    }
  }
  
  getStatusColor(reservation: Reservation): string {
    if (this.isPastEndTime(reservation)) {
      return 'accent';
    } else if (this.isActiveReservation(reservation)) {
      return 'primary';
    } else {
      return 'primary';
    }
  }
}
