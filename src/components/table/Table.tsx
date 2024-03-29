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
    useUpdateRowNoTagMutation,
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
    showDoneRows?: boolean;
    allowed?: boolean;
    isFetching?: boolean;
}

const Table = ({
    rowsData,
    columnsData,
    minCellWidth,
    columnResizingOffset,
    updateColumn,
    reorderColumns,
    showDoneRows = false,
    allowed = false,
    isFetching = true,
}: ITableProps) => {
    // const [overId, setOverId] = useState<number | null>(null);
    // const [draggedId, setDraggedId] = useState<number | null>(null);

    const [rows, setRows] = useState<any[]>(rowsData);
    const [columns, setColumns] = useState<any[]>(columnsData);

    const [gridTemplateColumns, setGridTemplateColumns] = useState<string>(columnsData.map((_) => '180px').join(' '));

    const [updateRow] = useUpdateRowMutation();
    const [updateRowNoTag] = useUpdateRowNoTagMutation();
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
        async (row: any) => {
            const newRows: any = await updateRowNoTag(row);
            setRows((prev) => prev.map((prevRow) => (prevRow._id === row._id ? row : prevRow)));
            if (newRows.data.length > 0) {
                setRows((prev) => {
                    return [...prev, ...newRows.data];
                });
            }
        },
        [rows]
    );

    const handleUpdateRow = useCallback(
        async (row: any) => {
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

    const deleteItems = () => {
        const rowsCopy = rows;
        const parentIds: any = [];

        rowsCopy.map((row) => {
            if (row.checked && row.isParent) {
                parentIds.push(row._id);
            }
        });

        let position = 0;

        // let checkedParent: any = null;

        const filterRowsChecked = rowsCopy.filter((row) => !row.checked);
        const filterSubrows = filterRowsChecked.filter((row) => !parentIds.includes(row.parentRowId));
        const newRows = filterSubrows.map((row) => {
            // if (!parentIds.includes(row.parentRowId)) {
            //     position = position + 1;
            //     console.log(`Row ${row.values['item_name']} should have position updated to ${position} because its parent is not checked`);
            //     return { ...row, position: position };
            // }
            if (!row.checked) {
                position = position + 1;
                return { ...row, position: position };
            }
            return row;
        });
        setRows(newRows);

        // setRows((prevRows) => prevRows.filter((row) => !row.checked));
        // setRows((prevRows) => prevRows.filter((row) => !parentIds.includes(row.parentRowId)));
        // setRows((prevRows) => {
        //     console.log(prevRows);
        //     return prevRows.map((row) => {
        //         // if (!parentIds.includes(row.parentRowId)) {
        //         //     position = position + 1;
        //         //     console.log(`Row ${row.values['item_name']} should have position updated to ${position} because its parent is not checked`);
        //         //     return { ...row, position: position };
        //         // }
        //         if (!row.checked) {
        //             position = position + 1;
        //             console.log(`Row ${row.values['item_name']} should have position updated to ${position} because row is not checked`);
        //             return { ...row, position: position };
        //         }
        //         return row;
        //     });
        // });

        for (const row of rowsCopy) {
            if (parentIds.includes(row.parentRowId)) {
                deleteRow(row);
            }
            if (row.checked) {
                // if (row.isParent) checkedParent = row._id;
                if (row.checked) {
                    deleteRow(row);
                }
            }
        }

        // setDeleteCheckboxStatusList((prev) => prev.map(() => false));
        setNumberOfDeleteItems(0);
    };

    const handleReorderRows = useCallback((rowIds: string[]) => {
        reorderRows(rowIds);
    }, []);

    const handleAddNewColumnToRows = useCallback(
        async (column: TColumn) => {
            createColumn(column);

            setColumns([...columns, column]);
            setRows((prev) =>
                prev.map((row) => {
                    return { ...row, values: { ...row.values, [column.name]: '' } };
                })
            );
            setGridTemplateColumns(gridTemplateColumns + ' 180px');
        },
        [rows, columns]
    );

    const handleRemoveColumnFromRows = (column: any) => {
        setRows((prev) =>
            prev.map((row) => {
                let refs = row.refs;
                if (refs !== undefined) {
                    delete refs[column.name];
                }

                return { ...row, refs: refs };
            })
        );
    };

    const handleDeleteColumn = useCallback(
        (column: any) => {
            // const columnsCopy: any = columns;
            // const filteredColumns = columnsCopy.filter((col: any) => col.name !== column.name);
            setColumns((prev) => prev.filter((prevColumn) => prevColumn.name !== column.name));
            deleteColumn(column);
        },
        [columns]
    );

    const setAsMainrow = useCallback(() => {
        let currentParentId: any = null;
        // let updatedRow: any = null;
        // let setToParent = false;
        // let removeParent = false;
        let currentParent: any = null;
        let subrowCount = 1;

        let potentialParent: any = null;

        const makeAsParents: any = [];
        const removeAsParents: any = [];

        // let searchForSubrows = false;

        setRows((prevRows) =>
            prevRows.map((prevRow) => {
                const isParent = prevRow.isParent && (prevRow.parentRowId === undefined || prevRow.parentRowId === null);
                const isChild = prevRow.parentRowId !== null && prevRow.parentRowId !== undefined;
                // if current row is checked
                if (prevRow.checked) {
                    // if it is not a main row
                    if (!isParent) {
                        // if it is a child
                        if (isChild) {
                            // Set the current parent id to the current's row id so if the next row is a subrow
                            // we can set it's id to this new parent
                            currentParentId = prevRow._id;

                            potentialParent = prevRow;
                            // searchForSubrows = true;

                            if (subrowCount === 1) {
                                // removeParent = true;
                                removeAsParents.push(currentParent);
                            }

                            subrowCount = subrowCount + 1;
                        }
                        // keep track of updated row
                        // updatedRow = prevRow;
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
                        currentParent = prevRow;

                        // searchForSubrows = false;

                        subrowCount = 1;
                    }

                    // if we have an unchecked child row and a parent id has been previously set from one of the newly rows set to parent
                    // we will need to set that row as a parent at a later time since during that iteration, that row was unaware that the next rows
                    // were children rows
                    // We also update this row to have the parent id of the row that was checked and set as a parent.
                    if (isChild) {
                        if (currentParentId !== null) {
                            // setToParent = true;
                            makeAsParents.push(potentialParent);
                            updateRow({ ...prevRow, parentRowId: currentParentId });
                            return { ...prevRow, parentRowId: currentParentId };
                        }
                        subrowCount = subrowCount + 1;
                    }
                }

                return prevRow;
            })
        );

        const removeAsParentsIds = removeAsParents.map((row: any) => {
            return row._id;
        });

        const makeAsParentsIds = makeAsParents.map((row: any) => {
            return row._id;
        });

        setRows((prevRows) =>
            prevRows.map((prevRow) => {
                if (removeAsParentsIds.includes(prevRow._id)) updateRow({ ...prevRow, isParent: false, parentRowId: null, showSubrows: true });
                return removeAsParentsIds.includes(prevRow._id) ? { ...prevRow, isParent: false, parentRowId: null, showSubrows: true } : prevRow;
            })
        );

        setRows((prevRows) =>
            prevRows.map((prevRow) => {
                if (makeAsParentsIds.includes(prevRow._id)) updateRow({ ...prevRow, isParent: true, parentRowId: null });
                return makeAsParentsIds.includes(prevRow._id) ? { ...prevRow, isParent: true, parentRowId: null } : prevRow;
            })
        );

        // if (setToParent) updateRow({ ...updatedRow, isParent: true, parentRowId: null });
        // if (removeParent && currentParent !== null) updateRow({ ...currentParent, isParent: false, parentRowId: null });

        setNumberOfDeleteItems(0);
    }, [rows]);

    const setAsSubrow = useCallback(() => {
        let parentRowIds: any = [];
        let potentialParent: any = null;
        const newParents: any = [];

        let currentParentId: any = null;
        let isChecking: any = false;
        let prevSubrowIsVisible = true;

        setRows((prevRows) =>
            prevRows.map((prevRow, index) => {
                // const isParent = prevRow.isParent && (prevRow.parentRowId === undefined || prevRow.parentRowId === null);
                const isChild = prevRow.parentRowId !== null && prevRow.parentRowId !== undefined;

                // console.log({ isParent, isChild, currentParentId, isChecking });

                if (prevRow.checked) {
                    if (index !== 0) {
                        if (potentialParent !== null) {
                            if (newParents.length === 0 || newParents[newParents.length - 1].position !== potentialParent.position) {
                                newParents.push(potentialParent);
                                parentRowIds.push(potentialParent._id);
                            }
                        }

                        isChecking = true;
                        updateRow({ ...prevRow, isParent: false, parentRowId: currentParentId, checked: false, isVisible: prevSubrowIsVisible });
                        return { ...prevRow, isParent: false, parentRowId: currentParentId, checked: false, isVisible: prevSubrowIsVisible };
                    } else {
                        return { ...prevRow, checked: false };
                    }
                } else {
                    if (isChild) {
                        if (isChecking) {
                            updateRow({ ...prevRow, parentRowId: currentParentId });
                            return { ...prevRow, parentRowId: currentParentId };
                        } else {
                            currentParentId = prevRow.parentRowId;
                        }
                    } else {
                        currentParentId = prevRow._id;
                        potentialParent = prevRow;
                        isChecking = false;
                    }
                }
                prevSubrowIsVisible = prevRow.isVisible;
                return prevRow;
            })
        );

        setRows((prevRows) =>
            prevRows.map((prevRow) => {
                if (parentRowIds.includes(prevRow._id)) updateRow({ ...prevRow, isParent: true });
                return parentRowIds.includes(prevRow._id) ? { ...prevRow, isParent: true } : prevRow;
            })
        );

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
                        <Box pt={'30px'} pr={'30px'} onClick={deleteItems} cursor={'pointer'}>
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
                handleRemoveColumnFormRows={handleRemoveColumnFromRows}
                deleteColumn={handleDeleteColumn}
                allowed={allowed}
                isFetching={isFetching}
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
                showDoneRows={showDoneRows}
                allowed={allowed}
            />
            {/* <Box w={'100%'} h={'30px'}>
                <Text ml={'10px'}>Add row</Text>
            </Box> */}
        </div>
    );
};

export default memo(Table);
