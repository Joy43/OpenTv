import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tvurl: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    role: string;
    status: string;
  };
}

export interface ProjectsResponse {
  success: boolean;
  message: string;
  data: Project[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
  };
}

export const projectApi = createApi({
  reducerPath: 'projectApi',
  baseQuery,
  tagTypes: ['Project'],
  endpoints: (builder) => ({
    getProjects: builder.query<ProjectsResponse, void>({
      query: () => 'project',
      providesTags: ['Project'],
    }),
    createProject: builder.mutation<{ success: boolean; data: Project }, Partial<Project>>({
      query: (newProject) => ({
        url: 'project',
        method: 'POST',
        body: newProject,
      }),
      invalidatesTags: ['Project'],
    }),
    updateProject: builder.mutation<{ success: boolean; data: Project }, { id: string; data: Partial<Project> }>({
      query: ({ id, data }) => ({
        url: `project/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Project'],
    }),
    deleteProject: builder.mutation<{ success: boolean; data: Project }, string>({
      query: (id) => ({
        url: `project/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Project'],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectApi;
