import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button, Flex, Text, Title } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";

import { useTasksContext } from "@/shared/utils/TasksProvider/TasksProvider";
import { useGetTaskQuery } from "@/shared/redux/rtk-apis/tasksAPI";
import { TTask } from "@/shared/typedefs/types";

import TaskDetails from "../components/TaskDetails/TaskDetails";

const TaskDetailsContainer = () => {
  const router = useRouter();
  const taskId = router.query.taskId?.toString();
  const { data, refetch } = useGetTaskQuery(taskId as string);
  const { tasks } = useTasksContext();
  const [task, setTask] = useState<TTask>();

  useEffect(() => {
    refetch();
    data && setTask(data);
  }, [tasks, data]);

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
        <TaskDetails task={task} refetch={refetch} />
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
