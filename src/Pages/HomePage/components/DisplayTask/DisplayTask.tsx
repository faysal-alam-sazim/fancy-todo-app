import { Flex, Card, Text, Group, Button } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";

import { Task } from "../../../../types/Task";

type DisplayTaskProps = {
  tasks: Task[];
};

function DisplayTask({ tasks }: DisplayTaskProps) {
  return (
    <Flex gap={4} wrap={"wrap"}>
      {tasks.map((task) => (
        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
          style={{ minWidth: 400 }}
        >
          <Group justify="space-between" mt="sm" mb="xs">
            <Text fw={500}>{task.title}</Text>
            <div className="p-2 bg-red-600 text-white rounded-full cursor-pointer">
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
            <Button>Edit</Button>
            <Button color="green">Mark as complete</Button>
          </Flex>
        </Card>
      ))}
    </Flex>
  );
}

export default DisplayTask;
