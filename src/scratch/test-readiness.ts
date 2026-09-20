import { calculateReadinessScore, getReadinessLabel } from "@/lib/readiness";

console.log("==========================================");
console.log("RUNNING READINESS SCORE UNIT TEST CASES");
console.log("==========================================");

// Case 1: Empty Data (0 checklist items, 0 interview rounds, 0 active days)
const case1 = calculateReadinessScore({
  checklistCompleted: 0,
  checklistTotal: 0,
  roundsCleared: 0,
  roundsTotal: 0,
  activeDaysInLast14: 0,
});
console.log("\nCase 1 (Empty Data):", case1.score, "Label:", getReadinessLabel(case1.score).label);
console.assert(case1.score === 0, "Case 1 failed: Expected score 0");

// Case 2: Full Completion (100% checklist, 100% cleared rounds, 10 active days)
const case2 = calculateReadinessScore({
  checklistCompleted: 15,
  checklistTotal: 15,
  roundsCleared: 3,
  roundsTotal: 3,
  activeDaysInLast14: 10,
});
console.log("Case 2 (Full Completion):", case2.score, "Label:", getReadinessLabel(case2.score).label);
console.assert(case2.score === 100, "Case 2 failed: Expected score 100");

// Case 3: High Completion with No Recent Activity (100% checklist, 100% rounds, 0 active days)
const case3 = calculateReadinessScore({
  checklistCompleted: 20,
  checklistTotal: 20,
  roundsCleared: 2,
  roundsTotal: 2,
  activeDaysInLast14: 0,
});
console.log("Case 3 (No Recent Activity):", case3.score, "Label:", getReadinessLabel(case3.score).label);
console.assert(case3.score === 80, "Case 3 failed: Expected score 80");

// Case 4: Half prep, 1 cleared round, 5 active days
// Calculation: (0.5 * 50) + (1.0 * 30) + (5/10 * 20) = 25 + 30 + 10 = 65
const case4 = calculateReadinessScore({
  checklistCompleted: 5,
  checklistTotal: 10,
  roundsCleared: 1,
  roundsTotal: 1,
  activeDaysInLast14: 5,
});
console.log("Case 4 (Half Prep & Cleared Round):", case4.score, "Label:", getReadinessLabel(case4.score).label);
console.assert(case4.score === 65, "Case 4 failed: Expected score 65");

// Case 5: 80% prep, 0 rounds, 2 active days
// Calculation: (0.8 * 50) + (0 * 30) + (2/10 * 20) = 40 + 0 + 4 = 44
const case5 = calculateReadinessScore({
  checklistCompleted: 8,
  checklistTotal: 10,
  roundsCleared: 0,
  roundsTotal: 2,
  activeDaysInLast14: 2,
});
console.log("Case 5 (80% Prep & 0 Rounds):", case5.score, "Label:", getReadinessLabel(case5.score).label);
console.assert(case5.score === 44, "Case 5 failed: Expected score 44");

console.log("\nALL 5 TEST CASES PASSED SUCCESSFULLY!");
