import { TTask } from "@/shared/typedefs/types";

export type TCreateTaskProps = {
  opened: boolean;
  close: () => void;
  setTasks: (newTasks: TTask[]) => void;
  setHistory: (history: TTask[][]) => void;
  history: TTask[][];
  setCurrStateIndex: (idx: number) => void;
  currStateIndex: number;
};
