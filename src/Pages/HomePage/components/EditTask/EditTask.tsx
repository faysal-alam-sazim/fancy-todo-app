import { Button, Modal, Select, TextInput, Textarea } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import "@mantine/dates/styles.css";

import { getSortedTasks, updateTaskInLocalStorage } from "../../../../Shared/Utils/localstorage";
import { Task } from "../../../../types/Task";

type EditTaskProps = {
  opened: boolean;
  close: () => void;
  task: Task;
  setTasks: (newTasks: Task[]) => void;
  setTaskToEdit: (task: Task | null) => void;
  setHistory: (history: Task[][]) => void;
  history: Task[][];
  setCurrStateIndex: (idx: number) => void;
  currStateIndex: number;
};

function EditTask({
  opened,
  close,
  task,
  setTasks,
  setTaskToEdit,
  setHistory,
  history,
  setCurrStateIndex,
  currStateIndex,
}: EditTaskProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Task>({ mode: "onBlur" });

  const onSubmit: SubmitHandler<Task> = (data: Task) => {
    const updatedTask: Task = {
      id: task.id,
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      priority: data.priority,
      status: task.status,
    };

    console.log("Updated Task", updatedTask);
    updateTaskInLocalStorage(updatedTask);
    setTasks(getSortedTasks());
    setTaskToEdit(null);

    const currState = getSortedTasks();
    const prevHistory = history.slice(0, currStateIndex + 1);
    setHistory([...prevHistory, [...currState]]);
    setCurrStateIndex(prevHistory.length);
  };

  const validateDueDate = (value: Date | null) => {
    const currentDate = new Date();

    if (value && value < currentDate) {
      return "Due date cannot be in the past";
    }

    return true;
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Edit Task" centered>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
          <Controller
            name="title"
            control={control}
            rules={{ required: "Title is required" }}
            defaultValue={task.title}
            render={({ field }) => (
              <TextInput
                label="Task Title"
                placeholder="title"
                {...field}
                error={errors.title?.message}
                withAsterisk
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            defaultValue={task.description}
            render={({ field }) => (
              <Textarea label="Task Details" placeholder="description" {...field} />
            )}
          />
          <Controller
            name="dueDate"
            control={control}
            rules={{
              validate: validateDueDate,
            }}
            defaultValue={task.dueDate ? new Date(task.dueDate) : null}
            render={({ field }) => (
              <DateInput label="Due Date" {...field} error={errors.dueDate?.message} />
            )}
          />

          <Controller
            name="priority"
            control={control}
            defaultValue={task.priority}
            render={({ field }) => (
              <Select
                label="Priority"
                placeholder="set priority"
                {...field}
                data={[
                  { value: "3", label: "High" },
                  { value: "2", label: "Medium" },
                  { value: "1", label: "Low" },
                  { value: "0", label: "Not set" },
                ]}
              />
            )}
          />
          <Button type="submit" onClick={close} disabled={!isValid}>
            Update
          </Button>
        </form>
      </Modal>
    </>
  );
}

export default EditTask;
