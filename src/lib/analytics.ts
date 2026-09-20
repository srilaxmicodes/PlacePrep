import { ApplicationData } from "@/types";

export interface FunnelMetrics {
  totalApplications: number;
  stageCounts: {
    Wishlist: number;
    Applied: number;
    "OA/Test": number;
    Interview: number;
    Offer: number;
    Rejected: number;
  };
  conversionRates: {
    appliedToOA: number; // Applied -> OA
    oaToInterview: number; // OA -> Interview
    interviewToOffer: number; // Interview -> Offer
  };
}

/**
 * Calculates recruitment funnel conversion rates across application stages.
 * Safely handles empty datasets and division by zero.
 */
export function calculateFunnelAnalytics(applications: ApplicationData[]): FunnelMetrics {
  const stageCounts = {
    Wishlist: 0,
    Applied: 0,
    "OA/Test": 0,
    Interview: 0,
    Offer: 0,
    Rejected: 0,
  };

  applications.forEach((app) => {
    if (stageCounts[app.stage] !== undefined) {
      stageCounts[app.stage]++;
    }
  });

  const totalApplications = applications.length;

  // Reached Applied or further
  const reachedApplied =
    stageCounts.Applied + stageCounts["OA/Test"] + stageCounts.Interview + stageCounts.Offer + stageCounts.Rejected;

  // Reached OA or further
  const reachedOA = stageCounts["OA/Test"] + stageCounts.Interview + stageCounts.Offer;

  // Reached Interview or further
  const reachedInterview = stageCounts.Interview + stageCounts.Offer;

  // Reached Offer
  const reachedOffer = stageCounts.Offer;

  // Conversion Rates
  const appliedToOA = reachedApplied > 0 ? Math.round((reachedOA / reachedApplied) * 100) : 0;

  const oaToInterview = reachedOA > 0 ? Math.round((reachedInterview / reachedOA) * 100) : 0;

  const interviewToOffer = reachedInterview > 0 ? Math.round((reachedOffer / reachedInterview) * 100) : 0;

  return {
    totalApplications,
    stageCounts,
    conversionRates: {
      appliedToOA: Math.min(100, appliedToOA),
      oaToInterview: Math.min(100, oaToInterview),
      interviewToOffer: Math.min(100, interviewToOffer),
    },
  };
}

