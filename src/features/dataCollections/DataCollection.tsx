import { memo, useCallback, useEffect, useState } from 'react';
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

const DataCollection = ({ showDoneRows = false, rowsProp, dataCollectionView = null }: { showDoneRows?: boolean; rowsProp: any; dataCollectionView?: any }) => {
    const { dataCollectionId } = useParams();

    const { data: user } = useGetUserQuery(localStorage.getItem('userId') || '');

    const { data: columns } = useGetColumnsQuery(dataCollectionId || '');
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
    } = useGetRowsQuery({ dataCollectionId: dataCollectionId || '', limit: 0, skip: 0, sort: 1, sortBy: 'createdAt' });
    // const [updateRow] = useUpdateRowMutation();
    const [permissions, setPermissions] = useState<number>();
    const [windowWidthOffset, setWindowWidthOffset] = useState(window.innerWidth > 990 ? 265 : 7);

    useEffect(() => {
        refetch();
    }, [showDoneRows]);

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
            <Box h={'4px'}>{isFetching || isLoading ? <Progress size="xs" isIndeterminate /> : null}</Box>
            <Table
                rowsData={rowsData || rowsProp || []}
                columnsData={columns || dataCollectionView?.columns || []}
                minCellWidth={120}
                columnResizingOffset={windowWidthOffset}
                createColumn={createColumn}
                createColumnIsUpdating={createColumnIsUpdating}
                deleteColumn={deleteColumn}
                updateColumn={handleColumnUpdate}
                reorderColumns={handleReorderColumns}
                showDoneRows={showDoneRows}
                allowed={(permissions || 0) > 1}
                isFetching={isFetching}
                updateRow={updateRow}
                deleteRow={deleteRow}
                updateRowIsLoading={updateRowIsLoading}
                refetch={refetch}
                view={dataCollectionView ? true : false}
            />
        </Box>
    );
};

export default memo(DataCollection);
