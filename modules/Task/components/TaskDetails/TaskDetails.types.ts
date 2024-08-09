import { TTask } from "@/shared/typedefs/types";

export interface IProps {
  task: TTask;
  refetch: () => void;
}
