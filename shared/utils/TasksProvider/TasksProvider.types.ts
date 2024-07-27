import { TTask } from "@/shared/typedefs/types";

export interface ITasksContextType {
  tasks: TTask[];
  history: TTask[][];
  currStateIndex: number;
  addTask: (task: TTask) => void;
  updateTask: (data: TTask, taskId: string) => void;
  markTask: (task: TTask) => void;
  deleteTask: (task: TTask) => void;
  clearCompletedTasks: () => void;
  filterByPriorty: (priority: string) => TTask[];
  filterByStatus: (status: string) => TTask[];
  filterByDueDate: (date: Date) => TTask[];
  resetFilter: () => void;
  undoState: () => void;
  redoState: () => void;
}

export type TFilter = {
  by: "priority" | "status" | "dueDate";
  value: string;
};
