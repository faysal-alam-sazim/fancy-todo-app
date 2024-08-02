import { TTask } from "@/shared/typedefs/types";
import { useTasksContext } from "@/shared/utils/TasksProvider/TasksProvider";
import TaskModal from "@/shared/components/TaskModal/TaskModal";

import { TEditTaskProps } from "./EditTask.types";

const EditTask = ({ opened, close, task, setTaskToEdit }: TEditTaskProps) => {
  const { updateTask } = useTasksContext();

  const editTask = (data: TTask) => {
    setTaskToEdit(null);
    updateTask(data, task.id.toString());
  };

  return (
    <>
      <TaskModal
        opened={opened}
        close={close}
        title="Edit Task"
        buttonTitle="Update"
        task={task}
        onSubmitAction={editTask}
        resetAfterSubmit={false}
      />
    </>
  );
};

export default EditTask;
