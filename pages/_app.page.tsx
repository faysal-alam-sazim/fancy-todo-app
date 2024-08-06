import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

import TasksProvider from "@/shared/utils/TasksProvider/TasksProvider";
import { store } from "@/shared/redux/store";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <TasksProvider>
        <MantineProvider>
          <Component {...pageProps} />
        </MantineProvider>
      </TasksProvider>
    </Provider>
  );
}
