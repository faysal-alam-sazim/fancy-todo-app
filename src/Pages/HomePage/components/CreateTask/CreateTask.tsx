import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Button, Modal, Select, TextInput, Textarea } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import "@mantine/dates/styles.css";

import { Task } from "../../../../types/Task";
import {
  addTaskToLocalStorage,
  getLastTaskId,
  saveLastTaskId,
} from "../../../../localstorage/localstorage";

type CreateTaskProps = {
  opened: boolean;
  close: () => void;
};

function CreateTask({ opened, close }: CreateTaskProps) {
  const { control, handleSubmit, reset } = useForm<Task>();
  
  const onSubmit: SubmitHandler<Task> = (data: Task) => {
    const id = getLastTaskId() + 1;
    const task: Task = {
      id: id,
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      priority: data.priority,
    };

    addTaskToLocalStorage(task);
    saveLastTaskId(id);
    reset();
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
            render={({ field }) => (
              <TextInput label="Task Title" placeholder="title" {...field} />
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
            render={({ field }) => <DateInput label="Due Date" {...field} />}
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
          <Button type="submit" onClick={close}>
            Create
          </Button>
        </form>
      </Modal>
    </>
  );
}

export default CreateTask;
