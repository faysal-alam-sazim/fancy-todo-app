import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button, Flex, Text, Title } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";

import { TTask } from "@/shared/typedefs/types";
import { useTasksContext } from "@/shared/utils/TasksProvider/TasksProvider";

import TaskDetails from "../components/TaskDetails/TaskDetails";

const TaskDetailsContainer = () => {
  const router = useRouter();
  const taskId = router.query.taskId?.toString();
  const { tasks } = useTasksContext();
  const [task, setTask] = useState<TTask>();

  useEffect(() => {
    if (taskId) {
      const task = tasks.find(
        (item: TTask) => Number(item.id) === Number(taskId)
      );
      setTask(task);
    }
  }, [taskId, tasks]);

  return (
    <Flex
      direction={"column"}
      mt={20}
      justify={"center"}
      align={"center"}
      gap={40}
    >
      <Title>Task Details</Title>

      {task ? (
        <TaskDetails task={task} />
      ) : (
        <Text>Task is deleted. Please go back.</Text>
      )}
      <Link href={"/todo"}>
        <Button leftSection={<IconArrowLeft />}>Go Back</Button>
      </Link>
    </Flex>
  );
};

export default TaskDetailsContainer;
