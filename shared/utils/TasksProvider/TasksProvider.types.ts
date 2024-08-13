import { EPriority, ETaskStatus } from "@/shared/typedefs/enums";
import { TFilter, TTask } from "@/shared/typedefs/types";

export interface ITasksContextType {
  tasks: TTask[] | undefined;
  undoStack: TTask[][];
  redoStack: TTask[][];
  handleUndoStackAfterCreate: () => void;
  handleUndoStackAfterUpdate: () => void;
  handleUndoStackAfterDelete: () => void;
  handleUndoStackAfterClearCompleted: () => void;
  resetFilter: () => void;
  undoState: () => void;
  redoState: () => void;
  filterTasks: (filter: TFilter) => void;
  priorityRadioValue: string | null;
  statusRadioValue: string | null;
  filteringDate: Date | null;
  setPriorityRadioValue: (value: string | null) => void;
  setStatusRadioValue: (value: string | null) => void;
  setFilteringDate: (value: Date | null) => void;
}
