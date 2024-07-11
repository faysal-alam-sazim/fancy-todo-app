import { Priority } from "./Priority";

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: Date | null;
  priority: Priority;
  status: "initiated" | "completed";
}
