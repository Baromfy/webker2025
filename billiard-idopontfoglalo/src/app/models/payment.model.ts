export interface Payment {
  id: string;
  reservationId: string;  // Reference to the reservation
  userId: string;         // User who made the payment
  amount: number;         // Payment amount
  paymentDate: Date;      // When the payment was processed
  paymentMethod: PaymentMethod; // Method used for payment
  status: PaymentStatus;  // Current status of the payment
  transactionId?: string; // External payment processor reference
}

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER',
  ONLINE = 'ONLINE'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}
