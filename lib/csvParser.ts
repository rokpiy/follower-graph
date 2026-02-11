import { DailyStat } from '../types';

/**
 * Parses Twitter Analytics CSV data and extracts daily follower statistics
 * Expected CSV format: "date",followers,following,impressions,engagements,profile_visits,new_followers,unfollowers
 */
export function parseTwitterAnalyticsCSV(csvText: string): DailyStat[] {
  const lines = csvText.split('\n');
  const dataLines = lines.slice(1).filter((line) => line.trim());
  const parsedData: DailyStat[] = [];

  for (const line of dataLines) {
    const match = line.match(
      /"([^"]+)",(\d+),(\d+),(\d+),(\d+),(\d+),(\d+),(\d+)/,
    );
    if (match) {
      const [, dateStr, , , , , , newFollows, unfollows] = match;

      const date = new Date(dateStr);
      const formattedDate = date.toISOString().split('T')[0];

      parsedData.push({
        date: formattedDate,
        newFollowers: parseInt(newFollows, 10),
        unfollows: parseInt(unfollows, 10),
      });
    }
  }

  // Sort by date ascending
  parsedData.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  return parsedData;
}
