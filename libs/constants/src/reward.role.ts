export const RewardReceiveMap = {
  MANUAL: 0,
  AUTOMATIC: 1,
} as const;
export const RewardReceiveList = Object.values(RewardReceiveMap);
export type RewardReceiveType = (typeof RewardReceiveList)[number];
