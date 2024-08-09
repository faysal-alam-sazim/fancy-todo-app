import { TCreateTaskDto, TTask, TUpdateTaskDto } from "@/shared/typedefs/types";

export interface ITasksContextType {
  tasks: TTask[] | undefined;
  undoStack: TTask[][];
  redoStack: TTask[][];
  handleAddTask: (task: TCreateTaskDto) => void;
  handleUpdateTask: (data: TUpdateTaskDto, taskId: string) => void;
  handleDeleteTask: (taskId: string) => void;
  clearCompletedTasks: () => void;
  filterByPriorty: (priority: string) => TTask[] | undefined;
  filterByStatus: (status: string) => TTask[] | undefined;
  filterByDueDate: (date: Date) => TTask[] | undefined;
  resetFilter: () => void;
  undoState: () => void;
  redoState: () => void;
}

export type TFilter = {
  by: "priority" | "status" | "dueDate";
  value: string;
};
