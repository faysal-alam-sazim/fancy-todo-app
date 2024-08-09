import { getLastTaskId } from "@/shared/utils/localStorage";
import { TCreateTaskPayload, TTask } from "@/shared/typedefs/types";
import { ETaskStatus } from "@/shared/typedefs/enums";
import { useTasksContext } from "@/shared/utils/TasksProvider/TasksProvider";
import TaskModal from "@/shared/components/TaskModal/TaskModal";

import { TCreateTaskProps } from "./CreateTask.types";

const CreateTask = ({ opened, close }: TCreateTaskProps) => {
  const { handleAddTask } = useTasksContext();

  const createTask = (data: TTask) => {
    const task: TCreateTaskPayload = {
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      priority: data.priority,
      status: ETaskStatus.ACTIVE,
    };
    handleAddTask(task);
  };

  return (
    <>
      <TaskModal
        opened={opened}
        close={close}
        title="Create Task"
        buttonTitle="Create"
        onSubmitAction={createTask}
        resetAfterSubmit={true}
      />
    </>
  );
};

export default CreateTask;
