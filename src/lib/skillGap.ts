import { ApplicationData, PrepChecklistItem } from "@/types";

export interface SkillGapItem {
  _id: string;
  applicationId: string;
  companyName: string;
  role: string;
  category: string;
  topic: string;
  priority: "High" | "Medium" | "Low";
  priorityScore: number;
  deadline?: string | Date;
  isUrgentDeadline: boolean;
}

/**
 * Computes incomplete topic skill gaps across user applications prioritized by
 * priority rating (High = 3, Medium = 2, Low = 1) and upcoming deadline urgency (+1 bonus).
 */
export function calculateSkillGaps(
  applications: ApplicationData[],
  checklists: PrepChecklistItem[]
): {
  topGlobalGaps: SkillGapItem[];
  companyGapMap: Record<string, SkillGapItem[]>;
} {
  const appMap = new Map<string, ApplicationData>();
  applications.forEach((app) => appMap.set(app._id, app));

  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const allGaps: SkillGapItem[] = [];

  checklists.forEach((item) => {
    // Only process incomplete topics
    if (!item.completed) {
      const app = appMap.get(item.applicationId);
      const companyName = app ? app.company : "Company";
      const role = app ? app.role : "Role";
      const deadline = app?.deadline;

      let baseScore = item.priority === "High" ? 3 : item.priority === "Medium" ? 2 : 1;
      let isUrgentDeadline = false;

      if (deadline) {
        const dDate = new Date(deadline);
        if (dDate >= now && dDate <= sevenDaysFromNow) {
          baseScore += 1; // +1 priority boost for urgent deadlines within 7 days
          isUrgentDeadline = true;
        }
      }

      allGaps.push({
        _id: item._id,
        applicationId: item.applicationId,
        companyName,
        role,
        category: item.category,
        topic: item.topic,
        priority: item.priority,
        priorityScore: baseScore,
        deadline,
        isUrgentDeadline,
      });
    }
  });

  // Sort all gaps descending by priority score
  allGaps.sort((a, b) => b.priorityScore - a.priorityScore);

  // Group gaps by company applicationId
  const companyGapMap: Record<string, SkillGapItem[]> = {};
  allGaps.forEach((gap) => {
    if (!companyGapMap[gap.applicationId]) {
      companyGapMap[gap.applicationId] = [];
    }
    companyGapMap[gap.applicationId].push(gap);
  });

  return {
    topGlobalGaps: allGaps.slice(0, 5), // Top 5 urgent skill gaps across all companies
    companyGapMap,
  };
}

