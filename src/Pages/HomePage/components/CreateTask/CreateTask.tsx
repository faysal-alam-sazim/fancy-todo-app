import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Button, Modal, Select, TextInput, Textarea } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import "@mantine/dates/styles.css";

import { Task } from "../../../../types/Task";
import {
  addTaskToLocalStorage,
  getLastTaskId,
  getSortedTasks,
  saveLastTaskId,
} from "../../../../Shared/Utils/localstorage";
import { TASK_STATES } from "../../../../Stores/TaskStates";

type CreateTaskProps = {
  opened: boolean;
  close: () => void;
  setDisplayTasks: (newTasks: Task[]) => void;
  setHistory: (history: Task[][]) => void;
  history: Task[][];
  setCurrStateIndex: (idx: number) => void;
  currStateIndex: number;
};

function CreateTask({
  opened,
  close,
  setDisplayTasks,
  setHistory,
  history,
  setCurrStateIndex,
  currStateIndex,
}: CreateTaskProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<Task>({ mode: "onBlur" });

  const onSubmit: SubmitHandler<Task> = (data: Task) => {
    const id = getLastTaskId() + 1;
    const task: Task = {
      id: id,
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      priority: data.priority,
      status: TASK_STATES.ACTIVE_STATE,
    };

    addTaskToLocalStorage(task);
    setDisplayTasks(getSortedTasks());
    saveLastTaskId(id);
    reset();

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
      <Modal opened={opened} onClose={close} title="Create Task" centered>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
          <Controller
            name="title"
            control={control}
            rules={{ required: "Title is required" }}
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
            render={({ field }) => (
              <DateInput label="Due Date" {...field} error={errors.dueDate?.message} />
            )}
          />

          <Controller
            name="priority"
            control={control}
            defaultValue={"0"}
            render={({ field }) => (
              <Select
                label="Priority"
                placeholder="set priority"
                {...field}
                data={[
                  { value: "3", label: "High" },
                  { value: "2", label: "Medium" },
                  { value: "1", label: "Low" },
                ]}
              />
            )}
          />
          <Button type="submit" onClick={close} disabled={!isValid}>
            Create
          </Button>
        </form>
      </Modal>
    </>
  );
}

export default CreateTask;
