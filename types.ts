export interface DailyStat {
  date: string;
  newFollowers: number;
  unfollows: number;
  totalFollowers?: number; // Calculated field
}

export interface GrowthConfig {
  startDate?: string;
  endDate?: string;
}
