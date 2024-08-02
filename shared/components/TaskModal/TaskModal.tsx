import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Button, Modal, Select, TextInput, Textarea } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import "@mantine/dates/styles.css";

import { TTask } from "@/shared/typedefs/types";
import { EPriority } from "@/shared/typedefs/enums";

import { ITaskModalProps } from "./TaskModal.type";

const TaskModal = ({
  opened,
  close,
  title,
  buttonTitle,
  task,
  onSubmitAction,
  resetAfterSubmit,
}: ITaskModalProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<TTask>({ mode: "onBlur" });

  const validateDueDate = (value: Date | null) => {
    const currentDate = new Date();

    if (value && value < currentDate) {
      return "Due date cannot be in the past";
    }

    return true;
  };

  const onSubmit: SubmitHandler<TTask> = (data: TTask) => {
    onSubmitAction && onSubmitAction(data);
    resetAfterSubmit && reset();
  };

  return (
    <Modal opened={opened} onClose={close} title={title} centered>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        <Controller
          name="title"
          control={control}
          rules={{ required: "Title is required" }}
          defaultValue={task?.title}
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
          defaultValue={task?.description}
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
          defaultValue={task?.dueDate ? new Date(task?.dueDate) : null}
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
          defaultValue={task ? task.priority : EPriority.MEDIUM}
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
          {buttonTitle}
        </Button>
      </form>
    </Modal>
  );
};

export default TaskModal;
