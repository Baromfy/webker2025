import { Component, Input, Output, EventEmitter, HostListener, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

import { HighlightDirective } from '../directives/highlight.directive';
import { TooltipDirective } from '../directives/tooltip.directive';
import { RippleDirective } from '../directives/ripple.directive';

import { BilliardTable } from '../models/billiardTable.model';
import { SnookerTable } from '../models/snookerTable.model.number';
import { TableType } from '../models/tableType.model';

type Table = BilliardTable | SnookerTable | any;

@Component({
  selector: 'app-table-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatTooltipModule,
    RouterModule,
    HighlightDirective,
    TooltipDirective,
    RippleDirective
  ],
  templateUrl: './table-card.component.html',
  styleUrls: ['./table-card.component.css']
})
export class TableCardComponent {
  @Input() table!: Table;
  @Input() tableType?: TableType;
  @Input() isAvailable: boolean = true;
  @Input() isSelected: boolean = false;
  @Input() currentReservationCount: number = 0;
  
  @Output() selectTable = new EventEmitter<Table>();
  @Output() reserveTable = new EventEmitter<Table>();
  @Output() viewDetails = new EventEmitter<Table>();
  
  @HostBinding('class.table-card-available') 
  get isAvailableClass() { return this.isAvailable; }
  
  @HostBinding('class.table-card-selected') 
  get isSelectedClass() { return this.isSelected; }
  
  @HostBinding('class.table-card-unavailable') 
  get isUnavailableClass() { return !this.isAvailable; }
  
  @HostListener('mouseenter') 
  onMouseEnter() {
  }
  
  @HostListener('mouseleave') 
  onMouseLeave() {
  }
  
  onSelect() {
    this.selectTable.emit(this.table);
  }
  
  onReserve(event: Event) {
    event.stopPropagation();
    this.reserveTable.emit(this.table);
  }
  
  onViewDetails(event: Event) {
    event.stopPropagation();
    this.viewDetails.emit(this.table);
  }
  
  getTableIcon(): string {
    if (this.tableType && this.tableType.name) {
      const name = this.tableType.name.toLowerCase();
      if (name.includes('snooker')) {
        return 'sports_bar';
      } else if (name.includes('pool')) {
        return 'sports_basketball';
      } else if (name.includes('carom')) {
        return 'sports_baseball';
      }
    }
    return 'sports_basketball';
  }
}
