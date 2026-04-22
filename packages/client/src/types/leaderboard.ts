export type ILeaderboard = {
  id: string;
  name: string;
  flip7_rating: number;
};

export type ServerLeaderboardItem = {
  data: ILeaderboard;
};
