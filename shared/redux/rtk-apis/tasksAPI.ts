import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { TTask } from "@/shared/typedefs/types";

import { TCreateTaskDto } from "./tasksAPI.types";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3333/" }),
  endpoints: (builder) => ({
    getAllTasks: builder.query<TTask[], void>({
      query: () => "todos",
    }),

    createTask: builder.mutation<TTask, TCreateTaskDto>({
      query: (newTask) => ({
        url: "todos",
        method: "POST",
        body: newTask,
      }),
    }),
  }),
});

export const { useGetAllTasksQuery, useCreateTaskMutation } = api;
