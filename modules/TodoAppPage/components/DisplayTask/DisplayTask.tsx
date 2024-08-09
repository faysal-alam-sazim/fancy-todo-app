import { useState } from "react";
import Link from "next/link";
import { useDisclosure } from "@mantine/hooks";
import { Flex, Card, Text, Group, Button, Badge, Box } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";
import Swal from "sweetalert2";

import { useTasksContext } from "@/shared/utils/TasksProvider/TasksProvider";
import { TTask, TUpdateTaskPayload } from "@/shared/typedefs/types";
import { ETaskStatus } from "@/shared/typedefs/enums";
import { getPriority, getPriorityColor } from "@/shared/utils/utility";

import EditTask from "../EditTask/EditTask";
import { TDisplayTaskProps } from "./DisplayTask.types";

const DisplayTask = ({ tasks }: TDisplayTaskProps) => {
  const { handleUpdateTask, handleDeleteTask } = useTasksContext();

  const [taskToEdit, setTaskToEdit] = useState<TTask | null>(null);
  const [opened, { open, close }] = useDisclosure();

  const handleEditTask = (task: TTask) => {
    setTaskToEdit(task);
    open();
  };

  const handleMarkComplete = (task: TTask) => {
    const markedTask: TUpdateTaskPayload = {
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      status: ETaskStatus.COMPLETED,
    };
    handleUpdateTask(markedTask, task.id.toString());
  };

  const handleDeleteTaskButton = (taskId: number) => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteTask(taskId.toString());

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
      {tasks?.length === 0 ? (
        <Text>No tasks to show. Please create one.</Text>
      ) : (
        tasks?.map((task) => (
          <Card
            key={task.id}
            shadow="sm"
            padding="lg"
            radius="md"
            style={{ width: "100%" }}
            withBorder
          >
            <Group justify="space-between" mt="sm" mb="xs">
              <Link
                href={`/task/${task.id}`}
                style={{ textDecoration: "none" }}
              >
                <Text fw={600} c={"black"}>
                  {task.title}
                </Text>
              </Link>
              <Button
                leftSection={<IconTrash />}
                onClick={() => handleDeleteTaskButton(task.id)}
                color={"red"}
              >
                Delete
              </Button>
            </Group>

            <Text size="sm" c="dimmed" mb={4}>
              {task.description}
            </Text>

            <Text size="md" c="dimmed" mb={4}>
              Priority:{" "}
              <Badge color={getPriorityColor(task.priority)}>
                {getPriority(task.priority)}
              </Badge>
            </Text>
            <Text size="sm" c="dimmed" mb={4}>
              Due Date:
              <span className="ml-2">
                {task.dueDate
                  ? dayjs(task.dueDate).format("DD MMMM YYYY")
                  : "Not set"}
              </span>
            </Text>
            <Flex justify={"space-between"} align={"center"} mt={10}>
              {task.status === ETaskStatus.COMPLETED ? (
                <Button disabled>Completed</Button>
              ) : (
                <>
                  <Button
                    leftSection={<IconEdit />}
                    onClick={() => handleEditTask(task)}
                  >
                    Edit
                  </Button>
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
          setTaskToEdit={setTaskToEdit}
        />
      )}
    </Flex>
  );
};

export default DisplayTask;
