import { TTask } from "@/shared/typedefs/types";

export interface ITaskModalProps {
  opened: boolean;
  close: () => void;
  title: string;
  buttonTitle: string;
  task?: TTask;
  onSubmitAction: (data: TTask) => void;
  resetAfterSubmit: boolean;
}
