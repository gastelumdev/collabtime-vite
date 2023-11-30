import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { LoginRequest, UserResponse, ResetPasswordRequestRequest, BasicResponse } from "../../features/auth/types";
import { TCell, TColumn, TDataCollection, TJoinWorkspace, TNotification, TRow, TTableData, TUser, TWorkspace, TWorkspaceUsers } from "../../types";

export const api = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token as string || localStorage.getItem("token");
            if (token) headers.set("authorization", `JWT ${token}`);
            return headers;
        }
    }),
    tagTypes: ["auth", "Workspace", "Notification", "DataCollection", "Column", "Rows"],
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
            }),
            providesTags: ["Workspace"]
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
        joinWorkspace: builder.mutation<{success: boolean}, TJoinWorkspace>({
            query: (params) => ({
                url: `workspaces/${params.workspaceId}/joinWorkspace`,
                method: "POST",
                body: params,
            }),
            invalidatesTags: ["Workspace"]
        }),
        removeMember: builder.mutation<{success: boolean}, {userId: string} >({
            query: (userId) => ({
                url: `workspaces/${localStorage.getItem("workspaceId")}/removeMember`,
                method: "POST",
                body: userId,
            }),
            invalidatesTags: ["Workspace"]
        }),
        removeInvitee: builder.mutation<{success: Boolean}, {userId: string}>({
            query: (userId) => ({
                url: `workspaces/${localStorage.getItem("workspaceId")}/removeInvitee`,
                method: "POST",
                body: userId
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
                url: `/workspaces/${localStorage.getItem("workspaceId")}/notifications/${localStorage.getItem("notificationsFilter")}`,
            }),
            providesTags: ["Notification"]
        }),
        callNotificationsUpdate: builder.mutation<{success: Boolean}, string>({
            query: (priority) => ({
                url: `workspaces/${localStorage.getItem("workspaceId")}/notifications/callUpdate/${priority}`,
                method: "POST"
            }),
            invalidatesTags: ["Notification"]
        }),
        getDataCollections: builder.query<TDataCollection[], null>({
            query: () => ({
                url: `workspaces/${localStorage.getItem("workspaceId")}/dataCollections`,
            }),
            providesTags: ["DataCollection"]
        }),
        createDataCollecion: builder.mutation<TDataCollection, TDataCollection>({
            query: (dataCollection) => ({
                url: `workspaces/${localStorage.getItem("workspaceId")}/dataCollections`,
                method: "POST",
                body: dataCollection
            }),
            invalidatesTags: ["DataCollection"]
        }),
        updateDataCollection: builder.mutation<TDataCollection, TDataCollection>({
            query: (dataCollection) => ({
                url: `/workspaces/${localStorage.getItem("workspaceId")}/updateDataCollections/${dataCollection._id}`,
                method: "POST",
                body: dataCollection
            }),
            invalidatesTags: ["DataCollection"]
        }),
        deleteDataCollection: builder.mutation<{success: boolean}, string>({
            query: (dataCollectionId) => ({
                url: `/workspaces/${localStorage.getItem("workspaceId")}/deleteDataCollections/${dataCollectionId}`,
                method: "POST"
            }),
            invalidatesTags: ["DataCollection"]
        }),
        getDataCollection: builder.query<TDataCollection, null>({
            query: () => ({
                url: `/workspaces/${localStorage.getItem("workspaceId")}/dataCollections/${localStorage.getItem("dataCollectionId")}`,
            }),
            providesTags: ["DataCollection"],
        }),
        getColumns: builder.query<TColumn[], null>({
            query: () => ({
                url: `workspaces/${localStorage.getItem("workspaceId")}/dataCollections/${localStorage.getItem("dataCollectionId")}/columns`
            }),
            providesTags: ["Column"]
        }),
        createColumn: builder.mutation<TColumn, TColumn>({
            query: (column) => ({
                url: `workspaces/${localStorage.getItem("workspaceId")}/dataCollections/${localStorage.getItem("dataCollectionId")}/columns`,
                method: "POST",
                body: column
            }),
            invalidatesTags: ["Column", "Rows"]
        }),
        updateColumn: builder.mutation<TColumn, TColumn>({
            query: (column) => ({
                url: `workspaces/${localStorage.getItem("workspaceId")}/dataCollections/${localStorage.getItem("dataCollectionId")}/columns/update/${column._id}`,
                method: "POST",
                body: column
            }),
            invalidatesTags: ["Column"],
        }),
        deleteColumn: builder.mutation<TColumn, string>({
            query: (columnId) => ({
                url: `workspaces/${localStorage.getItem("workspaceId")}/dataCollections/${localStorage.getItem("dataCollectionId")}/columns/delete/${columnId}`,
                method: "POST",
            }),
            invalidatesTags: ["Column", "Rows"],
        }),
        getRows: builder.query<any[], null>({
            query: () => ({
                url: `workspaces/${localStorage.getItem("workspaceId")}/dataCollections/${localStorage.getItem("dataCollectionId")}/rows`
            }),
            providesTags: ["Rows"]
        }),
        createRow: builder.mutation<TTableData, TTableData>({
            query: (row) => ({
                url: `workspaces/${localStorage.getItem("workspaceId")}/dataCollections/${localStorage.getItem("dataCollectionId")}/rows`,
                method: "POST",
                body: row
            }),
            invalidatesTags: ["Rows"]
        }),
        updateRow: builder.mutation<TRow, TRow>({
            query: (row) => ({
                url: `workspaces/${localStorage.getItem("workspaceId")}/dataCollections/${localStorage.getItem("dataCollectionId")}/rows/update/${row._id}`,
                method: "POST",
                body: row,
            }),
            invalidatesTags: ["Rows"],
        }),
        deleteRow: builder.mutation<TRow, string>({
            query: (rowId) => ({
                url: `workspaces/${localStorage.getItem("workspaceId")}/dataCollections/${localStorage.getItem("dataCollectionId")}/rows/delete/${rowId}`,
                method: "POST"
            }),
            invalidatesTags: ["Rows"]
        }),
        rowCallUpdate: builder.mutation<null, null>({
            query: () => ({
                url: "rows/callUpdate",
                method: "POST",
            }),
            invalidatesTags: ["Rows"],
        }),
        updateCell: builder.mutation<TCell, TCell>({
            query: (cell) => ({
                url: `workspaces/${localStorage.getItem("workspaceId")}/dataCollections/${localStorage.getItem("dataCollectionId")}/cells/${cell._id}`,
                method: "POST",
                body: cell,
            }),
            invalidatesTags: ["Rows"],
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
    useRemoveMemberMutation,
    useRemoveInviteeMutation,
    useCallUpdateMutation,
    useGetNotificationsQuery,
    useCallNotificationsUpdateMutation,
    useGetDataCollectionsQuery,
    useCreateDataCollecionMutation,
    useUpdateDataCollectionMutation,
    useDeleteDataCollectionMutation,
    useGetDataCollectionQuery,
    useGetColumnsQuery,
    useCreateColumnMutation,
    useUpdateColumnMutation,
    useDeleteColumnMutation,
    useGetRowsQuery,
    useCreateRowMutation,
    useUpdateRowMutation,
    useDeleteRowMutation,
    useRowCallUpdateMutation,
    useUpdateCellMutation
} = api