export interface Reservation {
    id: string;
    userId: string; // A felhasználó azonosítója
    tableId: string; // Az asztal azonosítója
    startTime: Date; // Kezdési időpont
    endTime: Date; // Befejezési időpont
}