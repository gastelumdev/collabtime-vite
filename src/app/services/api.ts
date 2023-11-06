import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { LoginRequest, UserResponse, ResetPasswordRequestRequest, BasicResponse } from "../../features/auth/types";
import { TJoinWorkspace, TNotification, TUser, TWorkspace, TWorkspaceUsers } from "../../types";

export const api = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token as string || localStorage.getItem("token");
            if (token) headers.set("authorization", `JWT ${token}`);
            return headers;
        }
    }),
    tagTypes: ["auth", "Workspace", "Notification"],
    endpoints: (builder) => ({
        login: builder.mutation<UserResponse, LoginRequest>({
            query: (credentials) => ({
                url: 'login',
                method: 'POST',
                body: credentials,
            }),
        }),
        getUser: builder.query<TUser, string>({
            query: (userId) => ({
                url: `user/${userId}`,
            })
        }),
        resetPasswordRequest: builder.mutation<BasicResponse, ResetPasswordRequestRequest>({
            query: (email) => ({
                url: "resetPasswordRequest",
                method: "POST",
                body: email
            })
        }),
        resetPassword: builder.mutation<BasicResponse, {userId: string, token: string, password: string}>({
            query: (params) => ({
                url: "resetPassword",
                method: "POST",
                body: params,
            })
        }),
        getWorkspaces: builder.query<TWorkspace[], null>({
            query: () => ({
                url: "workspaces"
            }),
            providesTags: ["Workspace"]
        }),
        getOneWorkspace: builder.query<TWorkspace, string>({
            query: (workspaceId) => ({
                url: `workspaces/${workspaceId}`
            })
        }),
        createWorkspace: builder.mutation<TWorkspace, TWorkspace>({
            query: (workspace) => ({
                url: "workspaces",
                method: "POST",
                body: workspace,
            }),
            invalidatesTags: ["Workspace"]
        }),
        updateWorkspace: builder.mutation<TWorkspace, TWorkspace>({
            query: (workspace) => ({
                url: `workspaces/update/${workspace._id}`,
                method: "POST",
                body: workspace
            }),
            invalidatesTags: ["Workspace"]
        }),
        deleteWorkspace: builder.mutation<TWorkspace, string>({
            query: (workspaceId) => ({
                url: `workspaces/delete/${workspaceId}`,
                method: "POST"
            }),
            invalidatesTags: ["Workspace"]
        }),
        getWorkspaceUsers: builder.query<TWorkspaceUsers, string>({
            query: (workspaceId) => ({
                url: `workspaces/${workspaceId}/users`
            }),
            providesTags: ["Workspace"]
        }),
        inviteTeamMember: builder.mutation<TWorkspace, TWorkspace>({
            query: (workspace) => ({
                url: `workspaces/${workspace._id}/inviteTeamMembers`,
                method: "POST",
                body: workspace
            }),
            invalidatesTags: ["Workspace"]
        }),
        joinWorkspace: builder.mutation<TWorkspace, TJoinWorkspace>({
            query: (params) => ({
                url: `workspaces/${params.workspaceId}/joinWorkspace`,
                method: "POST",
                body: params,
            }),
            invalidatesTags: ["Workspace"]
        }),
        callUpdate: builder.mutation<{success: Boolean}, null>({
            query: () => ({
                url: "workspaces/callUpdate",
                method: "POST"
            }),
            invalidatesTags: ["Workspace"]
        }),
        getNotifications: builder.query<TNotification[], null>({
            query: () => ({
                url: `notifications/${localStorage.getItem("notificationsFilter")}`,
            }),
            providesTags: ["Notification"]
        }),
        callNotificationsUpdate: builder.mutation<{success: Boolean}, string>({
            query: (priority) => ({
                url: `notifications/callUpdate/${priority}`,
                method: "POST"
            }),
            invalidatesTags: ["Notification"]
        })
    })
})

export const { 
    useLoginMutation,
    useGetUserQuery,
    useResetPasswordRequestMutation, 
    useResetPasswordMutation, 
    useGetWorkspacesQuery,
    useGetOneWorkspaceQuery,
    useCreateWorkspaceMutation,
    useUpdateWorkspaceMutation,
    useDeleteWorkspaceMutation,
    useGetWorkspaceUsersQuery,
    useInviteTeamMemberMutation,
    useJoinWorkspaceMutation,
    useCallUpdateMutation,
    useGetNotificationsQuery,
    useCallNotificationsUpdateMutation
} = api