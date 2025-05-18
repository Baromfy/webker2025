import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, Timestamp, DocumentReference, getDocs } from '@angular/fire/firestore';
import { Observable, from, map, of, throwError, switchMap } from 'rxjs';
import { Reservation } from '../models/reservation.model';
import { Auth, user } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private reservationsCollection = 'reservations';
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private user$ = user(this.auth);


  getAllReservations(): Observable<Reservation[]> {
    const reservationsRef = collection(this.firestore, this.reservationsCollection);
    const q = query(reservationsRef, orderBy('startTime', 'asc'));
    return collectionData(q, { idField: 'id' }).pipe(
      map(reservations => this.convertTimestamps(reservations))
    ) as Observable<Reservation[]>;
  }


  getReservation(id: string): Observable<Reservation> {
    const reservationDocRef = doc(this.firestore, `${this.reservationsCollection}/${id}`);
    return docData(reservationDocRef, { idField: 'id' }).pipe(
      map(reservation => this.convertTimestamp(reservation))
    ) as Observable<Reservation>;
  }

  getReservationsByUser(userId: string): Observable<Reservation[]> {
    const reservationsRef = collection(this.firestore, this.reservationsCollection);
    const q = query(
      reservationsRef,
      where('userId', '==', userId)
    );
    return collectionData(q, { idField: 'id' }).pipe(
      map(reservations => this.convertTimestamps(reservations))
    ) as Observable<Reservation[]>;
  }

  getReservationsByTable(tableId: string): Observable<Reservation[]> {
    const reservationsRef = collection(this.firestore, this.reservationsCollection);
    const q = query(
      reservationsRef,
      where('tableId', '==', tableId)
    );
    return collectionData(q, { idField: 'id' }).pipe(
      map(reservations => this.convertTimestamps(reservations))
    ) as Observable<Reservation[]>;
  }

  getReservationsByDateRange(startDate: Date, endDate: Date): Observable<Reservation[]> {
    const reservationsRef = collection(this.firestore, this.reservationsCollection);
    const q = query(
      reservationsRef,
      where('startTime', '>=', Timestamp.fromDate(startDate))
    );
    return collectionData(q, { idField: 'id' }).pipe(
      map(reservations => {
        const filtered = reservations.filter(res => {
          const resTime = res['startTime'] instanceof Timestamp ? 
            (res['startTime'] as Timestamp).toDate() : res['startTime'] as Date;
          return resTime <= endDate;
        });
        return this.convertTimestamps(filtered);
      })
    ) as Observable<Reservation[]>;
  }

  createReservation(reservation: Omit<Reservation, 'id'>): Observable<DocumentReference> {
    const firestoreReservation = {
      ...reservation,
      startTime: Timestamp.fromDate(reservation.startTime),
      endTime: Timestamp.fromDate(reservation.endTime)
    };
    
    const reservationsRef = collection(this.firestore, this.reservationsCollection);
    return from(addDoc(reservationsRef, firestoreReservation));
  }

  updateReservation(reservation: Reservation): Observable<void> {
    return this.user$.pipe(
      map(user => {
        if (!user || (user.uid !== reservation.userId && !this.isAdmin(user))) {
          throw new Error('You are not authorized to update this reservation');
        }
        return user;
      }),
      map(_ => {
        const reservationDocRef = doc(this.firestore, `${this.reservationsCollection}/${reservation.id}`);
        
        const firestoreReservation = {
          ...reservation,
          startTime: Timestamp.fromDate(reservation.startTime),
          endTime: Timestamp.fromDate(reservation.endTime)
        };
        
        return updateDoc(reservationDocRef, firestoreReservation);
      }),
      from
    );
  }


  deleteReservation(id: string): Observable<void> {
    const reservationDocRef = doc(this.firestore, `${this.reservationsCollection}/${id}`);
    return from(deleteDoc(reservationDocRef));
  }


  async isTableAvailable(tableId: string, startTime: Date, endTime: Date): Promise<boolean> {
    const reservationsRef = collection(this.firestore, this.reservationsCollection);
    

    const q = query(
      reservationsRef,
      where('tableId', '==', tableId)
    );
    
    const querySnapshot = await getDocs(q);
    

    for (const docSnap of querySnapshot.docs) {
      const reservation = docSnap.data() as any;
      const reservationStart = (reservation['startTime'] as Timestamp).toDate();
      const reservationEnd = (reservation['endTime'] as Timestamp).toDate();
      

      if (!(endTime <= reservationStart || startTime >= reservationEnd)) {
        return false; 
      }
    }
    
    return true;
  }


  getUpcomingReservations(): Observable<Reservation[]> {
    return this.user$.pipe(
      switchMap(user => {
        if (!user) {
          return of([] as Reservation[]);
        }
        
        const reservationsRef = collection(this.firestore, this.reservationsCollection);
        const now = new Date();
        

        const q = query(
          reservationsRef,
          where('userId', '==', user.uid)
        );
        
        return collectionData(q, { idField: 'id' }).pipe(
          map(reservations => {

            const upcomingReservations = reservations.filter(res => {
              const endTime = res['endTime'] instanceof Timestamp ? 
                (res['endTime'] as Timestamp).toDate() : res['endTime'] as Date;
              return endTime >= now;
            }).sort((a, b) => {
              const aTime = a['startTime'] instanceof Timestamp ? 
                (a['startTime'] as Timestamp).toDate().getTime() : (a['startTime'] as Date).getTime();
              const bTime = b['startTime'] instanceof Timestamp ? 
                (b['startTime'] as Timestamp).toDate().getTime() : (b['startTime'] as Date).getTime();
              return aTime - bTime;
            });
            
            return this.convertTimestamps(upcomingReservations);
          })
        ) as Observable<Reservation[]>;
      })
    );
  }


  private convertTimestamps(reservations: any[]): Reservation[] {
    return reservations.map(reservation => this.convertTimestamp(reservation));
  }


  private convertTimestamp(reservation: any): Reservation {
    if (!reservation) return reservation;
    
    return {
      ...reservation,
      startTime: reservation['startTime'] instanceof Timestamp 
        ? (reservation['startTime'] as Timestamp).toDate() 
        : reservation['startTime'],
      endTime: reservation['endTime'] instanceof Timestamp 
        ? (reservation['endTime'] as Timestamp).toDate() 
        : reservation['endTime']
    };
  }


  private isAdmin(user: any): boolean {

    return false;
  }
}
