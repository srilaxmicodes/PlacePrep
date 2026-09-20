import { ApplicationStage } from "@/models/Application";
import { PrepCategory, PrepPriority } from "@/models/PrepChecklist";
import { DifficultyLevel, RoundOutcome } from "@/models/InterviewLog";

export interface UserSession {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export interface ApplicationData {
  _id: string;
  userId: string;
  company: string;
  role: string;
  package?: string;
  stage: ApplicationStage;
  deadline?: string | Date;
  jobUrl?: string;
  notes?: string;
  order: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface PrepChecklistItem {
  _id: string;
  userId: string;
  applicationId: string;
  category: PrepCategory;
  topic: string;
  priority: PrepPriority;
  completed: boolean;
  completedAt?: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface InterviewLogItem {
  _id: string;
  userId: string;
  applicationId: string;
  roundName: string;
  date: string | Date;
  questionsAsked: string[];
  difficulty: DifficultyLevel;
  outcome: RoundOutcome;
  lessonsLearned: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface PrepActivityData {
  _id: string;
  userId: string;
  date: string;
  count: number;
}

export interface ReadinessScoreResult {
  score: number; // 0 to 100
  checklistCompletionPercent: number; // 50% weight
  roundsClearedPercent: number; // 30% weight
  activityScorePercent: number; // 20% weight
  breakdown: {
    checklistCompleted: number;
    checklistTotal: number;
    roundsCleared: number;
    roundsTotal: number;
    activeDaysInLast14: number;
  };
}

