import { memo, useCallback, useEffect, useState } from 'react';
import {
    useGetColumnsQuery,
    useGetRowsQuery,
    useGetUserQuery,
    useReorderColumnsMutation,
    useUpdateColumnMutation,
    // useUpdateRowMutation,
} from '../../app/services/api';
import { useParams } from 'react-router-dom';
import {
    Box,
    // Progress
} from '@chakra-ui/react';
import Table from '../../components/table/Table';
import { TColumn } from '../../types';

const DataCollection = ({ showDoneRows = false }: { showDoneRows?: boolean }) => {
    const { dataCollectionId } = useParams();

    const { data: user } = useGetUserQuery(localStorage.getItem('userId') || '');

    const { data: columns } = useGetColumnsQuery(dataCollectionId || '');
    const [updateColumn] = useUpdateColumnMutation();
    const [reorderColumns] = useReorderColumnsMutation();

    const {
        data: rowsData,
        // refetch,
        isFetching,
        // isLoading,
    } = useGetRowsQuery({ dataCollectionId: dataCollectionId || '', limit: 0, skip: 0, sort: 1, sortBy: 'createdAt' });
    // const [updateRow] = useUpdateRowMutation();
    const [permissions, setPermissions] = useState<number>();
    const [windowWidthOffset, setWindowWidthOffset] = useState(window.innerWidth > 990 ? 90 : 7);

    // const [rows, setRows] = useState(rowsData);

    // useEffect(() => {
    //     let position = 0;
    //     let currentParent: any = null;
    //     const parentsToMakeCommon: any = [];

    //     const repositionedRows = rowsData?.map((row) => {
    //         if (currentParent !== null && row.parentRowId !== currentParent._id) {
    //             parentsToMakeCommon.push(currentParent._id);
    //         }

    //         if (row.isParent) {
    //             currentParent = row;
    //         } else {
    //             currentParent = null;
    //         }

    //         position = position + 1;
    //         if (row.position != position) {
    //             console.log('UPDATING POSITION OF ROW');
    //             updateRow({ ...row, position: position });
    //             return { ...row, position: position };
    //         }
    //         return row;
    //     });

    //     const resetRows = repositionedRows?.map((row) => {
    //         if (parentsToMakeCommon.includes(row._id)) {
    //             console.log('UPDATING PARENTS TO COMMON');
    //             updateRow({ ...row, isParent: false, showSubrows: true });
    //             return { ...row, isParent: false, showSubrows: true };
    //         }
    //         return row;
    //     });
    //     setRows(resetRows);
    //     setRows(rowsData);
    // }, [rowsData, showDoneRows]);

    // useEffect(() => {
    //     refetch();
    // }, [showDoneRows]);

    useEffect(() => {
        getPermissions();
    }, [user]);

    const setOffset = useCallback(() => {
        setWindowWidthOffset(window.innerWidth > 990 ? 90 : 5);
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
            {/* <Box h={'4px'}>{isFetching || isLoading ? <Progress size="xs" isIndeterminate /> : null}</Box> */}
            <Table
                rowsData={rowsData || []}
                columnsData={columns || []}
                minCellWidth={120}
                columnResizingOffset={windowWidthOffset}
                updateColumn={handleColumnUpdate}
                reorderColumns={handleReorderColumns}
                showDoneRows={showDoneRows}
                allowed={(permissions || 0) > 1}
                isFetching={isFetching}
            />
        </Box>
    );
};

export default memo(DataCollection);
