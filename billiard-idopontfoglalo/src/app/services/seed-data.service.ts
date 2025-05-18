import { Injectable, inject } from '@angular/core';
import { Firestore, collection, getDocs, query, where, addDoc, doc, setDoc, DocumentReference } from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';
import { TableService } from './table.service';
import { BilliardTable } from '../models/billiardTable.model';
import { SnookerTable } from '../models/snookerTable.model.number';
import { TableType } from '../models/tableType.model';

@Injectable({
  providedIn: 'root'
})
export class SeedDataService {
  private firestore = inject(Firestore);
  private tableTypesCollection = 'tableTypes';
  private billiardTablesCollection = 'billiardTables';
  private snookerTablesCollection = 'snookerTables';

  constructor(private tableService: TableService) {}

  async initializeDatabase(): Promise<void> {
    try {
      const tableTypes = await this.createTableTypes();
      
      if (tableTypes.length > 0) {
        await this.createBilliardTables(tableTypes);
        await this.createSnookerTables(tableTypes);
      }
    } catch (error) {
    }
  }

  /**
   * Asztal típusok létrehozása, ha még nem léteznek
   * @returns Az asztal típus objektumok tömbje
   */
  private async createTableTypes(): Promise<TableType[]> {
    const existingTypes = await firstValueFrom(this.tableService.getTableTypes());
    
    if (existingTypes.length > 0) {
      return existingTypes;
    }
    
    const tableTypesToCreate: Omit<TableType, 'id'>[] = [
      {
        name: 'Standard Pool Asztal',
        description: '8-as standard méretű pool biliárdasztal, kezdőknek és haladóknak egyaránt.',
        hourlyRate: 2500,
        isAvailable: true
      },
      {
        name: 'Profi Snooker Asztal',
        description: 'Professzionális 12 láb méretű snooker asztal versenyzőknek és haladóknak.',
        hourlyRate: 3500,
        isAvailable: true
      },
      {
        name: 'Mini Pool Asztal',
        description: 'Kisebb méretű pool asztal kezdőknek és gyerekeknek.',
        hourlyRate: 2000,
        isAvailable: true
      },
      {
        name: 'Karambol Asztal',
        description: 'Speciális karambol biliárd asztal francia stílusú játékhoz.',
        hourlyRate: 3000,
        isAvailable: true
      }
    ];
    
    const createdTypes: TableType[] = [];
    
    for (const typeData of tableTypesToCreate) {
      try {
        const typeRef = collection(this.firestore, this.tableTypesCollection);
        const docRef = await addDoc(typeRef, typeData);
        
        createdTypes.push({
          id: docRef.id,
          ...typeData
        });
      } catch (error) {
      }
    }
    
    return createdTypes;
  }

  private async createBilliardTables(tableTypes: TableType[]): Promise<void> {
    const billiardTablesCollection = collection(this.firestore, this.billiardTablesCollection);
    const billiardTablesSnapshot = await getDocs(billiardTablesCollection);
    
    if (!billiardTablesSnapshot.empty) {
      return;
    }
    
    const poolTypeStandard = tableTypes.find(type => type.name === 'Standard Pool Asztal');
    const poolTypeMini = tableTypes.find(type => type.name === 'Mini Pool Asztal');
    const carombolType = tableTypes.find(type => type.name === 'Karambol Asztal');
    
    if (!poolTypeStandard || !poolTypeMini || !carombolType) {
      return;
    }
    
    const billiardTablesToCreate: Omit<BilliardTable, 'id'>[] = [
      {
        number: 1,
        typeId: poolTypeStandard.id,
        status: 'available',
        location: 'Földszint'
      },
      {
        number: 2,
        typeId: poolTypeStandard.id,
        status: 'available',
        location: 'Földszint'
      },
      {
        number: 3,
        typeId: poolTypeStandard.id,
        status: 'available',
        location: 'Földszint'
      },
      {
        number: 4,
        typeId: poolTypeMini.id,
        status: 'available',
        location: 'Földszint'
      },
      {
        number: 5,
        typeId: carombolType.id,
        status: 'available',
        location: 'Földszint'
      }
    ];
    
    for (const tableData of billiardTablesToCreate) {
      try {
        const tableRef = collection(this.firestore, this.billiardTablesCollection);
        const docRef = await addDoc(tableRef, tableData);
      } catch (error) {
      }
    }
  }

  private async createSnookerTables(tableTypes: TableType[]): Promise<void> {
    const snookerTablesCollection = collection(this.firestore, this.snookerTablesCollection);
    const snookerTablesSnapshot = await getDocs(snookerTablesCollection);
    
    if (!snookerTablesSnapshot.empty) {
      return;
    }
    
    const snookerType = tableTypes.find(type => type.name === 'Profi Snooker Asztal');
    
    if (!snookerType) {
      return;
    }
    
    const snookerTablesToCreate: Omit<SnookerTable, 'id'>[] = [
      {
        number: 6,
        typeId: snookerType.id,
        status: 'available',
        size: '12ft'
      },
      {
        number: 7,
        typeId: snookerType.id,
        status: 'available',
        size: '12ft'
      },
      {
        number: 8,
        typeId: snookerType.id,
        status: 'available',
        size: '10ft'
      }
    ];
    
    for (const tableData of snookerTablesToCreate) {
      try {
        const tableRef = collection(this.firestore, this.snookerTablesCollection);
        const docRef = await addDoc(tableRef, tableData);
      } catch (error) {
      }
    }
  }
}
