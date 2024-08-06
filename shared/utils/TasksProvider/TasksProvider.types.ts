import { TCreateTaskDto, TTask, TUpdateTaskDto } from "@/shared/typedefs/types";

export interface ITasksContextType {
  tasks: TTask[] | undefined;
  undoStack: TTask[][];
  redoStack: TTask[][];
  handleUndoStackAfterCreate: () => void;
  handleUndoStackAfterUpdate: () => void;
  handleUndoStackAfterDelete: () => void;
  handleUndoStackAfterClearCompleted: () => void;
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
