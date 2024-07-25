import { EPriority, ETaskStatus } from "./enums";

export type TTask = {
  id: number;
  title: string;
  description: string;
  dueDate: Date | null;
  priority: EPriority;
  status: ETaskStatus;
};
