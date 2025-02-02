import { useEffect } from 'react';
import { useCallback, useState, memo } from 'react';
import './Table.css';
import TableContent from './TableContent';
import TableHeader from './TableHeader';
import { TColumn, TRow } from '../../types';
// import { useCreateColumnMutation, useDeleteColumnMutation } from '../../app/services/api';
import { Box, Center, Flex, Spacer, Text } from '@chakra-ui/react';
import { ArrowDownIcon, ArrowUpIcon, DeleteIcon } from '@chakra-ui/icons';
// import { useParams } from 'react-router';
import { useTypedSelector, useAppDispatch } from '../../hooks/store';
import { clearCheckedRowIds } from '../../components/table/tableSlice';
// import { useParams } from 'react-router-dom';
import { emptyDataCollectionPermissions } from '../../features/workspaces/UserGroups';
import { MdArchive } from 'react-icons/md';

interface ITableProps {
    rowsData?: any[];
    columnsData: any[];
    minCellWidth?: number;
    columnResizingOffset?: number;
    updateColumn: any;
    createColumn: any;
    createColumnIsUpdating: boolean;
    deleteColumn: any;
    deleteRow: any;
    reorderColumns: any;
    columnsAreFetching?: boolean;
    showDoneRows?: boolean;
    allowed?: boolean;
    isFetching?: boolean;
    refetch?: any;
    updateRow?: any;
    updateRowIsLoading?: boolean;
    view?: boolean;
    rowsAreDraggable?: boolean;
    hasCheckboxOptions?: boolean;
    hasColumnOptions?: boolean;
    columnsAreDraggable?: boolean;
    hasCreateColumn?: boolean;
    dataCollectionView?: any;
    refetchRows?: any;
    hideEmptyRows?: boolean;
    appModel?: string | null;
    dataCollectionPermissions?: any;
    viewPermissions?: any;
    refetchRowsForApp?: any;
    refetchPermissions?: any;
    isArchives?: boolean;
    updateView?: any;
    updateViewColumns?: any;
    active?: boolean;
    execute?: any;
}

