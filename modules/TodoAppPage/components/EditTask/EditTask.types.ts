import { TTask } from "@/shared/typedefs/types";

export type TEditTaskProps = {
  opened: boolean;
  close: () => void;
  task: TTask;
  setTaskToEdit: (task: TTask | null) => void;
};
