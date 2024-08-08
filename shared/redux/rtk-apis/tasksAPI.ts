import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { TCreateTaskDto, TTask, TUpdateTaskDto } from "@/shared/typedefs/types";

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

    updateTask: builder.mutation<
      TTask,
      { id: string; updatedTask: TUpdateTaskDto }
    >({
      query: ({ id, updatedTask }) => ({
        url: `todos/${id}`,
        method: "PUT",
        body: updatedTask,
      }),
    }),

    deleteTask: builder.mutation<{ success: boolean }, { id: string }>({
      query: ({ id }) => ({
        url: `todos/${id}`,
        method: "DELETE",
      }),
    }),

    deleteCompletedTask: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: "todos",
        method: "DELETE",
      }),
    }),

    getTask: builder.query<TTask, string>({
      query: (id) => `todos/:${id}`,
    }),
  }),
});

export const {
  useGetAllTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useDeleteCompletedTaskMutation,
  useGetTaskQuery,
} = api;
