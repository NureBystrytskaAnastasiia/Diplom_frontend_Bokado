export interface ChallengeDto {
  challengeId: number;
  title: string;
  description: string;
  reward: number;
  createdAt: string;
  completedAt: string | null;
  completionRate?: number; // % користувачів які виконали (повертає бек)
}

export interface Challenge extends ChallengeDto {
  isCompleted: boolean;
}

export interface CheckChallengeResponse {
  message: string;
}

// Помилка від беку: { errors: [{ description: "..." }] } АБО просто масив
export interface BackendError {
  errors?: Array<{ description: string }>;
}
