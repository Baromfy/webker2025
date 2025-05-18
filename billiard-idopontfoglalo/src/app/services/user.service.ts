import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, setDoc, updateDoc, deleteDoc, query, where, DocumentReference } from '@angular/fire/firestore';
import { Observable, from, of, switchMap } from 'rxjs';
import { User } from '../models/user.model';
import { Auth, user } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersCollection = 'users';
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private user$ = user(this.auth);


  getAllUsers(): Observable<User[]> {
    const usersRef = collection(this.firestore, this.usersCollection);
    return collectionData(usersRef, { idField: 'id' }) as Observable<User[]>;
  }


  getUser(id: string): Observable<User> {
    const userDocRef = doc(this.firestore, `${this.usersCollection}/${id}`);
    return docData(userDocRef, { idField: 'id' }) as Observable<User>;
  }


  getUserByEmail(email: string): Observable<User[]> {
    const usersRef = collection(this.firestore, this.usersCollection);
    const q = query(usersRef, where('email', '==', email));
    return collectionData(q, { idField: 'id' }) as Observable<User[]>;
  }


  getCurrentUserProfile(): Observable<User | null> {
    return this.user$.pipe(
      switchMap(user => {
        if (!user) {
          return of(null);
        }
        return this.getUser(user.uid);
      })
    );
  }


  createUser(user: User): Observable<void> {
    const userDocRef = doc(this.firestore, `${this.usersCollection}/${user.id}`);
    return from(setDoc(userDocRef, user));
  }


  updateUser(user: Partial<User>): Observable<void> {
    const userDocRef = doc(this.firestore, `${this.usersCollection}/${user.id}`);
    return from(updateDoc(userDocRef, { ...user }));
  }


  deleteUser(id: string): Observable<void> {
    const userDocRef = doc(this.firestore, `${this.usersCollection}/${id}`);
    return from(deleteDoc(userDocRef));
  }


  updateCurrentUserProfile(userData: Partial<User>): Observable<void> {
    return this.user$.pipe(
      switchMap(user => {
        if (!user) {
          throw new Error('No authenticated user found');
        }
        
        const userDocRef = doc(this.firestore, `${this.usersCollection}/${user.uid}`);
        return from(updateDoc(userDocRef, { ...userData }));
      })
    );
  }
}
