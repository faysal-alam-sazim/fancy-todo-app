import { TCreateTaskDto, TTask } from "@/shared/typedefs/types";
import { ETaskStatus } from "@/shared/typedefs/enums";
import { useTasksContext } from "@/shared/utils/TasksProvider/TasksProvider";
import TaskModal from "@/shared/components/TaskModal/TaskModal";

import { TCreateTaskProps } from "./CreateTask.types";
import { useCreateTaskMutation } from "@/shared/redux/rtk-apis/tasksAPI";

const CreateTask = ({ opened, close }: TCreateTaskProps) => {
  const { handleUndoStackAfterCreate } = useTasksContext();
  const [createTask] = useCreateTaskMutation();

  const handleCreateTask = async (data: TTask) => {
    const task: TCreateTaskDto = {
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      priority: data.priority,
      status: ETaskStatus.ACTIVE,
    };
    try {
      await createTask(task).unwrap();
      handleUndoStackAfterCreate();
    } catch (err) {
      alert(err);
    }
  };

  return (
    <>
      <TaskModal
        opened={opened}
        close={close}
        title="Create Task"
        buttonTitle="Create"
        onSubmitAction={handleCreateTask}
        resetAfterSubmit={true}
      />
    </>
  );
};

export default CreateTask;
