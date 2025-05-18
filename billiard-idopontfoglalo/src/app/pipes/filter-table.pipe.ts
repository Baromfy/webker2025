import { Pipe, PipeTransform } from '@angular/core';
import { BilliardTable } from '../models/billiardTable.model';
import { SnookerTable } from '../models/snookerTable.model.number';
import { TableType } from '../models/tableType.model';

type Table = BilliardTable | SnookerTable | any;

@Pipe({
  name: 'filterTable',
  standalone: true
})
export class FilterTablePipe implements PipeTransform {
  /**
   * Filters an array of tables based on given criteria
   * 
   * @param tables The array of tables to filter
   * @param filters The filter criteria
   * @returns Filtered array of tables
   */
  transform(
    tables: Table[],
    filters: {
      tableNumbers?: number[],
      tableTypes?: string[],
      priceRange?: { min: number, max: number },
      availability?: boolean,
      searchTerm?: string
    } = {}
  ): Table[] {
    if (!tables || !tables.length) {
      return [];
    }

    if (!filters || Object.keys(filters).length === 0) {
      return tables;
    }

    return tables.filter(table => {
      // Filter by table numbers if specified
      if (filters.tableNumbers && filters.tableNumbers.length > 0) {
        if (!filters.tableNumbers.includes(table.number)) {
          return false;
        }
      }
      
      // Filter by table types if specified and if the table has type information
      if (filters.tableTypes && filters.tableTypes.length > 0 && 'type' in table) {
        if (!filters.tableTypes.includes(table.type)) {
          return false;
        }
      }
      
      // Filter by price range if specified and if the table has price information
      if (filters.priceRange && 'hourlyRate' in table) {
        const { min, max } = filters.priceRange;
        if (table.hourlyRate < min || table.hourlyRate > max) {
          return false;
        }
      }
      
      // Filter by availability if specified
      if (filters.availability !== undefined && 'isAvailable' in table) {
        if (table.isAvailable !== filters.availability) {
          return false;
        }
      }
      
      // Filter by search term if specified
      if (filters.searchTerm && filters.searchTerm.trim() !== '') {
        const term = filters.searchTerm.toLowerCase().trim();
        
        // Search in different properties based on table type
        let found = false;
        
        // Search in number
        if ('number' in table && table.number.toString().includes(term)) {
          found = true;
        }
        
        // Search in name if it exists
        if ('name' in table && table.name.toLowerCase().includes(term)) {
          found = true;
        }
        
        // Search in description if it exists
        if ('description' in table && table.description.toLowerCase().includes(term)) {
          found = true;
        }
        
        if (!found) {
          return false;
        }
      }
      
      // If the table passes all filters, include it
      return true;
    });
  }
}
