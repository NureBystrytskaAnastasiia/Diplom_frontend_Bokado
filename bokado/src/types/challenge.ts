export interface ChallengeDto {
  challengeId: number;
  title: string;
  description: string;
  reward: number;
  createdAt: string;
  completedAt: string | null;
}

export interface Challenge extends ChallengeDto {
  isCompleted: boolean;
}

export interface CheckChallengeResponse {
  message: string;
}
