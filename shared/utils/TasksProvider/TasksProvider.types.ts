import { TCreateTaskDto, TTask, TUpdateTaskDto } from "@/shared/typedefs/types";

export interface ITasksContextType {
  tasks: TTask[] | undefined;
  history: TTask[][];
  currStateIndex: number;
  handleAddTask: (task: TCreateTaskDto) => void;
  handleUpdateTask: (data: TUpdateTaskDto, taskId: string) => void;
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
