import { useCallback, useEffect, useState } from 'react';
import {
    useCreateColumnMutation,
    useDeleteColumnMutation,
    useDeleteRowMutation,
    useGetColumnsQuery,
    useGetRowsQuery,
    useGetUserQuery,
    useReorderColumnsMutation,
    useUpdateColumnMutation,
    useUpdateRowMutation,
    // useUpdateRowMutation,
} from '../../app/services/api';
import { useParams } from 'react-router-dom';
import { Box, Progress } from '@chakra-ui/react';
import Table from '../../components/table/Table';
import { TColumn } from '../../types';
import { emptyDataCollectionPermissions, emptyViewPermissions } from '../workspaces/UserGroups';

const DataCollection = ({
    showDoneRows = true,
    rowsProp,
    dataCollectionView = null,
    rowsAreDraggable = true,
    hasCheckboxOptions = true,
    hasColumnOptions = true,
    columnsAreDraggable = true,
    hasCreateColumn = true,
    refetchRows,
    hideEmptyRows = false,
    dcId = null,
    appModel = null,
    dataCollectionPermissions = emptyDataCollectionPermissions,
    viewPermissions = emptyViewPermissions,
    refetchRowsForApp,
    refetchPermissions,
}: // userGroup,
{
    showDoneRows?: boolean;
    rowsProp: any;
    dataCollectionView?: any;
    rowsAreDraggable?: boolean;
    hasCheckboxOptions?: boolean;
    hasColumnOptions?: boolean;
    columnsAreDraggable?: boolean;
    hasCreateColumn?: boolean;
    refetchRows?: any;
    hideEmptyRows?: boolean;
    dcId?: string | null;
    appModel?: string | null;
    dataCollectionPermissions?: any;
    viewPermissions?: any;
    refetchRowsForApp?: any;
    refetchPermissions?: any;
    // userGroup?: any;
}) => {
    const { dataCollectionId } = useParams();

    const { data: user } = useGetUserQuery(localStorage.getItem('userId') || '');

    const { data: columns, isFetching: columnsAreFetching } = useGetColumnsQuery(dataCollectionId || appModel || '');
    const [updateColumn] = useUpdateColumnMutation();
    const [reorderColumns] = useReorderColumnsMutation();

    const [updateRow, { isLoading: updateRowIsLoading }] = useUpdateRowMutation();
    const [deleteRow] = useDeleteRowMutation();
    const [createColumn, { isLoading: createColumnIsUpdating }] = useCreateColumnMutation();
    const [deleteColumn] = useDeleteColumnMutation();

    const {
        data: rowsData,
        refetch,
        isFetching,
        isLoading,
    } = useGetRowsQuery({ dataCollectionId: dataCollectionId || dcId || '', limit: 0, skip: 0, sort: 1, sortBy: 'createdAt' });
    // const [updateRow] = useUpdateRowMutation();
    const [permissions, setPermissions] = useState<number>();
    const [windowWidthOffset, setWindowWidthOffset] = useState(window.innerWidth > 990 ? 265 : 7);

    // useEffect(() => {
    //     const socket = io(import.meta.env.VITE_API_URL);
    //     socket.connect();
    //     socket.on('update column', () => {
    //         refetchColumns();
    //     });

    //     return () => {
    //         socket.disconnect();
    //     };
    // }, []);

    // useEffect(() => {
    //     console.log(appModel);
    //     console.log(columns);
    // }, [columns]);

    // useEffect(() => {
    //     refetch();
    // }, [showDoneRows]);

    useEffect(() => {
        refetch();
    }, [rowsProp]);

    useEffect(() => {
        getPermissions();
    }, [user]);

    const setOffset = useCallback(() => {
        setWindowWidthOffset(window.innerWidth > 990 ? 265 : 5);
    }, [windowWidthOffset]);

    useEffect(() => {
        window.addEventListener('resize', setOffset);

        return () => {
            window.removeEventListener('resize', setOffset);
        };
    }, []);

    const getPermissions = () => {
        for (const workspace of user?.workspaces || []) {
            if (workspace.id == localStorage.getItem('workspaceId')) {
                setPermissions(workspace.permissions);
            }
        }
    };

    const handleColumnUpdate = useCallback((column: any) => {
        updateColumn(column);
    }, []);

    const handleReorderColumns = useCallback((columns: TColumn[]) => {
        reorderColumns(columns);
    }, []);

    return (
        <Box>
            {dataCollectionView === null ? <Box h={'4px'}>{isFetching || isLoading ? <Progress size="xs" isIndeterminate /> : null}</Box> : null}
            <Table
                rowsData={rowsProp || rowsData || []}
                columnsData={columns || dataCollectionView?.columns || []}
                minCellWidth={120}
                columnResizingOffset={windowWidthOffset}
                createColumn={createColumn}
                createColumnIsUpdating={createColumnIsUpdating}
                deleteColumn={deleteColumn}
                updateColumn={handleColumnUpdate}
                reorderColumns={handleReorderColumns}
                columnsAreFetching={columnsAreFetching}
                showDoneRows={showDoneRows}
                allowed={(permissions || 0) > 1}
                isFetching={isFetching}
                updateRow={updateRow}
                deleteRow={deleteRow}
                updateRowIsLoading={updateRowIsLoading}
                refetch={refetch}
                view={dataCollectionView ? true : false}
                rowsAreDraggable={rowsAreDraggable}
                hasCheckboxOptions={hasCheckboxOptions}
                hasColumnOptions={hasColumnOptions}
                hasCreateColumn={hasCreateColumn}
                columnsAreDraggable={columnsAreDraggable}
                dataCollectionView={dataCollectionView}
                refetchRows={refetchRows}
                hideEmptyRows={hideEmptyRows}
                appModel={appModel}
                dataCollectionPermissions={dataCollectionPermissions}
                viewPermissions={viewPermissions}
                refetchRowsForApp={refetchRowsForApp}
                refetchPermissions={refetchPermissions}
            />
        </Box>
    );
};

export default DataCollection;
