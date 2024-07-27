import { TTask } from "@/shared/typedefs/types";

export type TEditTaskProps = {
  opened: boolean;
  close: () => void;
  task: TTask;
  setTasks: (newTasks: TTask[]) => void;
  setTaskToEdit: (task: TTask | null) => void;
  setHistory?: (history: TTask[][]) => void;
  history?: TTask[][];
  setCurrStateIndex?: (idx: number) => void;
  currStateIndex?: number;
};
