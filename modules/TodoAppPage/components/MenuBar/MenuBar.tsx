import { useState } from "react";
import { Group, Text, Button, Box, Radio, Flex } from "@mantine/core";
import { IconFilter, IconPlus } from "@tabler/icons-react";
import { DatePickerInput } from "@mantine/dates";
import "@mantine/dates/styles.css";

import { EPriority, ETaskStatus } from "@/shared/typedefs/enums";
import { useTasksContext } from "@/shared/utils/TasksProvider/TasksProvider";

import classes from "./MenuBar.module.css";
import { TMenuBarProps } from "./MenuBar.types";

const MenuBar = ({ open }: TMenuBarProps) => {
  const [priorityRadioValue, setPriorityRadioValue] = useState<string | null>(
    null
  );
  const [statusRadioValue, setStatusRadioValue] = useState<string | null>(null);

  const [filteringDate, setFilteringDate] = useState<Date | null>(null);

  const {
    filterByPriorty,
    filterByStatus,
    filterByDueDate,
    resetFilter,
    clearCompletedTasks,
    undoState,
    redoState,
    currStateIndex,
    history,
  } = useTasksContext();

  const handlePriorityRadioButton = (value: string) => {
    setPriorityRadioValue(value);
    setStatusRadioValue(null);
    setFilteringDate(null);

    filterByPriorty(value);
  };

  const handleStatusRadioButton = (value: string) => {
    setStatusRadioValue(value);
    setPriorityRadioValue(null);
    setFilteringDate(null);

    filterByStatus(value);
  };

  const handleDueDateInput = (value: Date | null) => {
    setStatusRadioValue(null);
    setPriorityRadioValue(null);
    setFilteringDate(value);

    if (value) {
      filterByDueDate(value);
    }
  };

  const handleResetFilterButton = () => {
    setPriorityRadioValue(null);
    setStatusRadioValue(null);
    setFilteringDate(null);

    resetFilter();
  };

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          <Text>TO-DO App</Text>
          <Button onClick={open} rightSection={<IconPlus />}>
            Create Task
          </Button>
        </Group>
        <Text className={classes.link}>
          <IconFilter className={classes.linkIcon} stroke={1.5} />
          <span>Filter</span>
        </Text>
        <Box ml={30} mb={20}>
          <Radio.Group
            value={priorityRadioValue}
            onChange={handlePriorityRadioButton}
            label="By Priority"
          >
            <Radio value={EPriority.LOW} label="Low" mb={4} />
            <Radio value={EPriority.MEDIUM} label="Medium" mb={4} />
            <Radio value={EPriority.HIGH} label="High" mb={4} />
          </Radio.Group>

          <Radio.Group
            value={statusRadioValue}
            onChange={handleStatusRadioButton}
            label="By Status"
          >
            <Radio value={ETaskStatus.ACTIVE} label="Active" mb={4} />
            <Radio value={ETaskStatus.COMPLETED} label="Completed" mb={4} />
          </Radio.Group>

          <DatePickerInput
            label="Filter by Due Date"
            value={filteringDate}
            onChange={handleDueDateInput}
            inputSize="xs"
          />
          <Button color="orange" mt={10} onClick={handleResetFilterButton}>
            Reset Filters
          </Button>
        </Box>

        <Button
          color="red"
          style={{ marginTop: 8 }}
          onClick={clearCompletedTasks}
          w={"100%"}
        >
          Clear Completed Task
        </Button>
        <Flex justify={"space-between"} mt={10}>
          <Button onClick={undoState} disabled={currStateIndex === 0}>
            Undo
          </Button>
          <Button
            onClick={redoState}
            disabled={currStateIndex + 1 >= history.length}
          >
            Redo
          </Button>
        </Flex>
      </div>
    </nav>
  );
};

export default MenuBar;
