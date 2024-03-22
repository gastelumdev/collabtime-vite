import { memo, useCallback, useEffect, useState } from 'react';
import { useGetColumnsQuery, useGetRowsQuery, useGetUserQuery, useReorderColumnsMutation, useUpdateColumnMutation } from '../../app/services/api';
import { useParams } from 'react-router-dom';
import { Box, Progress } from '@chakra-ui/react';
// import Table from './Table';
import Table from '../../components/table/Table';
import { TColumn } from '../../types';

const DataCollection = ({ showDoneRows = false }: { showDoneRows?: boolean }) => {
    const { dataCollectionId } = useParams();

    const { data: user } = useGetUserQuery(localStorage.getItem('userId') || '');

    const { data: columns } = useGetColumnsQuery(dataCollectionId || '');
    const [updateColumn] = useUpdateColumnMutation();
    const [reorderColumns] = useReorderColumnsMutation();

    // const [limit, setLimit] = useState<number>(20);
    // const [skip, setSkip] = useState<number>(0);
    // const [pageNumber, setPageNumber] = useState<number>((skip + limit) / limit);

    // const [sort, setSort] = useState<number>(1);

    const {
        data: rowsData,
        refetch,
        isFetching,
        isLoading,
    } = useGetRowsQuery({ dataCollectionId: dataCollectionId || '', limit: 0, skip: 0, sort: 1, sortBy: 'createdAt' });
    // const [dataCollectionRows, setDataCollectionRows] = useState(rows);
    // const { data: totalRows } = useGetTotalRowsQuery({ dataCollectionId: dataCollectionId || "", limit: limit });

    // const [pages, setPages] = useState<number[]>(totalRows || []);

    const [permissions, setPermissions] = useState<number>();
    const [windowWidthOffset, setWindowWidthOffset] = useState(window.innerWidth > 990 ? 90 : 7);

    const [rows, setRows] = useState(rowsData);

    useEffect(() => {
        refetch();
    }, []);

    useEffect(() => {
        setRows(rowsData);
    }, [rowsData]);

    useEffect(() => {
        // permissions;
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

    // const tableHeaders = [{ name: 'name' }, { name: 'level' }, { name: 'status' }];

    const handleColumnUpdate = useCallback((column: any) => {
        updateColumn(column);
    }, []);

    const handleReorderColumns = useCallback((columns: TColumn[]) => {
        reorderColumns(columns);
    }, []);

    // const handleLimitValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setLimit(Number(event.target.value));
    // };

    return (
        <Box>
            {/* <DataCollectionWorkbench
                // columns={columns || []}
                // rows={dataCollectionRows || []}
                // rowsLoading={rowsLoading}
                // rowsFetching={rowsFetching}
                dataCollectionId={dataCollectionId || ''}
                permissions={permissions || 0}
            /> */}
            {/* <Table headers={columns} rows={rows} minCellWidth={120} columnResizingOffset={windowWidthOffset} /> */}
            {/* <Skeleton isLoaded={!isLoading}> */}
            <Box h={'4px'}>{isFetching || isLoading ? <Progress size="xs" isIndeterminate /> : null}</Box>
            <Table
                rowsData={rows || []}
                columnsData={columns || []}
                minCellWidth={120}
                columnResizingOffset={windowWidthOffset}
                updateColumn={handleColumnUpdate}
                reorderColumns={handleReorderColumns}
                showDoneRows={showDoneRows}
                allowed={(permissions || 0) > 1}
                isFetching={isFetching}
            />
            {/* </Skeleton> */}
        </Box>
    );
};

export default memo(DataCollection);
// export default DataCollection;
