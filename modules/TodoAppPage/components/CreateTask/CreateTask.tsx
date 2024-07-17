import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Button, Modal, Select, TextInput, Textarea } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import "@mantine/dates/styles.css";

import {
  addTaskToLocalStorage,
  getLastTaskId,
  getSortedTasks,
  saveLastTaskId,
} from "@/shared/utils/localStorage";
import { TTask } from "@/shared/typedefs/types";
import { EPriority, ETaskStatus } from "@/shared/typedefs/enums";

import { TCreateTaskProps } from "./CreateTask.types";

function CreateTask({
  opened,
  close,
  setTasks,
  setHistory,
  history,
  setCurrStateIndex,
  currStateIndex,
}: TCreateTaskProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<TTask>({ mode: "onBlur" });

  const onSubmit: SubmitHandler<TTask> = (data: TTask) => {
    const id = getLastTaskId() + 1;
    const task: TTask = {
      id: id,
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      priority: data.priority,
      status: ETaskStatus.ACTIVE,
    };

    addTaskToLocalStorage(task);
    setTasks(getSortedTasks());
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
              <Textarea
                label="Task Details"
                placeholder="description"
                {...field}
              />
            )}
          />
          <Controller
            name="dueDate"
            control={control}
            rules={{
              validate: validateDueDate,
            }}
            render={({ field }) => (
              <DateInput
                label="Due Date"
                {...field}
                error={errors.dueDate?.message}
              />
            )}
          />

          <Controller
            name="priority"
            control={control}
            defaultValue={EPriority.MEDIUM}
            render={({ field }) => (
              <Select
                label="Priority"
                placeholder="set priority"
                {...field}
                data={[
                  { value: EPriority.HIGH, label: "High" },
                  { value: EPriority.MEDIUM, label: "Medium" },
                  { value: EPriority.LOW, label: "Low" },
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
