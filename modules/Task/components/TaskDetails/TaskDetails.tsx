import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import { Badge, Button, Card, Flex, Group, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconTrash } from "@tabler/icons-react";

import { TTask, TUpdateTaskDto } from "@/shared/typedefs/types";
import { ETaskStatus } from "@/shared/typedefs/enums";
import { useTasksContext } from "@/shared/utils/TasksProvider/TasksProvider";
import { getPriority, getPriorityColor } from "@/shared/utils/utility";
import EditTask from "@/modules/TodoAppPage/components/EditTask/EditTask";

import { IProps } from "./TaskDetails.types";

const TaskDetails = ({ task }: IProps) => {
  const [taskToEdit, setTaskToEdit] = useState<TTask | null>(null);
  const [opened, { open, close }] = useDisclosure();
  const { handleUpdateTask, handleDeleteTask } = useTasksContext();

  const handleEditTask = (task: TTask) => {
    setTaskToEdit(task);
    open();
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

  const handleMarkComplete = (task: TTask) => {
    const markedTask: TUpdateTaskDto = {
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      status: ETaskStatus.COMPLETED,
    };
    handleUpdateTask(markedTask, task.id.toString());
  };

  return (
    <Card
      key={task?.id}
      shadow="sm"
      padding="lg"
      radius="md"
      style={{ width: "60%" }}
      mx={"auto"}
      mt={20}
      withBorder
    >
      <Group justify="space-between" mt="sm" mb="xs">
        <Text fw={500}>{task?.title}</Text>
        {task?.status === ETaskStatus.ACTIVE && (
          <Button
            leftSection={<IconEdit />}
            onClick={() => handleEditTask(task)}
          >
            Edit
          </Button>
        )}
      </Group>

      <Text size="md" c="dimmed" mb={4}>
        {task?.description}
      </Text>

      <Text size="md" c="dimmed" mb={4}>
        Priority:{" "}
        <Badge color={getPriorityColor(task.priority)}>
          {getPriority(task.priority)}
        </Badge>
      </Text>
      <Text size="md" c="dimmed" mb={4}>
        Due Date:{" "}
        <span className="ml-2">
          {task?.dueDate
            ? dayjs(task.dueDate).format("DD MMMM YYYY")
            : "Not set"}
        </span>
      </Text>
      <Flex justify={"space-between"} align={"center"} mt={20}>
        <Button
          leftSection={<IconTrash />}
          color={"red"}
          onClick={() => task && handleDeleteTaskButton(task.id)}
        >
          Delete
        </Button>
        {task?.status === ETaskStatus.COMPLETED ? (
          <Button disabled>Completed</Button>
        ) : (
          <Button
            color="green"
            onClick={() => task && handleMarkComplete(task)}
          >
            Mark as complete
          </Button>
        )}
      </Flex>
      {taskToEdit && (
        <EditTask
          opened={opened}
          close={close}
          task={taskToEdit}
          setTaskToEdit={setTaskToEdit}
        />
      )}
    </Card>
  );
};

export default TaskDetails;
