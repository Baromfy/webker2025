import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, DocumentReference, getDocs } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { BilliardTable } from '../models/billiardTable.model';
import { SnookerTable } from '../models/snookerTable.model.number';
import { TableType } from '../models/tableType.model';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  private billiardTablesCollection = 'billiardTables';
  private snookerTablesCollection = 'snookerTables';
  private tableTypesCollection = 'tableTypes';

  private firestore = inject(Firestore);


  getBilliardTables(): Observable<BilliardTable[]> {
    const tablesRef = collection(this.firestore, this.billiardTablesCollection);
    return collectionData(tablesRef, { idField: 'id' }) as Observable<BilliardTable[]>;
  }

  getBilliardTable(id: string): Observable<BilliardTable> {
    const tableDocRef = doc(this.firestore, `${this.billiardTablesCollection}/${id}`);
    return docData(tableDocRef, { idField: 'id' }) as Observable<BilliardTable>;
  }

  addBilliardTable(table: Omit<BilliardTable, 'id'>): Observable<DocumentReference> {
    const tablesRef = collection(this.firestore, this.billiardTablesCollection);
    return from(addDoc(tablesRef, table));
  }

  updateBilliardTable(table: BilliardTable): Observable<void> {
    const tableDocRef = doc(this.firestore, `${this.billiardTablesCollection}/${table.id}`);
    return from(updateDoc(tableDocRef, { ...table }));
  }

  deleteBilliardTable(id: string): Observable<void> {
    const tableDocRef = doc(this.firestore, `${this.billiardTablesCollection}/${id}`);
    return from(deleteDoc(tableDocRef));
  }


  getSnookerTables(): Observable<SnookerTable[]> {
    const tablesRef = collection(this.firestore, this.snookerTablesCollection);
    return collectionData(tablesRef, { idField: 'id' }) as Observable<SnookerTable[]>;
  }

  getSnookerTable(id: string): Observable<SnookerTable> {
    const tableDocRef = doc(this.firestore, `${this.snookerTablesCollection}/${id}`);
    return docData(tableDocRef, { idField: 'id' }) as Observable<SnookerTable>;
  }

  addSnookerTable(table: Omit<SnookerTable, 'id'>): Observable<DocumentReference> {
    const tablesRef = collection(this.firestore, this.snookerTablesCollection);
    return from(addDoc(tablesRef, table));
  }

  updateSnookerTable(table: SnookerTable): Observable<void> {
    const tableDocRef = doc(this.firestore, `${this.snookerTablesCollection}/${table.id}`);
    return from(updateDoc(tableDocRef, { ...table }));
  }

  deleteSnookerTable(id: string): Observable<void> {
    const tableDocRef = doc(this.firestore, `${this.snookerTablesCollection}/${id}`);
    return from(deleteDoc(tableDocRef));
  }


  getTableTypes(): Observable<TableType[]> {
    const typesRef = collection(this.firestore, this.tableTypesCollection);
    return collectionData(typesRef, { idField: 'id' }) as Observable<TableType[]>;
  }

  getAvailableTableTypes(): Observable<TableType[]> {
    const typesRef = collection(this.firestore, this.tableTypesCollection);
    const q = query(typesRef, where('isAvailable', '==', true));
    return collectionData(q, { idField: 'id' }) as Observable<TableType[]>;
  }

  getTableTypesByPriceRange(minPrice: number, maxPrice: number): Observable<TableType[]> {
    const typesRef = collection(this.firestore, this.tableTypesCollection);
    const q = query(
      typesRef,
      where('hourlyRate', '>=', minPrice),
      where('hourlyRate', '<=', maxPrice),
      orderBy('hourlyRate')
    );
    return collectionData(q, { idField: 'id' }) as Observable<TableType[]>;
  }

  getMostExpensiveTableTypes(count: number = 3): Observable<TableType[]> {
    const typesRef = collection(this.firestore, this.tableTypesCollection);
    const q = query(typesRef, orderBy('hourlyRate', 'desc'), limit(count));
    return collectionData(q, { idField: 'id' }) as Observable<TableType[]>;
  }

  async searchTableTypesByName(searchTerm: string): Promise<TableType[]> {
    const typesRef = collection(this.firestore, this.tableTypesCollection);
    const snapshot = await getDocs(typesRef);
    const results: TableType[] = [];
    
    snapshot.forEach(doc => {
      const data = doc.data() as Omit<TableType, 'id'>;
      if (data.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        results.push({
          id: doc.id,
          ...data
        } as TableType);
      }
    });
    
    return results;
  }
}
