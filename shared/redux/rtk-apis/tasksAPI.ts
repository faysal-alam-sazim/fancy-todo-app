import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { TCreateTaskDto, TTask, TUpdateTaskDto } from "@/shared/typedefs/types";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3333/" }),
  tagTypes: ["Tasks"],
  endpoints: (builder) => ({
    getAllTasks: builder.query<TTask[], void>({
      query: () => "todos",
      providesTags: ["Tasks"],
    }),

    createTask: builder.mutation<TTask, TCreateTaskDto>({
      query: (newTask) => ({
        url: "todos",
        method: "POST",
        body: newTask,
      }),
      invalidatesTags: ["Tasks"],
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
      invalidatesTags: ["Tasks"],
    }),

    deleteTask: builder.mutation<{ success: boolean }, { id: string }>({
      query: ({ id }) => ({
        url: `todos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),

    deleteCompletedTask: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: "todos/completed",
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),

    getTask: builder.query<TTask, string>({
      query: (id) => `todos/${id}`,
      providesTags: ["Tasks"],
    }),

    syncTasks: builder.mutation<void, TTask[]>({
      query: (tasksData) => ({
        url: "todos/sync",
        method: "PUT",
        body: tasksData,
      }),
      invalidatesTags: ["Tasks"],
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
  useSyncTasksMutation,
} = api;
