import { TTask } from "@/shared/typedefs/types";

export type TEditTaskDetailsProps = {
  opened: boolean;
  close: () => void;
  task: TTask;
  setTaskToEdit: (task: TTask | null) => void;
};
