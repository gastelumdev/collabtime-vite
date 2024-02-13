import { useEffect } from 'react';
import { useCallback, useState, memo } from 'react';
import './Table.css';
import TableContent from './TableContent';
import TableHeader from './TableHeader';
import { TColumn } from '../../types';
import {
    useCreateColumnMutation,
    useDeleteColumnMutation,
    useDeleteRowMutation,
    useReorderRowsMutation,
    useRowCallUpdateMutation,
    useUpdateRowMutation,
} from '../../app/services/api';
import { Box, Center, Flex, Spacer, Text } from '@chakra-ui/react';
import { ArrowDownIcon, ArrowUpIcon, DeleteIcon } from '@chakra-ui/icons';

interface ITableProps {
    rowsData: any[];
    columnsData: any[];
    minCellWidth: number;
    columnResizingOffset: number;
    updateColumn: any;
    reorderColumns: any;
}

const Table = ({ rowsData, columnsData, minCellWidth, columnResizingOffset, updateColumn, reorderColumns }: ITableProps) => {
    // const [overId, setOverId] = useState<number | null>(null);
    // const [draggedId, setDraggedId] = useState<number | null>(null);

    const [rows, setRows] = useState<any[]>(rowsData);
    const [columns, setColumns] = useState<any[]>(columnsData);

    const [gridTemplateColumns, setGridTemplateColumns] = useState<string>(columnsData.map((_) => '180px').join(' '));

    const [updateRow] = useUpdateRowMutation();
    const [deleteRow] = useDeleteRowMutation();
    const [reorderRows] = useReorderRowsMutation();
    const [createColumn] = useCreateColumnMutation();
    const [deleteColumn] = useDeleteColumnMutation();
    const [rowCallUpdate] = useRowCallUpdateMutation();

    useEffect(() => {
        setRows(
            rowsData.map((row) => {
                return { ...row, checked: false, subRowsAreOpen: false };
            })
        );
        setColumns(columnsData);

        setGridTemplateColumns(
            columnsData
                .map((column) => {
                    return column.width !== undefined ? column.width : '180px';
                })
                .join(' ')
        );
    }, [rowsData, columnsData]);

    const handleSetRows = useCallback((newRows: any[]) => {
        setRows(newRows);
    }, []);

    const handleSetGridTemplateColumns = useCallback(
        (columnWidths: string) => {
            setGridTemplateColumns(columnWidths);
        },
        [gridTemplateColumns]
    );

    const rearangeColumns = useCallback(
        (columns: TColumn[]) => {
            setColumns(
                columns.map((column, index) => {
                    return { ...column, position: index + 1 };
                })
            );
        },
        [columns]
    );

    const updateBackendColumns = useCallback(
        (columns: TColumn[]) => {
            setColumns(columns);
            reorderColumns(columns);
        },
        [rearangeColumns, setColumns]
    );

    const updateBackendColumnWidth = useCallback(
        async (column: TColumn) => {
            updateColumn(column);
        },
        [updateColumn]
    );

    const handleUpdateRowNoRender = useCallback(
        (row: any) => {
            console.log(row);
            setRows((prev) => prev.map((prevRow) => (prevRow._id === row._id ? row : prevRow)));
        },
        [rows]
    );

    const handleUpdateRow = useCallback(
        async (row: any) => {
            // console.log(row);
            const newRows: any = await updateRow(row);

            // This handles adding additional rows if the last row is not empty
            if (newRows.data.length > 0) {
                setRows((prev) => {
                    return [...prev, ...newRows.data];
                });
            }
        },
        [rows]
    );

    // const [deleteCheckboxStatusList, setDeleteCheckboxStatusList] = useState(
    //     Array(rows.length)
    //         .fill(null)
    //         .map(() => false)
    // );
    const [numberOfDeleteItems, setNumberOfDeleteItems] = useState(0);

    // useEffect(() => {
    //     setDeleteCheckboxStatusList(
    //         Array(rowsData.length)
    //             .fill(null)
    //             .map(() => false)
    //     );
    // }, [rowsData]);

    const handleDeleteBoxChange = useCallback(
        (status: boolean, index: number) => {
            setRows((prevRows) => prevRows.map((prevRow, rowIndex) => (index === rowIndex ? { ...prevRow, checked: true } : prevRow)));

            if (status) {
                setNumberOfDeleteItems(numberOfDeleteItems + 1);
            } else {
                setNumberOfDeleteItems(numberOfDeleteItems - 1);
            }
        },
        [numberOfDeleteItems, rows]
    );

    const deleteItems = useCallback(() => {
        const rowsCopy = rows;

        setRows((prevRows) => prevRows.filter((row) => !row.checked));
        setRows((prevRows) =>
            prevRows.map((row) => {
                return { ...row, checked: false };
            })
        );

        for (const currentRow of rowsCopy) {
            if (currentRow.checked) {
                console.log({ currentRow });
                deleteRow(currentRow);
            }
        }

        // setDeleteCheckboxStatusList((prev) => prev.map(() => false));
        setNumberOfDeleteItems(0);
    }, [rows]);

    const handleReorderRows = useCallback((rowIds: string[]) => {
        console.log(rowIds);
        reorderRows(rowIds);
    }, []);

    const handleAddNewColumnToRows = useCallback(
        (column: TColumn) => {
            console.log(column);
            setColumns([...columns, column]);
            setRows((prev) =>
                prev.map((row) => {
                    return { ...row, values: { ...row.values, [column.name]: '' } };
                })
            );
            setGridTemplateColumns(gridTemplateColumns + ' 180px');
            createColumn(column);
        },
        [rows, columns]
    );

    const handleDeleteColumn = useCallback(
        (column: any) => {
            setColumns((prev) => prev.filter((prevColumn) => prevColumn._id !== column._id));
            deleteColumn(column);
        },
        [columns]
    );

    const setAsMainrow = useCallback(() => {
        let currentParentId: any = null;
        let updatedRow: any = null;
        let setToParent = false;
        let removeParent = false;
        let currentParent: any = null;
        let subrowCount = 1;

        setRows((prevRows) =>
            prevRows.map((prevRow) => {
                const isParent = prevRow.isParent && (prevRow.parentRowId === undefined || prevRow.parentRowId === null);
                const isChild = prevRow.parentRowId !== null && prevRow.parentRowId !== undefined;

                console.log({ isParent, isChild, position: prevRow.position });
                // if current row is checked
                if (prevRow.checked) {
                    // if it is not a main row
                    if (!isParent) {
                        console.log(`${prevRow.position} is checked and is not a parent`);
                        // if it is a child
                        if (isChild) {
                            // Set the current parent id to the current's row id so if the next row is a subrow
                            // we can set it's id to this new parent
                            currentParentId = prevRow._id;

                            if (subrowCount === 1) {
                                removeParent = true;
                            }

                            subrowCount = subrowCount + 1;
                        }
                        // keep track of updated row
                        updatedRow = prevRow;
                        // And set its properties to that of a parent row
                        updateRow({ ...prevRow, parentRowId: null, checked: false, isParent: false });
                        return { ...prevRow, parentRowId: null, checked: false, isParent: false };
                    } else {
                        return { ...prevRow, checked: false };
                    }
                } else {
                    // if we have an unchecked row that is a parent row
                    if (isParent) {
                        // we set parent id to null
                        currentParentId = null;
                        if (!removeParent) {
                            currentParent = prevRow;
                        }

                        subrowCount = 1;
                        console.log(`${prevRow.position} is a parent but not checked`);
                    }

                    // if we have an unchecked child row and a parent id has been previously set from one of the newly rows set to parent
                    // we will need to set that row as a parent at a later time since during that iteration, that row was unaware that the next rows
                    // were children rows
                    // We also update this row to have the parent id of the row that was checked and set as a parent.
                    if (isChild) {
                        if (currentParentId !== null) {
                            console.log(`${prevRow.position} is a child and the parentId is ${currentParentId}`);
                            setToParent = true;
                            updateRow({ ...prevRow, parentRowId: currentParentId });
                            return { ...prevRow, parentRowId: currentParentId };
                        }
                        subrowCount = subrowCount + 1;
                    }
                }
                return prevRow;
            })
        );

        console.log(updatedRow);
        if (setToParent) updateRow({ ...updatedRow, isParent: true, parentRowId: null });
        if (removeParent && currentParent !== null) updateRow({ ...currentParent, isParent: false, parentRowId: null });

        setNumberOfDeleteItems(0);
    }, [rows]);

    const setAsSubrow = useCallback(() => {
        let isPreviousRowAParent: any = true;
        let parentRowIds: any = [];

        let currentParentId: any = null;
        let isChecking: any = false;
        let updatedRow: any = null;

        setRows((prevRows) =>
            prevRows.map((prevRow, index) => {
                const isParent = prevRow.isParent && (prevRow.parentRowId === undefined || prevRow.parentRowId === null);
                const isChild = prevRow.parentRowId !== null && prevRow.parentRowId !== undefined;

                console.log({ isParent, isChild, currentParentId, isChecking });

                if (prevRow.checked) {
                    if (index !== 0) {
                        isChecking = true;
                        console.log(currentParentId);
                        updateRow({ ...prevRow, isParent: false, parentRowId: currentParentId, checked: false });
                        return { ...prevRow, isParent: false, parentRowId: currentParentId, checked: false };
                    } else {
                        return { ...prevRow, checked: false };
                    }
                } else {
                    if (isChild) {
                        if (isChecking) {
                            console.log(`${prevRow.position} is a child and algo is checking with a parent row id of ${currentParentId}`);
                            updateRow({ ...prevRow, parentRowId: currentParentId });
                            return { ...prevRow, parentRowId: currentParentId };
                        } else {
                            currentParentId = prevRow.parentRowId;
                        }
                    } else {
                        console.log('I am not a sub row');
                        currentParentId = prevRow._id;
                        isChecking = false;
                    }
                }
                return prevRow;
            })
        );

        // console.log(parentRowIds);

        // setRows((prevRows) =>
        //     prevRows.map((prevRow) => {
        //         if (parentRowIds.includes(prevRow._id)) updateRow({ ...prevRow, isParent: true });
        //         return parentRowIds.includes(prevRow._id) ? { ...prevRow, isParent: true } : prevRow;
        //     })
        // );

        // setRows((prevRows) =>
        //     prevRows.map((row) => {
        //         return { ...row, checked: false };
        //     })
        // );

        setNumberOfDeleteItems(0);
    }, [rows]);

    return (
        <div id={'data-collection-table'} className={'table'} style={{ position: 'relative' }}>
            {numberOfDeleteItems > 0 ? (
                <Box
                    position={'absolute'}
                    bottom={'30px'}
                    left={'60px'}
                    w={'450px'}
                    h={'120px'}
                    background={'white'}
                    border={'1px solid lightgray'}
                    boxShadow={'2xl'}
                    zIndex={1000000}
                >
                    <Flex>
                        <Box pt={'25px'} pl={'30px'}>
                            <Text>{`${numberOfDeleteItems} Selected`}</Text>
                        </Box>
                        <Spacer />
                        <Box pt={'30px'} pr={'30px'} onClick={setAsMainrow} cursor={'pointer'}>
                            {/* <Button colorScheme="blue" mb={'10px'}>
                                Sub Item
                            </Button> */}
                            <Center mb={'10px'}>
                                <Text>
                                    <ArrowUpIcon />
                                </Text>
                            </Center>
                            <Center>
                                <Text>Main Item</Text>
                            </Center>
                        </Box>

                        <Box pt={'30px'} pr={'30px'} onClick={setAsSubrow} cursor={'pointer'}>
                            {/* <Button colorScheme="blue" mb={'10px'}>
                                Sub Item
                            </Button> */}
                            <Center mb={'10px'}>
                                <Text>
                                    <ArrowDownIcon />
                                </Text>
                            </Center>
                            <Center>
                                <Text>Sub Item</Text>
                            </Center>
                        </Box>
                        {/* <Spacer /> */}
                        <Box pt={'30px'} pr={'30px'} onClick={deleteItems}>
                            {/* <Button colorScheme="red" mb={'10px'}>
                                Delete
                            </Button> */}
                            <Center mb={'10px'}>
                                <Text>
                                    <DeleteIcon />
                                </Text>
                            </Center>
                            <Center>
                                <Text>Delete</Text>
                            </Center>
                        </Box>
                    </Flex>
                </Box>
            ) : null}
            <TableHeader
                columns={columns}
                gridTemplateColumns={gridTemplateColumns}
                minCellWidth={minCellWidth}
                columnResizingOffset={columnResizingOffset}
                setGridTemplateColumns={handleSetGridTemplateColumns}
                rearangeColumns={rearangeColumns}
                updateBackendColumns={updateBackendColumns}
                updateBackendColumnWidth={updateBackendColumnWidth}
                handleGridTemplateColumns={handleSetGridTemplateColumns}
                handleAddNewColumnToRows={handleAddNewColumnToRows}
                deleteColumn={handleDeleteColumn}
            />
            <TableContent
                rows={rows}
                columns={columns}
                setRows={handleSetRows}
                gridTemplateColumnsIn={gridTemplateColumns}
                minCellWidth={minCellWidth}
                columnResizingOffset={columnResizingOffset}
                reorderColumns={reorderColumns}
                updateColumn={updateColumn}
                handleUpdateRowNoRender={handleUpdateRowNoRender}
                handleUpdateRow={handleUpdateRow}
                handleDeleteBoxChange={handleDeleteBoxChange}
                handleReorderRows={handleReorderRows}
                rowCallUpdate={rowCallUpdate}
            />
            {/* <Box w={'100%'} h={'30px'}>
                <Text ml={'10px'}>Add row</Text>
            </Box> */}
        </div>
    );
};

export default memo(Table);
