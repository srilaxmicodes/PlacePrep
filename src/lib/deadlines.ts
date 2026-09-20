import { ApplicationData } from "@/types";

export interface DeadlineAlertItem {
  applicationId: string;
  company: string;
  role: string;
  stage: string;
  deadline: Date;
  daysLeft: number; // 0 for today, 1 for tomorrow, etc., negative for overdue
  label: string; // 'Today', 'Tomorrow', 'In 2 days', 'In 3 days', 'Overdue'
  isOverdue: boolean;
  isUrgent: boolean; // within 3 days
}

/**
 * Filters and ranks application deadlines into urgent (next 3 days) and overdue items.
 * Uses local midnight comparison to ensure consistent timezone calculation.
 */
export function getDeadlineAlerts(applications: ApplicationData[]): {
  upcomingAlerts: DeadlineAlertItem[];
  overdueAlerts: DeadlineAlertItem[];
  urgentCount: number;
} {
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const msPerDay = 24 * 60 * 60 * 1000;

  const upcomingAlerts: DeadlineAlertItem[] = [];
  const overdueAlerts: DeadlineAlertItem[] = [];

  applications.forEach((app) => {
    if (!app.deadline) return;

    const dDate = new Date(app.deadline);
    const dMidnight = new Date(dDate.getFullYear(), dDate.getMonth(), dDate.getDate()).getTime();

    const diffDays = Math.round((dMidnight - todayMidnight) / msPerDay);

    let label = "";
    let isOverdue = false;
    let isUrgent = false;

    if (diffDays < 0) {
      isOverdue = true;
      label = `${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? "s" : ""} overdue`;
    } else if (diffDays === 0) {
      isUrgent = true;
      label = "Today";
    } else if (diffDays === 1) {
      isUrgent = true;
      label = "Tomorrow";
    } else if (diffDays <= 3) {
      isUrgent = true;
      label = `In ${diffDays} days`;
    }

    const item: DeadlineAlertItem = {
      applicationId: app._id,
      company: app.company,
      role: app.role,
      stage: app.stage,
      deadline: dDate,
      daysLeft: diffDays,
      label,
      isOverdue,
      isUrgent,
    };

    if (isOverdue && (app.stage === "Wishlist" || app.stage === "Applied" || app.stage === "OA/Test")) {
      overdueAlerts.push(item);
    } else if (isUrgent || (diffDays >= 0 && diffDays <= 3)) {
      upcomingAlerts.push(item);
    }
  });

  // Sort upcoming by daysLeft ascending (closest deadlines first)
  upcomingAlerts.sort((a, b) => a.daysLeft - b.daysLeft);
  overdueAlerts.sort((a, b) => a.daysLeft - b.daysLeft);

  return {
    upcomingAlerts,
    overdueAlerts,
    urgentCount: upcomingAlerts.length + overdueAlerts.length,
  };
}

