export const RewardReceiveMap = {
  MANUAL: 0,
  AUTOMATIC: 1,
} as const;
export const RewardReceiveList = Object.values(RewardReceiveMap);
export type RewardReceiveType = (typeof RewardReceiveList)[number];

export const RewardRequestMap = {
  PENDING: 0,
  ALLOWED: 1,
  DENY: 2,
};
export const RewardRequestList = Object.values(RewardRequestMap);
export type RewardRequestType = (typeof RewardRequestList)[number];
