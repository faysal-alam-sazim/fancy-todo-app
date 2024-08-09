import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { TTask } from "@/shared/typedefs/types";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3333/" }),
  endpoints: (builder) => ({
    getAllTasks: builder.query<TTask[], void>({
      query: () => "todos",
    }),
  }),
});

export const { useGetAllTasksQuery } = api;
