import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Flex, Card, Text, Group, Button } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";
import Swal from "sweetalert2";

import { Task } from "../../../../types/Task";
import EditTask from "../EditTask/EditTask";
import { deleteTaskFromLocalStorage } from "../../../../localstorage/localstorage";

type DisplayTaskProps = {
  tasks: Task[];
  setTasks: (newTasks: Task[]) => void;
};

function DisplayTask({ tasks, setTasks }: DisplayTaskProps) {
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [opened, { open, close }] = useDisclosure();

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    open();
  };

  const handleDeleteTask = (task: Task) => {
    const tasksAfterDelete = deleteTaskFromLocalStorage(task);

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setTasks(tasksAfterDelete);
        Swal.fire({
          title: "Deleted!",
          text: "Your task has been deleted.",
          icon: "success",
        });
      }
    });
  };

  return (
    <Flex gap={4} wrap={"wrap"}>
      {tasks.map((task) => (
        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
          style={{ minWidth: 400 }}
          key={task.id}
        >
          <Group justify="space-between" mt="sm" mb="xs">
            <Text fw={500}>{task.title}</Text>
            <div
              className="p-2 bg-red-600 text-white rounded-full cursor-pointer"
              onClick={() => handleDeleteTask(task)}
            >
              <IconTrash />
            </div>
          </Group>

          <Text size="sm" c="dimmed" mb={4}>
            {task.description}
          </Text>

          <Text size="sm" c="dimmed" mb={4}>
            Priority:{" "}
            {task.priority === "0"
              ? "Not set"
              : task.priority === "1"
              ? "Low"
              : task.priority === "2"
              ? "Medium"
              : "High"}
          </Text>
          <Text size="sm" c="dimmed" mb={4}>
            Due Date:
            <span className="ml-2">
              {task.dueDate ? dayjs(task.dueDate).toString() : "Not set"}
            </span>
          </Text>
          <Flex justify={"space-between"} align={"center"}>
            <Button onClick={() => handleEditTask(task)}>Edit</Button>
            <Button color="green">Mark as complete</Button>
          </Flex>
        </Card>
      ))}
      {taskToEdit && (
        <EditTask opened={opened} close={close} task={taskToEdit} />
      )}
    </Flex>
  );
}

export default DisplayTask;
