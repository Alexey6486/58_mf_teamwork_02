import type { ILeaderboard } from "../types";

export const fromLeaderboardData = (raw: unknown): ILeaderboard[] => {
  if (!raw || !Array.isArray(raw)) {
    return [];
  }

  return raw.map((item) => {
    if ('data' in item && item.data != null) {
      return item.data;
    }
    return item;
  });
};