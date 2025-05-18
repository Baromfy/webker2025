import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, combineLatest, map, of, startWith, switchMap } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { TableCardComponent } from '../table-card/table-card.component';
import { FilterTablePipe } from '../pipes/filter-table.pipe';
import { TimeRangePipe } from '../pipes/time-range.pipe';
import { BilliardTable } from '../models/billiardTable.model';
import { SnookerTable } from '../models/snookerTable.model.number';
import { Reservation } from '../models/reservation.model';
import { TableType } from '../models/tableType.model';
import { TableService } from '../services/table.service';
import { ReservationService } from '../services/reservation.service';
import { AuthService } from '../services/auth.service';

type Table = BilliardTable | SnookerTable;

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatNativeDateModule,
    MatStepperModule,
    MatIconModule,
    MatSnackBarModule,
    MatGridListModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    TableCardComponent,
    FilterTablePipe,
    TimeRangePipe
  ],
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {
  billiardTables: BilliardTable[] = [
    { id: '1', number: 1, typeId: '1', status: 'available', location: 'Földszint' },
    { id: '2', number: 2, typeId: '1', status: 'available', location: 'Földszint' },
    { id: '3', number: 3, typeId: '1', status: 'available', location: 'Földszint' },
    { id: '4', number: 4, typeId: '2', status: 'available', location: 'Földszint' },
  ];
  
  tableTypes: TableType[] = [
    { 
      id: '1', 
      name: 'Pool Asztal', 
      description: 'Standard méretű pool biliárd asztal',
      hourlyRate: 2500,
      isAvailable: true
    },
    { 
      id: '2', 
      name: 'Snooker Asztal', 
      description: 'Professzionális snooker asztal',
      hourlyRate: 3500,
      isAvailable: true
    }
  ];
  
  reservationForm: FormGroup;
  
  loading = false;
  selectedTable: Table | null = null;
  selectedDate: Date = new Date();
  cols = 3;
  
  availableTimeSlots: {start: Date, end: Date}[] = [];
  
  constructor(
    private fb: FormBuilder,
    private tableService: TableService,
    private reservationService: ReservationService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private breakpointObserver: BreakpointObserver
  ) {
    this.reservationForm = this.fb.group({
      date: [new Date(), Validators.required],
      startTime: ['', Validators.required],
      duration: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
      notes: ['']
    });
    
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large])
      .subscribe(result => {
        if (result.breakpoints[Breakpoints.XSmall]) {
          this.cols = 1;
        } else if (result.breakpoints[Breakpoints.Small]) {
          this.cols = 2;
        } else if (result.breakpoints[Breakpoints.Medium]) {
          this.cols = 3;
        } else {
          this.cols = 4;
        }
      });
  }

  ngOnInit(): void {
    this.generateTimeSlots();
    
    this.reservationForm.get('date')?.valueChanges.subscribe(() => {
      this.generateTimeSlots();
    });
  }
  
  onTableSelect(table: Table): void {
    this.selectedTable = table;
  }
  
  onTableReserve(table: Table): void {
    this.selectedTable = table;
    document.getElementById('reservation-form')?.scrollIntoView({ behavior: 'smooth' });
  }
  
  onTableDetails(table: Table): void {
    this.snackBar.open(`Asztal ${table.number} részletei`, 'Bezár', {
      duration: 3000
    });
  }
  
  onSubmit(): void {
    if (this.reservationForm.valid && this.selectedTable) {
      this.loading = true;
      
      const formValues = this.reservationForm.value;
      const startTime = new Date(formValues.startTime);
      
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + formValues.duration);
      
      const newReservation: Omit<Reservation, 'id'> = {
        userId: 'current-user-id',
        tableId: this.selectedTable.id,
        startTime: startTime,
        endTime: endTime
      };
      
      this.authService.user$.pipe(
        switchMap(user => {
          if (!user) {
            throw new Error('You must be logged in to make a reservation');
          }
          
          newReservation.userId = user.uid;
          
          return this.reservationService.isTableAvailable(
            this.selectedTable!.id, 
            startTime, 
            endTime
          );
        }),
        switchMap(isAvailable => {
          if (!isAvailable) {
            throw new Error('The selected table is not available during the selected time');
          }
          
          return this.reservationService.createReservation(newReservation);
        })
      ).subscribe({
        next: (docRef) => {
          this.loading = false;
          this.snackBar.open('Sikeres foglalás!', 'Bezár', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          
          this.reservationForm.reset({
            date: new Date(),
            duration: 1
          });
          this.selectedTable = null;
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open(
            error.message || 'Hiba történt a foglalás során', 
            'Bezár', 
            {
              duration: 5000,
              panelClass: ['error-snackbar']
            }
          );
        }
      });
    }
  }
  
  calculateTotal(): number {
    if (!this.selectedTable || !this.reservationForm.valid) {
      return 0;
    }
    

    const tableType = this.tableTypes.find(type => type.id === '1'); 
    if (!tableType) {
      return 0;
    }
    
    const duration = this.reservationForm.get('duration')?.value || 0;
    return tableType.hourlyRate * duration;
  }
  

  private generateTimeSlots(): void {
    const selectedDate = this.reservationForm.get('date')?.value || new Date();
    const slots: {start: Date, end: Date}[] = [];
    

    const openingHour = 10;
    const closingHour = 22;
    

    for (let hour = openingHour; hour < closingHour; hour++) {
      const startTime = new Date(selectedDate);
      startTime.setHours(hour, 0, 0, 0);
      
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + 1);
      
      slots.push({ start: startTime, end: endTime });
    }
    
    this.availableTimeSlots = slots;
  }
  

  formatTime(date: Date): string {
    return date.toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' });
  }
  

  get today(): Date {
    return new Date();
  }
  

  isTableAvailable(table: Table): boolean {

    return true;
  }
  

  getTableType(table: Table): TableType | undefined {

    return this.tableTypes[0];
  }
}
