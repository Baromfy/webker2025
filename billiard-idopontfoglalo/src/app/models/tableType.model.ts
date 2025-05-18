export interface TableType {
  id: string;
  name: string;      // e.g., "Snooker", "Pool", "Carom"
  description: string;
  hourlyRate: number;
  imageUrl?: string;
  isAvailable: boolean;
}
