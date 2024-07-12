import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Flex, Card, Text, Group, Button } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";
import Swal from "sweetalert2";

import { Task } from "../../../../types/Task";
import EditTask from "../EditTask/EditTask";
import {
  deleteTaskFromLocalStorage,
  markTaskComplete,
} from "../../../../Shared/Utils/localstorage";
import { TASK_STATES } from "../../../../Stores/TaskStates";

type DisplayTaskProps = {
  tasks: Task[];
  setDisplayTasks: (newTasks: Task[]) => void;
};

function DisplayTask({ tasks, setDisplayTasks }: DisplayTaskProps) {
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [opened, { open, close }] = useDisclosure();

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    open();
  };

  const handleMarkComplete = (task: Task) => {
    task.status = TASK_STATES.COMPLETED;
    const tasksAfterMark = markTaskComplete(task);
    setDisplayTasks(tasksAfterMark);
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
        setDisplayTasks(tasksAfterDelete);
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
              {task.dueDate
                ? dayjs(task.dueDate).format("DD MMMM YYYY")
                : "Not set"}
            </span>
          </Text>
          <Flex justify={"space-between"} align={"center"}>
            {task.status === "completed" ? (
              <Button disabled>Completed</Button>
            ) : (
              <>
                <Button onClick={() => handleEditTask(task)}>Edit</Button>
                <Button color="green" onClick={() => handleMarkComplete(task)}>
                  Mark as complete
                </Button>
              </>
            )}
          </Flex>
        </Card>
      ))}
      {taskToEdit && (
        <EditTask
          opened={opened}
          close={close}
          task={taskToEdit}
          setDisplayTasks={setDisplayTasks}
          setTaskToEdit={setTaskToEdit}
        />
      )}
    </Flex>
  );
}

export default DisplayTask;
