import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useGetColumnsQuery, useGetRowsQuery, useGetUserQuery, useReorderColumnsMutation, useUpdateColumnMutation } from '../../app/services/api';
import { useParams } from 'react-router-dom';
import DataCollectionTable from './DataCollectionTable';
import { Box } from '@chakra-ui/react';
import DataCollectionWorkbench from './DataCollectionWorkbench';
// import Table from './Table';
import Table from '../../components/table/Table';
import { TColumn } from '../../types';

const DataCollection = () => {
    const { dataCollectionId } = useParams();

    const { data: user } = useGetUserQuery(localStorage.getItem('userId') || '');

    const { data: columns } = useGetColumnsQuery(dataCollectionId || '');
    const [updateColumn] = useUpdateColumnMutation();
    const [reorderColumns] = useReorderColumnsMutation();

    // const [limit, setLimit] = useState<number>(20);
    // const [skip, setSkip] = useState<number>(0);
    // const [pageNumber, setPageNumber] = useState<number>((skip + limit) / limit);

    // const [sort, setSort] = useState<number>(1);

    const { data: rows } = useGetRowsQuery({ dataCollectionId: dataCollectionId || '', limit: 0, skip: 0, sort: 1, sortBy: 'createdAt' });
    // const [dataCollectionRows, setDataCollectionRows] = useState(rows);
    // const { data: totalRows } = useGetTotalRowsQuery({ dataCollectionId: dataCollectionId || "", limit: limit });

    // const [pages, setPages] = useState<number[]>(totalRows || []);

    const [permissions, setPermissions] = useState<number>();
    const [windowWidthOffset, setWindowWidthOffset] = useState(window.innerWidth > 990 ? 116 : 7);

    // useEffect(() => {
    //     console.log(columns);
    // }, [columns]);

    // useEffect(() => {
    //     setPages(totalRows);
    // }, [totalRows]);

    useEffect(() => {
        getPermissions();
    }, [user]);

    const setOffset = useCallback(() => {
        setWindowWidthOffset(window.innerWidth > 990 ? 116 : 5);
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

    const tableHeaders = [{ name: 'name' }, { name: 'level' }, { name: 'status' }];

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
            <Table
                rowsData={rows || []}
                columnsData={columns || []}
                minCellWidth={120}
                columnResizingOffset={windowWidthOffset}
                updateColumn={handleColumnUpdate}
                reorderColumns={handleReorderColumns}
            />
        </Box>
    );
};

export default memo(DataCollection);
