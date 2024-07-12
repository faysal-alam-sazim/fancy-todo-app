import { useState } from "react";
import { Group, Text, Button, Box, Radio } from "@mantine/core";
import { IconFilter } from "@tabler/icons-react";
import { DatePickerInput } from "@mantine/dates";
import "@mantine/dates/styles.css";

import classes from "./MenuBar.module.css";
import { TASK_STATES } from "../../../../Stores/TaskStates";

type MenuBarProps = {
  open: () => void;
  handlePriorityFilter: (priority: string) => void;
  handleStatusFilter: (status: string) => void;
  handleDueDateFilter: (date: Date) => void;
};

function MenuBar({
  open,
  handlePriorityFilter,
  handleStatusFilter,
  handleDueDateFilter,
}: MenuBarProps) {
  const [priorityRadioValue, setPriorityRadioValue] = useState<string | null>(
    null
  );
  const [statusRadioValue, setStatusRadioValue] = useState<string | null>(null);

  const [filteringDate, setFilteringDate] = useState<Date | null>(null);

  const handlePriorityRadioButton = (value: string) => {
    setPriorityRadioValue(value);
    setStatusRadioValue(null);
    setFilteringDate(null);

    handlePriorityFilter(value);
  };

  const handleStatusRadioButton = (value: string) => {
    setStatusRadioValue(value);
    setPriorityRadioValue(null);
    setFilteringDate(null);

    handleStatusFilter(value);
  };

  const handleDueDateInput = (value: Date | null) => {
    setStatusRadioValue(null);
    setPriorityRadioValue(null);
    setFilteringDate(value);

    if (value) {
      handleDueDateFilter(value);
    }
  };

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          <Text>TO-DO App</Text>
          <Button onClick={open}>Create Task</Button>
        </Group>
        <Text className={classes.link}>
          <IconFilter className={classes.linkIcon} stroke={1.5} />
          <span>Filter</span>
        </Text>
        <Box ml={30}>
          <Radio.Group
            value={priorityRadioValue}
            onChange={handlePriorityRadioButton}
            name="favoriteFramework"
            label="By Priority"
          >
            <Radio value="0" label="Not set" mb={4} />
            <Radio value="1" label="Low" mb={4} />
            <Radio value="2" label="Medium" mb={4} />
            <Radio value="3" label="High" mb={4} />
            <Radio value="reset" label="Reset" mb={4} />
          </Radio.Group>

          <Radio.Group
            value={statusRadioValue}
            onChange={handleStatusRadioButton}
            name="favoriteFramework"
            label="By Status"
          >
            <Radio value={TASK_STATES.ACTIVE_STATE} label="Active" mb={4} />
            <Radio value={TASK_STATES.COMPLETED} label="Completed" mb={4} />
          </Radio.Group>

          <DatePickerInput
            label="Filter by Due Date"
            value={filteringDate}
            onChange={handleDueDateInput}
            inputSize="xs"
          />
        </Box>
        <Button color="red" style={{ marginTop: 8 }}>
          Clear Completed Task
        </Button>
      </div>
    </nav>
  );
}

export default MenuBar;
