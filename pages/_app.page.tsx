import type { AppProps } from "next/app";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import TasksProvider from "@/shared/utils/TasksProvider/TasksProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <TasksProvider>
      <MantineProvider>
        <Component {...pageProps} />
      </MantineProvider>
    </TasksProvider>
  );
}
