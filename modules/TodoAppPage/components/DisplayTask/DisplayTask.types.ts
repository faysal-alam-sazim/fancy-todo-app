import { TTask } from "@/shared/typedefs/types";

export type TDisplayTaskProps = {
  tasks: TTask[];
  setTasks: (newTasks: TTask[]) => void;
  setHistory: (history: TTask[][]) => void;
  history: TTask[][];
  setCurrStateIndex: (idx: number) => void;
  currStateIndex: number;
};
