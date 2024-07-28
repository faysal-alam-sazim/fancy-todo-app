import { TTask } from "@/shared/typedefs/types";

export type TCreateTaskProps = {
  opened: boolean;
  close: () => void;
};
