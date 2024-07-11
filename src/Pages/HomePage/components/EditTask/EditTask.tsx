import { Button, Modal, Select, TextInput, Textarea } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import "@mantine/dates/styles.css";

import { updateTaskInLocalStorage } from "../../../../Shared/Utils/localstorage";
import { Task } from "../../../../types/Task";

type EditTaskProps = {
  opened: boolean;
  close: () => void;
  task: Task;
};

function EditTask({ opened, close, task }: EditTaskProps) {
  const { control, handleSubmit } = useForm<Task>();

  const onSubmit: SubmitHandler<Task> = (data: Task) => {
    const updatedTask: Task = {
      id: task.id,
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      priority: data.priority,
      status: data.status,
    };
    updateTaskInLocalStorage(updatedTask);
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
            defaultValue={task.title}
            render={({ field }) => (
              <TextInput label="Task Title" placeholder="title" {...field} />
            )}
          />
          <Controller
            name="description"
            control={control}
            defaultValue={task.description}
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
            defaultValue={task.dueDate ? new Date(task.dueDate) : null}
            render={({ field }) => <DateInput label="Due Date" {...field} />}
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
          <Button type="submit" onClick={close}>
            Update
          </Button>
        </form>
      </Modal>
    </>
  );
}

export default EditTask;
