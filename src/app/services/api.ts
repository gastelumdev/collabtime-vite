import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { LoginRequest, UserResponse, ResetPasswordRequestRequest, BasicResponse } from "../../features/auth/types";
import { TCell, TColumn, TDataCollection, TDocument, TJoinWorkspace, TMessage, TNotification, TRow, TTableData, TTag, TUser, TWorkspace, TWorkspaceUsers } from "../../types";

export const api = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token as string || localStorage.getItem("token");
            if (token) headers.set("authorization", `JWT ${token}`);
            return headers;
        }
    }),
    tagTypes: ["auth", "Workspace", "Notification", "DataCollection", "Column", "Rows", "Documents", "Tags", "Messages"],
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
        resetPassword: builder.mutation<BasicResponse, { userId: string, token: string, password: string }>({
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
        joinWorkspace: builder.mutation<{ success: boolean }, TJoinWorkspace>({
            query: (params) => ({
                url: `workspaces/${params.workspaceId}/joinWorkspace`,
                method: "POST",
                body: params,
            }),
            invalidatesTags: ["Workspace"]
        }),
        removeMember: builder.mutation<{ success: boolean }, { userId: string }>({
            query: (userId) => ({
                url: `workspaces/${localStorage.getItem("workspaceId")}/removeMember`,
                method: "POST",
                body: userId,
            }),
            invalidatesTags: ["Workspace"]
        }),
        removeInvitee: builder.mutation<{ success: Boolean }, { userId: string }>({
            query: (userId) => ({
                url: `workspaces/${localStorage.getItem("workspaceId")}/removeInvitee`,
                method: "POST",
                body: userId
            }),
            invalidatesTags: ["Workspace"]
        }),
        callUpdate: builder.mutation<{ success: Boolean }, null>({
            query: () => ({
                url: "workspaces/callUpdate",
                method: "POST"
            }),
            invalidatesTags: ["Workspace", "Messages"]
        }),
        tagExists: builder.mutation<{ tagExists: boolean }, TTag>({
            query: (tag) => ({
                url: `workspaces/${tag.workspace}/tagExists`,
                method: "POST",
                body: tag,
            })
        }),
        getNotifications: builder.query<TNotification[], null>({
            query: () => ({
                url: `/workspaces/${localStorage.getItem("workspaceId")}/notifications/${localStorage.getItem("notificationsFilter")}`,
            }),
            providesTags: ["Notification"]
        }),
        callNotificationsUpdate: builder.mutation<{ success: Boolean }, string>({
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
        deleteDataCollection: builder.mutation<{ success: boolean }, string>({
            query: (dataCollectionId) => ({
                url: `/workspaces/${localStorage.getItem("workspaceId")}/deleteDataCollections/${dataCollectionId}`,
                method: "POST"
            }),
            invalidatesTags: ["DataCollection"]
        }),
        getDataCollection: builder.query<TDataCollection, string>({
            query: (dataCollectionId) => ({
                url: `/workspaces/${localStorage.getItem("workspaceId")}/dataCollections/${dataCollectionId}`,
            }),
            providesTags: ["DataCollection"],
        }),
        sendForm: builder.mutation<{ success: Boolean }, { email: string }>({
            query: (email) => ({
                url: `/workspaces/${localStorage.getItem("workspaceId")}/dataCollections/${localStorage.getItem("dataCollectionId")}/sendForm`,
                method: "POST",
                body: email,
            }),
            invalidatesTags: ["DataCollection"],
        }),
        getColumns: builder.query<TColumn[], string>({
            query: (dataCollectionId) => ({
                url: `workspaces/${localStorage.getItem("workspaceId")}/dataCollections/${dataCollectionId}/columns`
            }),
            providesTags: ["Column"]
        }),
        createColumn: builder.mutation<TColumn, TColumn>({
            query: (column) => ({
                url: `workspaces/${localStorage.getItem("workspaceId")}/dataCollections/${column.dataCollection}/columns`,
                method: "POST",
                body: column
            }),
            invalidatesTags: ["Column", "Rows"]
        }),
        updateColumn: builder.mutation<TColumn, TColumn>({
            query: (column) => ({
                url: `workspaces/${localStorage.getItem("workspaceId")}/dataCollections/${column.dataCollection}/columns/update/${column._id}`,
                method: "POST",
                body: column
            }),
            invalidatesTags: ["Column", "Rows"],
        }),
        deleteColumn: builder.mutation<TColumn, TColumn>({
            query: (column) => ({
                url: `workspaces/${localStorage.getItem("workspaceId")}/dataCollections/${column.dataCollection}/columns/delete`,
                method: "POST",
                body: column,
            }),
            invalidatesTags: ["Column", "Rows"],
        }),
        reorderColumns: builder.mutation<TColumn[], any>({
            query: (columns) => ({
                url: `workspaces/${localStorage.getItem("workspaceId")}/dataCollections/${localStorage.getItem("dataCollectionId")}/columns/reorderColumns`,
                method: "POST",
                body: columns,
            }),
            invalidatesTags: ["Column", "Rows"],
        }),
        getRows: builder.query<any[], any>({
            query: (options) => ({
                url: `workspaces/${localStorage.getItem("workspaceId")}/dataCollections/${options.dataCollectionId}/rows?limit=${options.limit}&skip=${options.skip}&sort=${options.sort}&sortBy=${options.sortBy}`
            }),
            providesTags: ["Rows"]
        }),
        getRow: builder.query<any, any>({
            query: (params) => ({
                url: `workspaces/${params.workspaceId}/dataCollections/${params.dataCollectionId}/row/${params.rowId}`,
            })
        }),
        createRow: builder.mutation<TTableData, TTableData>({
            query: (row) => ({
                url: `workspaces/${localStorage.getItem("workspaceId")}/dataCollections/${row.dataCollection}/rows`,
                method: "POST",
                body: row
            }),
            // invalidatesTags: ["Rows"]
        }),
        updateRow: builder.mutation<TRow[], TRow>({
            query: (row) => ({
                url: `workspaces/${localStorage.getItem("workspaceId")}/dataCollections/${row.dataCollection}/rows/update/${row._id}`,
                method: "POST",
                body: row,
            }),
            invalidatesTags: ["Rows"],
        }),
        updateRowNoTag: builder.mutation<TRow[], TRow>({
            query: (row) => ({
                url: `workspaces/${localStorage.getItem("workspaceId")}/dataCollections/${row.dataCollection}/rows/update/${row._id}`,
                method: "POST",
                body: row,
            }),
            invalidatesTags: ["Rows"],
        }),
        deleteRow: builder.mutation<TRow, TRow>({
            query: (row) => ({
                url: `workspaces/${localStorage.getItem("workspaceId")}/dataCollections/${row.dataCollection}/rows/delete/${row._id}`,
                method: "POST"
            }),
            invalidatesTags: ["Rows"]
        }),
        deleteRows: builder.mutation<any, { rows: TRow[], dataCollectionId: string }>({
            query: (data) => ({
                url: `workspaces/${localStorage.getItem("workspaceId")}/dataCollections/${data.dataCollectionId}/deleteRows`,
                method: "POST",
                body: data.rows,
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
        acknowledgeRow: builder.mutation<any, string>({
            query: (rowId) => ({
                url: `rows/acknowledge/${rowId}`,
                method: "POST",
            }),
            invalidatesTags: ["Rows"],
        }),
        reorderRows: builder.mutation<any, string[]>({
            query: (positions) => ({
                url: `workspaces/${localStorage.getItem("workspaceId")}/dataCollections/${localStorage.getItem("dataCollectionId")}/rows/reorder`,
                method: "POST",
                body: positions
            }),
            invalidatesTags: ["Rows"],
        }),
        getTotalRows: builder.query<any, { dataCollectionId: string, limit: number }>({
            query: (options) => ({
                url: `workspaces/${localStorage.getItem("workspaceId")}/dataCollections/${options.dataCollectionId}/getTotalRows?limit=${options.limit}`,
            }),
            providesTags: ["Rows"]
        }),
        getFormData: builder.query<any, any>({
            query: (dataCollectionId) => ({
                url: `dataCollections/${dataCollectionId}/form`,
            })
        }),
        updateFormData: builder.mutation<any, any>({
            query: (row) => ({
                url: `dataCollections/${row.dataCollection}/form`,
                method: "POST",
                body: row
            })
        }),
        updateCell: builder.mutation<TCell, TCell>({
            query: (cell) => ({
                url: `workspaces/${localStorage.getItem("workspaceId")}/dataCollections/${cell.dataCollection}/cells/${cell._id}`,
                method: "POST",
                body: cell,
            }),
            // invalidatesTags: ["Rows"],
        }),
        upload: builder.mutation<any, any>({
            query: (item) => ({
                url: "upload",
                method: "POST",
                body: item,
            })
        }),
        uploadDocs: builder.mutation<any, any>({
            query: (item) => ({
                url: "uploadDocs",
                method: "POST",
                body: item,
            })
        }),
        uploadPersistedDocs: builder.mutation<any, any>({
            query: (item) => ({
                url: "uploadPersistedDocs",
                method: "POST",
                body: item,
            })
        }),
        getDocuments: builder.query<TDocument[], null>({
            query: () => ({
                url: `/workspaces/${localStorage.getItem("workspaceId")}/documents`,
            }),
            providesTags: ["Documents"]
        }),
        createDocument: builder.mutation<TDocument, TDocument>({
            query: (document) => ({
                url: `/workspaces/${localStorage.getItem("workspaceId")}/documents`,
                method: "POST",
                body: document,
            }),
            invalidatesTags: ["Documents"]
        }),
        updateDocument: builder.mutation<TDocument, TDocument>({
            query: (document) => ({
                url: `/workspaces/${localStorage.getItem("workspaceId")}/documents/update`,
                method: "POST",
                body: document,
            }),
            invalidatesTags: ["Documents"]
        }),
        deleteDocument: builder.mutation<TDocument, TDocument>({
            query: (document) => ({
                url: `/workspaces/${localStorage.getItem("workspaceId")}/documents/delete`,
                method: "POST",
                body: document,
            }),
            invalidatesTags: ["Documents"]
        }),
        getSearchContent: builder.query<any, any>({
            query: () => ({
                url: `/getSearchContent`,
            })
        }),
        searchAll: builder.mutation<{ workspaces: TWorkspace[], dataCollections: TDataCollection[], docs: TDocument[] }, { key: string }>({
            query: (key) => ({
                url: `/workspaces/${localStorage.getItem("workspaceId")}/searchAll`,
                method: "POST",
                body: key
            })
        }),
        searchTags: builder.mutation<{ workspaces: TWorkspace[], dataCollections: TDataCollection[], docs: TDocument[], data: any[] }, { tag: string }>({
            query: (tag) => ({
                url: `/workspaces/${localStorage.getItem("workspaceId")}/searchTags`,
                method: "POST",
                body: tag,
            })
        }),
        getTags: builder.query<TTag[], string>({
            query: (workspaceId) => ({
                url: `/workspaces/${workspaceId}/tags`,
            }),
            providesTags: ["Tags", "Workspace"]
        }),
        createTag: builder.mutation<any, any>({
            query: (body) => ({
                url: `/workspaces/${body.tag.workspace}/tags`,
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["Tags", "Workspace"]
        }),
        deleteTag: builder.mutation<{ success: boolean }, TTag>({
            query: (tag) => ({
                url: `/workspaces/${tag.workspace}/tags/delete/${tag._id}`,
                method: "POST",
                body: tag,
            }),
            invalidatesTags: ["Tags", "Workspace"]
        }),
        getMessages: builder.query<TMessage[], string>({
            query: (workspaceId) => ({
                url: `/workspaces/${workspaceId}/messages`
            }),
            providesTags: ["Messages"],
        }),
        createMessage: builder.mutation<TMessage, TMessage>({
            query: (message) => ({
                url: `/workspaces/${message.workspace}/messages`,
                method: "POST",
                body: message,
            }),
            invalidatesTags: ["Messages"]
        }),
        typingMessage: builder.mutation<any, any>({
            query: () => ({
                url: `/workspaces/${localStorage.getItem("workspaceId")}/messages/typing`,
                method: "POST"
            }),
            invalidatesTags: ["Messages"]
        }),
        getUnreadMessages: builder.query<TMessage[], null>({
            query: () => ({
                url: `/workspaces/${localStorage.getItem("workspaceId")}/messages/unread`
            }),
            providesTags: ["Messages"]
        }),
        callUpdateMessages: builder.mutation<any, null>({
            query: () => ({
                url: `/workspaces/${localStorage.getItem("workspaceId")}/messages/callUpdateMessages`,
                method: "POST",
            }),
            invalidatesTags: ["Messages"]
        }),
        markAsRead: builder.mutation<any, null>({
            query: () => ({
                url: `/workspaces/${localStorage.getItem("workspaceId")}/messages/markAsRead`,
                method: "POST",
            }),
            invalidatesTags: ["Messages"]
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
    useTagExistsMutation,
    useGetNotificationsQuery,
    useCallNotificationsUpdateMutation,
    useGetDataCollectionsQuery,
    useCreateDataCollecionMutation,
    useUpdateDataCollectionMutation,
    useDeleteDataCollectionMutation,
    useGetDataCollectionQuery,
    useSendFormMutation,
    useGetColumnsQuery,
    useCreateColumnMutation,
    useUpdateColumnMutation,
    useDeleteColumnMutation,
    useReorderColumnsMutation,
    useGetRowsQuery,
    useGetRowQuery,
    useCreateRowMutation,
    useUpdateRowMutation,
    useUpdateRowNoTagMutation,
    useDeleteRowMutation,
    useDeleteRowsMutation,
    useRowCallUpdateMutation,
    useAcknowledgeRowMutation,
    useReorderRowsMutation,
    useGetTotalRowsQuery,
    useGetFormDataQuery,
    useUpdateFormDataMutation,
    useUpdateCellMutation,
    useUploadMutation,
    useUploadDocsMutation,
    useUploadPersistedDocsMutation,
    useGetDocumentsQuery,
    useCreateDocumentMutation,
    useUpdateDocumentMutation,
    useDeleteDocumentMutation,
    useGetSearchContentQuery,
    useSearchAllMutation,
    useSearchTagsMutation,
    useGetTagsQuery,
    useCreateTagMutation,
    useDeleteTagMutation,
    useGetMessagesQuery,
    useCreateMessageMutation,
    useTypingMessageMutation,
    useGetUnreadMessagesQuery,
    useCallUpdateMessagesMutation,
    useMarkAsReadMutation,
} = api