const Table = ({
    rowsData,
    columnsData,
    minCellWidth = 120,
    columnResizingOffset = 0,
    updateColumn,
    createColumn,
    createColumnIsUpdating,
    deleteColumn,
    deleteRow,
    reorderColumns,
    columnsAreFetching = false,
    showDoneRows = true,
    allowed = false,
    refetch,
    isFetching = true,
    updateRow,
    view = false,
    rowsAreDraggable = true,
    hasCheckboxOptions = true,
    hasColumnOptions = true,
    columnsAreDraggable = true,
    hasCreateColumn = true,
    dataCollectionView = null,
    refetchRows,
    hideEmptyRows = false,
    appModel = null,
    dataCollectionPermissions = emptyDataCollectionPermissions,
    viewPermissions = null,
    refetchRowsForApp,
    refetchPermissions,
    isArchives = false,
    updateView,
    updateViewColumns,
    active = true,
    execute = null,
}: ITableProps) => {
    const dispatch = useAppDispatch();
    // const { dataCollectionId } = useParams();

    const checkedRowIds = useTypedSelector((state: any) => {
        return state.table.checkedRowIds;
    });

    const [columns, setColumns] = useState<any[]>(columnsData);

    const [gridTemplateColumns, setGridTemplateColumns] = useState<string>(columnsData.map((_) => '180px').join(' '));

    // const {
    //     data: rowsData,
    //     refetch,
    //     isFetching,
    //     // isLoading,
    // } = useGetRowsQuery({ dataCollectionId: dataCollectionId || '', limit: 0, skip: 0, sort: 1, sortBy: 'createdAt' });

    const [rows, setRows] = useState<any>(rowsData);

    // const [updateRowNoTag] = useUpdateRowNoTagMutation();
    // const [deleteRow] = useDeleteRowMutation();
    // const [reorderRows] = useReorderRowsMutation();
    // const [createColumn, { isLoading: columnIsUpdating }] = useCreateColumnMutation();
    // const [deleteColumn] = useDeleteColumnMutation();
    // const [rowCallUpdate] = useRowCallUpdateMutation();

    // const { data: userGroups, refetch: refetchUserGroups } = useGetUserGroupsQuery(null);
    // const [_dataCollectionPermissions, setDataCollectionPermissions] = useState<any>(emptyDataCollectionPermissions);
    const [permissions, setPermissions] = useState<any>(emptyDataCollectionPermissions);

    useEffect(() => {
        if (dataCollectionView && viewPermissions !== null) {
            setPermissions(viewPermissions);
        } else {
            setPermissions(dataCollectionPermissions);
        }
    }, [permissions]);

    useEffect(() => {
        setRows(rowsData);
        setColumns(columnsData);

        const gtc = columnsData
            .map((column) => {
                if (!column.isEmpty) {
                    return column?.width !== undefined ? column?.width : '180px';
                }
                return '';
            })
            .join(' ');

        setGridTemplateColumns(gtc);
        localStorage.setItem('draggable', 'true');
    }, [rowsData, columnsData]);

    const handleSetRows = useCallback((newRows: any[]) => {
        setRows(newRows);
    }, []);

    const handleSetGridTemplateColumns = (columnWidths: string) => {
        console.log(columnWidths);
        setGridTemplateColumns(columnWidths);
    };

    const rearangeColumns = (columns: TColumn[]) => {
        const newColumns: TColumn[] = columns.map((column, index) => {
            return { ...column, position: index + 1 };
        });
        console.log(newColumns);
        setColumns(newColumns);
    };

    const updateBackendColumns = (columns: TColumn[]) => {
        // setColumns(columns);
        reorderColumns(columns);
    };

    const updateBackendColumnWidth = useCallback(
        async (column: TColumn) => {
            if (view) {
                const viewColumns = columns.map((item: TColumn) => {
                    if (item._id == column._id) {
                        return column;
                    }
                    return item;
                });

                updateViewColumns(viewColumns);
            } else {
                updateColumn(column);
            }
        },
        [updateColumn]
    );

    const handleUpdateRowNoRender = useCallback(
        async (row: any) => {
            if (dataCollectionView) {
                updateRow({ ...row, fromView: true });
                refetch();
            } else {
                // We wait for the call to return new rows if it is the last row
                const newRows: any = await updateRow(row);
                // If it's the last row, add the new blank rows to the current rows
                // setRows((prev: any) => prev.map((prevRow: any) => (prevRow._id === row._id ? row : prevRow)));
                if (newRows.data && newRows.data.length > 0) {
                    setRows((prev: any) => {
                        return [...prev, ...newRows.data];
                    });

                    refetch();
                }
            }

            if (appModel) {
                refetchRowsForApp();
            }
        },
        [rows]
    );

    // const handleUpdateRow = useCallback(
    //     async (row: any) => {
    //         const newRows: any = await updateRow(row);

    //         // This handles adding additional rows if the last row is not empty
    //         if (newRows.data.length > 0) {
    //             setRows((prev: any) => {
    //                 return [...prev, ...newRows.data];
    //             });
    //         }
    //     },
    //     [rows]
    // );
    const [numberOfDeleteItems, setNumberOfDeleteItems] = useState(0);

    const handleDeleteBoxChange = useCallback(
        (status: boolean, index: number) => {
            setRows((prevRows: any) => prevRows.map((prevRow: any, rowIndex: any) => (index === rowIndex ? { ...prevRow, checked: true } : prevRow)));

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

        rowsCopy.map((row: any) => {
            if (checkedRowIds.includes(row._id) && row.isParent) {
                parentIds.push(row._id);
            }
        });

        let position = 0;

        // let checkedParent: any = null;

        const filterRowsChecked = rowsCopy.filter((row: any) => !checkedRowIds.includes(row._id));
        const filterSubrows = filterRowsChecked.filter((row: any) => !parentIds.includes(row.parentRowId));
        const newRows = filterSubrows.map((row: any) => {
            if (!checkedRowIds.includes(row._id)) {
                position = position + 1;
                return { ...row, position: position };
            }
            return row;
        });
        setRows(newRows);

        for (const row of rowsCopy) {
            if (parentIds.includes(row.parentRowId)) {
                deleteRow(row);
            }
            if (checkedRowIds.includes(row._id)) {
                deleteRow(row);
            }
        }
        setNumberOfDeleteItems(0);
        dispatch(clearCheckedRowIds());
    };

    const archiveItems = () => {
        const rowsCopy = rows;
        const parentIds: any = [];

        rowsCopy.map((row: any) => {
            if (checkedRowIds.includes(row._id) && row.isParent) {
                parentIds.push(row._id);
            }
        });

        let position = 0;

        // let checkedParent: any = null;

        const filterRowsChecked = rowsCopy.filter((row: any) => !checkedRowIds.includes(row._id));
        const filterSubrows = filterRowsChecked.filter((row: any) => !parentIds.includes(row.parentRowId));
        const newRows = filterSubrows.map((row: any) => {
            if (!checkedRowIds.includes(row._id)) {
                position = position + 1;
                return { ...row, position: position };
            }
            return row;
        });
        setRows(newRows);

        for (const row of rowsCopy) {
            if (parentIds.includes(row.parentRowId)) {
                updateRow({ ...row, archived: true });
            }
            if (checkedRowIds.includes(row._id)) {
                updateRow({ ...row, archived: true });
            }
        }
        setNumberOfDeleteItems(0);
        dispatch(clearCheckedRowIds());

        refetchRows();
    };

    const setArchivesToActive = () => {
        const rowsCopy = rows;
        const parentIds: any = [];

        rowsCopy.map((row: any) => {
            if (checkedRowIds.includes(row._id) && row.isParent) {
                parentIds.push(row._id);
            }
        });

        let position = 0;

        // let checkedParent: any = null;

        const filterRowsChecked = rowsCopy.filter((row: any) => !checkedRowIds.includes(row._id));
        const filterSubrows = filterRowsChecked.filter((row: any) => !parentIds.includes(row.parentRowId));
        const newRows = filterSubrows.map((row: any) => {
            if (!checkedRowIds.includes(row._id)) {
                position = position + 1;
                return { ...row, position: position };
            }
            return row;
        });
        setRows(newRows);

        for (const row of rowsCopy) {
            if (parentIds.includes(row.parentRowId)) {
                updateRow({ ...row, archived: false });
            }
            if (checkedRowIds.includes(row._id)) {
                updateRow({ ...row, archived: false });
            }
        }
        setNumberOfDeleteItems(0);
        dispatch(clearCheckedRowIds());

        refetchRows();
    };

    // const handleReorderRows = useCallback((rowIds: string[]) => {
    //     reorderRows(rowIds);
    // }, []);

    const handleAddNewColumnToRows = async (column: TColumn) => {
        setRows((prev: any) =>
            prev.map((row: any) => {
                return { ...row, values: { ...row.values, [column.name]: '' } };
            })
        );
        setGridTemplateColumns(gridTemplateColumns + ' 180px');
    };

    const handleRemoveColumnFromRows = (column: any) => {
        console.log(columns);
        const newRows = rows.map((row: TRow) => {
            let values = row.values;
            let refs = row.refs;

            const newValues: any = {};
            const newRefs: any = {};

            for (const col of columns) {
                if (!col.isEmpty) {
                    if (col.name !== column.name) {
                        if (values && values[col.name] !== undefined) {
                            newValues[col.name as string] = values[col.name];
                        }

                        if (refs && refs[col.name] !== undefined) {
                            newRefs[col.name] = refs[col.name];
                        }
                    }
                }
            }

            return { ...row, values: newValues, refs: newRefs };
        });

        setRows(newRows);
    };

    const handleModifyColumnNameInRows = (column: TColumn, prevColumn: TColumn) => {
        const newRows = rows.map((row: TRow) => {
            let values = row.values;
            let refs = row.refs;

            const newValues: any = {};
            const newRefs: any = {};

            console.log(values);

            for (const col of columns) {
                if (!col.isEmpty) {
                    if (col.name === prevColumn.name) {
                        if (values && values[col.name] !== undefined) {
                            newValues[column.name] = values[col.name];
                        }

                        if (refs && refs[col.name] !== undefined) {
                            newRefs[col.name] = refs[col.name];
                        }
                    } else {
                        newValues[col.name] = values[col.name];
                    }
                }
            }

            return { ...row, values: newValues, refs: newRefs };
        });

        setRows(newRows);
    };

    const handleSetColumns = (column: any) => {
        console.log(columns);
        const repositionedColumns = columns.map((col: TColumn) => {
            if (column._id !== col._id) {
                return { ...col };
            } else {
                return { ...column };
            }
        });

        const sortedColumns = repositionedColumns.sort((a: any, b: any) => {
            if (a.position < b.position) return -1;
            if (b.position > b.position) return 1;
            return 0;
        });
        setColumns(sortedColumns);
    };

    const handleDeleteColumn = useCallback(
        async (column: any) => {
            let position = 1;
            const repositionedColumns = columns.map((col: TColumn) => {
                const newPosition = position;

                if (column._id !== col._id) {
                    position++;
                    return { ...col, position: newPosition };
                } else {
                    const blankColumn = {
                        ...column,
                        name: `Column number ${position}`,
                        position: 40,
                        width: '180px',
                        people: [],
                        labels: [],
                        dataCollectionRef: {},
                        dataCollectionRefLabel: '',
                        includeInForm: true,
                        includeInExport: true,
                        autoIncremented: false,
                        autoIncrementPrefix: '',
                        primary: false,
                        prefix: null,
                        isEmpty: true,
                    };
                    return blankColumn;
                }
            });

            const sortedColumns = repositionedColumns.sort((a: any, b: any) => {
                if (a.position < b.position) return -1;
                if (b.position > b.position) return 1;
                return 0;
            });

            setColumns(sortedColumns);
            await deleteColumn(column);
            // refetchUserGroups();
            // deleteValues(column);
        },
        [columns]
    );

    const setAsMainrow = useCallback(() => {
        let currentParentId: any = null;
        let currentParent: any = null;
        let subrowCount = 1;

        let potentialParent: any = null;

        const makeAsParents: any = [];
        const removeAsParents: any = [];

        // let searchForSubrows = false;

        setRows((prevRows: any) =>
            prevRows.map((prevRow: any) => {
                const isParent = prevRow.isParent && (prevRow.parentRowId === undefined || prevRow.parentRowId === null);
                const isChild = prevRow.parentRowId !== null && prevRow.parentRowId !== undefined;
                // if current row is checked
                if (checkedRowIds.includes(prevRow._id)) {
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

        setRows((prevRows: any) =>
            prevRows.map((prevRow: any) => {
                if (removeAsParentsIds.includes(prevRow._id)) updateRow({ ...prevRow, isParent: false, parentRowId: null, showSubrows: true });
                return removeAsParentsIds.includes(prevRow._id) ? { ...prevRow, isParent: false, parentRowId: null, showSubrows: true } : prevRow;
            })
        );

        setRows((prevRows: any) =>
            prevRows.map((prevRow: any) => {
                if (makeAsParentsIds.includes(prevRow._id)) updateRow({ ...prevRow, isParent: true, parentRowId: null });
                return makeAsParentsIds.includes(prevRow._id) ? { ...prevRow, isParent: true, parentRowId: null } : prevRow;
            })
        );

        dispatch(clearCheckedRowIds());

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

        setRows((prevRows: any) =>
            prevRows.map((prevRow: any, index: any) => {
                // const isParent = prevRow.isParent && (prevRow.parentRowId === undefined || prevRow.parentRowId === null);
                const isChild = prevRow.parentRowId !== null && prevRow.parentRowId !== undefined;

                if (checkedRowIds.includes(prevRow._id)) {
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

        setRows((prevRows: any) =>
            prevRows.map((prevRow: any) => {
                if (parentRowIds.includes(prevRow._id)) updateRow({ ...prevRow, isParent: true });
                return parentRowIds.includes(prevRow._id) ? { ...prevRow, isParent: true } : prevRow;
            })
        );

        dispatch(clearCheckedRowIds());

        setNumberOfDeleteItems(0);
    }, [rows]);

    const [columnToSortBy, setColumnToSortBy] = useState(null);
    const [directionToSortBy, setDirectionToSortBy] = useState('Asc');

    const handleSortByColumnAsc = (column: any) => {
        setColumnToSortBy(column);
        setDirectionToSortBy('Asc');
    };

    const handleSortByColumnDes = (column: any) => {
        setColumnToSortBy(column);
        setDirectionToSortBy('Des');
    };

    return (
        <div
            id={`data-collection-table${dataCollectionView ? `-${dataCollectionView._id}` : ''}`}
            className={view || appModel ? 'table-view' : 'table'}
            style={{ position: 'relative' }}
        >
            {checkedRowIds.length > 0 ? (
                <Box
                    position={'absolute'}
                    bottom={'30px'}
                    left={'60px'}
                    w={'550px'}
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
                        {permissions.rows.subrows && !isArchives ? (
                            <>
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
                            </>
                        ) : null}
                        {/* <Spacer /> */}
                        {permissions.rows.delete ? (
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
                        ) : null}
                        {permissions.dataCollection.update ? (
                            <Box pt={'34px'} pr={'30px'} onClick={isArchives ? setArchivesToActive : archiveItems} cursor={'pointer'}>
                                {/* <Button colorScheme="red" mb={'10px'}>
                                Delete
                            </Button> */}
                                <Center mb={'10px'}>
                                    <Text fontSize={'20px'}>
                                        <MdArchive />
                                    </Text>
                                </Center>
                                <Center>
                                    <Text>{isArchives ? 'Set Active' : 'Archive'}</Text>
                                </Center>
                            </Box>
                        ) : null}
                    </Flex>
                </Box>
            ) : null}
            <TableHeader
                columns={columns}
                columnIsUpdating={createColumnIsUpdating}
                createColumn={createColumn}
                gridTemplateColumns={gridTemplateColumns}
                minCellWidth={minCellWidth}
                columnResizingOffset={columnResizingOffset}
                setGridTemplateColumns={handleSetGridTemplateColumns}
                rearangeColumns={rearangeColumns}
                updateBackendColumns={updateBackendColumns}
                handleSetColumns={handleSetColumns}
                updateBackendColumnWidth={updateBackendColumnWidth}
                handleGridTemplateColumns={handleSetGridTemplateColumns}
                addNewColumnToRows={handleAddNewColumnToRows}
                handleRemoveColumnFormRows={handleRemoveColumnFromRows}
                deleteColumn={handleDeleteColumn}
                columnsAreFetching={columnsAreFetching}
                allowed={allowed}
                isFetching={isFetching}
                handleSortByColumnAsc={handleSortByColumnAsc}
                handleSortByColumnDes={handleSortByColumnDes}
                hasCheckboxOptions={hasCheckboxOptions}
                hasColumnOptions={hasColumnOptions}
                columnsAreDraggable={columnsAreDraggable}
                hasCreateColumn={hasCreateColumn}
                dataCollectionView={dataCollectionView}
                appModel={appModel}
                permissions={permissions}
                refetchPermissions={refetchPermissions}
                isArchives={isArchives}
                updateView={updateView}
                handleModifyColumnNameInRows={handleModifyColumnNameInRows}
            />
            <TableContent
                rows={rows || []}
                columns={columns}
                setRows={handleSetRows}
                gridTemplateColumnsIn={gridTemplateColumns}
                minCellWidth={minCellWidth}
                columnResizingOffset={columnResizingOffset}
                reorderColumns={reorderColumns}
                updateColumn={updateColumn}
                handleUpdateRowNoRender={handleUpdateRowNoRender}
                // handleUpdateRow={handleUpdateRow}
                updateRow={updateRow}
                handleDeleteBoxChange={handleDeleteBoxChange}
                // handleReorderRows={handleReorderRows}
                // rowCallUpdate={rowCallUpdate}
                showDoneRows={showDoneRows}
                allowed={allowed}
                columnToSortBy={columnToSortBy}
                directionToSortBy={directionToSortBy}
                view={view}
                rowsAreDraggable={rowsAreDraggable}
                hasCheckboxOptions={hasCheckboxOptions}
                dataCollectionView={dataCollectionView}
                refetchRows={refetchRows}
                hideEmptyRows={hideEmptyRows}
                appModel={appModel}
                permissions={permissions}
                isArchives={isArchives}
                active={active}
                execute={execute}
            />
            {/* <Box w={'100%'} h={'30px'}>
                <Text ml={'10px'}>Add row</Text>
            </Box> */}
        </div>
    );
};

export default memo(Table);
