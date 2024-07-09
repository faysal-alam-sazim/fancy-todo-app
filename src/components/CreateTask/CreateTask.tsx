import { Button, Modal, TextInput, Textarea } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm, SubmitHandler } from "react-hook-form";
import { Task } from "../../types/Task";
import { useState } from "react";
import {
  addTaskToLocalStorage,
  getLastTaskId,
  saveLastTaskId,
} from "../../localstorage/localstorage";

type CreateTaskProps = {
  opened: boolean;
  close: () => void;
};

function CreateTask({ opened, close }: CreateTaskProps) {
  const [date, setDate] = useState<Date | null>(null);
  const { register, handleSubmit, reset } = useForm<Task>();
  const onSubmit: SubmitHandler<Task> = (data: Task) => {
    const id = getLastTaskId() + 1;
    const task: Task = {
      id: id,
      title: data.title,
      description: data.description,
      dueDate: date,
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
          <TextInput
            label="Task Title"
            placeholder="title"
            {...register("title")}
          />
          <Textarea
            label="Task Details"
            placeholder="description"
            {...register("description")}
          />
          <DateInput
            label="Add Due Date"
            placeholder="due date"
            value={date}
            onChange={setDate}
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
