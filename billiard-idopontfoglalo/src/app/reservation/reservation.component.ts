import { Component } from '@angular/core';
import { BilliardTable } from '../models/billiardTable.model';
import { CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';


@Component({
  selector: 'app-reservation',
  imports: [CommonModule, MatCardModule],
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent {
  billiardTables: BilliardTable[] = [
    { id: '1', number: 1 },
    { id: '2', number: 2 },
    { id: '3', number: 3 },
    { id: '4', number: 4 },
  ];

  reserveTable(table: BilliardTable): void {
    alert(`Asztal ${table.number} foglalva!`);
  }
}
