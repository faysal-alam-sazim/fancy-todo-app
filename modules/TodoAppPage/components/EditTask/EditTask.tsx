import { TTask, TUpdateTaskDto } from "@/shared/typedefs/types";
import { useTasksContext } from "@/shared/utils/TasksProvider/TasksProvider";
import TaskModal from "@/shared/components/TaskModal/TaskModal";
import { useUpdateTaskMutation } from "@/shared/redux/rtk-apis/tasksAPI";

import { TEditTaskProps } from "./EditTask.types";

const EditTask = ({ opened, close, task, setTaskToEdit }: TEditTaskProps) => {
  const { handleUndoStackAfterUpdate } = useTasksContext();
  const [updateTask] = useUpdateTaskMutation();

  const handleEditTask = async (data: TTask) => {
    setTaskToEdit(null);
    const updatedTask: TUpdateTaskDto = {
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      priority: data.priority,
      status: data.status,
    };
    try {
      await updateTask({
        id: task.id.toString(),
        updatedTask: updatedTask,
      }).unwrap();
      handleUndoStackAfterUpdate();
    } catch (err) {
      alert(err);
    }
  };

  return (
    <>
      <TaskModal
        opened={opened}
        close={close}
        title="Edit Task"
        buttonTitle="Update"
        task={task}
        onSubmitAction={handleEditTask}
        resetAfterSubmit={false}
      />
    </>
  );
};

export default EditTask;
