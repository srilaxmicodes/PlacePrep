import { PrepCategory, PrepPriority } from "@/models/PrepChecklist";

export interface DefaultTopic {
  category: PrepCategory;
  topic: string;
  priority: PrepPriority;
}

export const DEFAULT_PREP_TOPICS: DefaultTopic[] = [
  // DSA Category
  { category: "DSA", topic: "Arrays & Two-Pointers", priority: "High" },
  { category: "DSA", topic: "Hashing & Strings", priority: "High" },
  { category: "DSA", topic: "Linked Lists & Fast/Slow Pointers", priority: "Medium" },
  { category: "DSA", topic: "Binary Search & Sliding Window", priority: "High" },
  { category: "DSA", topic: "Trees & Binary Search Trees (BFS/DFS)", priority: "High" },
  { category: "DSA", topic: "Graphs & Shortest Path (Dijkstra/BFS)", priority: "High" },
  { category: "DSA", topic: "Dynamic Programming (Knapsack/DP on Trees)", priority: "Medium" },

  // Core CS Category
  { category: "Core CS", topic: "Operating Systems (Process, Threads, Deadlocks)", priority: "High" },
  { category: "Core CS", topic: "DBMS & SQL Queries (Joins, Indexing, ACID)", priority: "High" },
  { category: "Core CS", topic: "Computer Networks (TCP/IP, HTTP/HTTPS, DNS)", priority: "Medium" },
  { category: "Core CS", topic: "OOP Concepts (Polymorphism, Inheritance, Encapsulation)", priority: "High" },

  // Aptitude Category
  { category: "Aptitude", topic: "Quantitative Aptitude (Speed, Time, Work, Probability)", priority: "Medium" },
  { category: "Aptitude", topic: "Logical Reasoning & Pattern Recognition", priority: "Medium" },
  { category: "Aptitude", topic: "Verbal Ability & Reading Comprehension", priority: "Low" },

  // HR Category
  { category: "HR", topic: "Tell Me About Yourself & Project Pitch", priority: "High" },
  { category: "HR", topic: "Strengths, Weaknesses & Challenging Situations", priority: "High" },
  { category: "HR", topic: "Why work for this company?", priority: "Medium" },
];

