import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Flex, Card, Text, Group, Button } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";
import Swal from "sweetalert2";

import {
  deleteTaskFromLocalStorage,
  getSortedTasks,
  markTaskComplete,
} from "@/shared/utils/localStorage";
import { TTask } from "@/shared/typedefs/types";
import { EPriority, ETaskStatus } from "@/shared/typedefs/enums";

import EditTask from "../EditTask/EditTask";
import { TDisplayTaskProps } from "./DisplayTask.types";

function DisplayTask({
  tasks,
  setTasks,
  setHistory,
  history,
  setCurrStateIndex,
  currStateIndex,
}: TDisplayTaskProps) {
  const [taskToEdit, setTaskToEdit] = useState<TTask | null>(null);
  const [opened, { open, close }] = useDisclosure();

  const handleEditTask = (task: TTask) => {
    setTaskToEdit(task);
    open();
  };

  const handleMarkComplete = (task: TTask) => {
    task.status = ETaskStatus.COMPLETED;
    markTaskComplete(task);
    setTasks(getSortedTasks());

    const currState = getSortedTasks();
    const prevHistory = history.slice(0, currStateIndex + 1);
    setHistory([...prevHistory, [...currState]]);
    setCurrStateIndex(prevHistory.length);
  };

  const handleDeleteTask = (task: TTask) => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const tasksAfterDelete = deleteTaskFromLocalStorage(task);
        setTasks(tasksAfterDelete);

        const currState = getSortedTasks();
        const prevHistory = history.slice(0, currStateIndex + 1);
        setHistory([...prevHistory, [...currState]]);
        setCurrStateIndex(prevHistory.length);

        Swal.fire({
          title: "Deleted!",
          text: "Your task has been deleted.",
          icon: "success",
        });
      }
    });
  };

  return (
    <Flex gap={4} direction={"column"} wrap={"wrap"}>
      {tasks.length === 0 ? (
        <Text>No tasks to show. Please create one.</Text>
      ) : (
        tasks.map((task) => (
          <Card
            key={task.id}
            shadow="sm"
            padding="lg"
            radius="md"
            style={{ width: "100%" }}
            withBorder
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
              {task.priority === EPriority.LOW
                ? "Low"
                : task.priority === EPriority.MEDIUM
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
              {task.status === ETaskStatus.COMPLETED ? (
                <Button disabled>Completed</Button>
              ) : (
                <>
                  <Button onClick={() => handleEditTask(task)}>Edit</Button>
                  <Button
                    color="green"
                    onClick={() => handleMarkComplete(task)}
                  >
                    Mark as complete
                  </Button>
                </>
              )}
            </Flex>
          </Card>
        ))
      )}
      {taskToEdit && (
        <EditTask
          opened={opened}
          close={close}
          task={taskToEdit}
          setTasks={setTasks}
          setTaskToEdit={setTaskToEdit}
          setHistory={setHistory}
          history={history}
          setCurrStateIndex={setCurrStateIndex}
          currStateIndex={currStateIndex}
        />
      )}
    </Flex>
  );
}

export default DisplayTask;
