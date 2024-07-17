import { TTask } from "@/shared/typedefs/types";

export type TMenuBarProps = {
  open: () => void;
  handlePriorityFilter: (priority: string) => void;
  handleStatusFilter: (status: string) => void;
  handleDueDateFilter: (date: Date) => void;
  handleResetFilter: () => void;
  clearCompletedTasks: () => void;
  undoState: () => void;
  redoState: () => void;
  currStateIndex: number;
  history: TTask[][];
};
