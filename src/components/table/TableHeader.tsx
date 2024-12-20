import { Box } from '@chakra-ui/react';
import { memo, useCallback, useEffect, useState, useTransition } from 'react';
import CreateColumn from '../../features/dataCollections/CreateColumn';
import { TColumn } from '../../types';
import ColumnMenu from './ColumnMenu';
// import { useParams } from 'react-router-dom';
// import { useGetUserGroupsQuery } from '../../app/services/api';
import { emptyDataCollectionPermissions } from '../../features/workspaces/UserGroups';

interface IProps {
    columns: any[];
    columnIsUpdating?: boolean;
    createColumn?: any;
    gridTemplateColumns: string;
    minCellWidth: number;
    columnResizingOffset: number;
    setGridTemplateColumns?: any;
    rearangeColumns: any;
    headerHeight?: string;
    updateBackendColumns: any;
    handleSetColumns: any;
    columnsAreFetching?: boolean;
    updateBackendColumnWidth: any;
    handleGridTemplateColumns: any;
    addNewColumnToRows: any;
    handleRemoveColumnFormRows: any;
    deleteColumn: any;
    allowed?: boolean;
    isFetching?: boolean;
    handleSortByColumnAsc: any;
    handleSortByColumnDes: any;
    hasCheckboxOptions?: boolean;
    hasColumnOptions?: boolean;
    columnsAreDraggable?: boolean;
    hasCreateColumn?: boolean;
    dataCollectionView?: any;
    appModel?: string | null;
    permissions?: any;
    refetchPermissions?: any;
    isArchives?: boolean;
    updateView?: any;
}

const TableHeader = ({
    columns,
    columnIsUpdating,
    createColumn,
    gridTemplateColumns,
    minCellWidth,
    columnResizingOffset,
    rearangeColumns,
    headerHeight = '40px',
    updateBackendColumns,
    handleSetColumns,
    columnsAreFetching = false,
    updateBackendColumnWidth,
    handleGridTemplateColumns,
    addNewColumnToRows,
    handleRemoveColumnFormRows,
    deleteColumn,
    // allowed = false,
    handleSortByColumnAsc,
    handleSortByColumnDes,
    hasCheckboxOptions = true,
    columnsAreDraggable = true,
    hasCreateColumn = true,
    dataCollectionView = null,
    appModel = null,
    permissions = emptyDataCollectionPermissions,
    refetchPermissions,
    isArchives = false,
    updateView,
}: IProps) => {
    const [currentColumns, setCurrentColumns] = useState(columns);
    // ******************* COLUMN REORDERING ******************************
    // ********************************************************************
    // let draggedColumnIndex: number | null = null;
    const [draggedColumnIndex, setDraggedColumnIndex] = useState<number | null>(null);
    const [dropColumnIndex, setDropColumnIndex] = useState<number | null>(null);

    useEffect(() => {
        setCurrentColumns(columns);
    }, [columns]);

    const handleDragStart = useCallback(
        (columnIndex: number) => {
            // Store the column being dragged
            // draggedColumnIndex = columnIndex;
            setDraggedColumnIndex(columnIndex);
        },
        [draggedColumnIndex]
    );

    const handleDragOver = useCallback(
        (event: any, columnIndex: number) => {
            // If the header being dragged is over a header other than it's self,
            // turn it blue else set it back to white
            if (draggedColumnIndex !== null && draggedColumnIndex !== columnIndex) {
                event.preventDefault();
                setDropColumnIndex(columnIndex);

                for (let i = 0; i < currentColumns.length; i++) {
                    const th: any = document.getElementById(String(i));
                    th.style.backgroundColor = 'white';
                }
                // const th: any = document.getElementById(String(columnIndex));
                // th.style.backgroundColor = '#f2f2f2';
            }
        },
        [draggedColumnIndex]
    );

    const handleDragEnd = useCallback(() => {
        // Set all headers back to white
        for (let i = 0; i < currentColumns.length; i++) {
            const th: any = document.getElementById(String(i));
            th.style.backgroundColor = 'white';
        }

        setDraggedColumnIndex(null);
        setDropColumnIndex(null);
    }, [draggedColumnIndex]);

    const handleDragLeave = useCallback(
        (columnIndex: number) => {
            // If the header being dragged is over a header other than it's self,
            // turn it white
            if (draggedColumnIndex !== columnIndex) {
                const th: any = document.getElementById(String(columnIndex));
                th.style.backgroundColor = 'white';
            }
        },
        [draggedColumnIndex]
    );

    const handleDrop = useCallback(
        (event: any, columnIndex: number) => {
            event.preventDefault();
            // If the header being dragged is over a header other than it's self,
            // Swap the columns

            if (draggedColumnIndex !== columnIndex) {
                const newColumns = [...currentColumns];
                const [draggedColumn] = newColumns.splice(draggedColumnIndex as number, 1);
                newColumns.splice(columnIndex, 0, draggedColumn);
                setCurrentColumns(newColumns);
                rearangeColumns(newColumns);

                const row = document.getElementsByClassName(dataCollectionView ? `table-row-${dataCollectionView._id}` : 'table-row')[0];

                const gridTemplateColumns = getComputedStyle(row).getPropertyValue('grid-template-columns');
                // Reorder the column widths and set the gridTemplateColumns
                const columnWidths: any = gridTemplateColumns.split(' ');
                columnWidths.shift();
                const [columnWidth] = columnWidths.splice(draggedColumnIndex as number, 1);
                // newColumns[draggedColumnIndex as number].width = columnWidth;
                columnWidths.splice(columnIndex, 0, columnWidth);
                const newColumnWidths = columnWidths.join(' ');

                handleGridTemplateColumns(newColumnWidths);
                // API call needed persist column order
                if (dataCollectionView) {
                    updateView({ ...dataCollectionView, columns: newColumns });
                } else {
                    updateBackendColumns(newColumns);
                }
            }

            setDraggedColumnIndex(null);
            setDropColumnIndex(null);
        },
        [draggedColumnIndex, currentColumns, dropColumnIndex]
    );

    // ******************* COLUMN WIDTH RESIZING ********************************
    // **************************************************************************
    const [_, startTransition] = useTransition();

    const [columnWidth, setColumnWidth] = useState('');
    const [resizedWidth, setResizedWidth] = useState<string | null>(null);

    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [activeColumn, setActiveColumn] = useState<TColumn | null>(null);
    const [mouseIsUp, setMouseIsUp] = useState<boolean>(false);
    // const { dataCollectionId } = useParams();

    // const { data: userGroups, refetch: refetchUserGroups } = useGetUserGroupsQuery(null);
    const [dataCollectionPermissions, setDataCollectionPermissions] = useState<any>(emptyDataCollectionPermissions);

    useEffect(() => {
        setDataCollectionPermissions(permissions);
    }, [permissions]);

    const mouseMove = useCallback(
        (e: any) => {
            // On mouse move, change the opacity of the resize handle so that it is visible
            const th: any = document.getElementById(dataCollectionView ? `${dataCollectionView._id}-${activeColumn?._id}` : (activeColumn?._id as string));

            // set the width by getting the new position of the resize handle on the page minus the width of the sidebar
            // and additional left padding
            const table: any = document.getElementById(`data-collection-table${dataCollectionView ? `-${dataCollectionView._id}` : ''}`);
            const width = e.clientX - columnResizingOffset - th.offsetLeft + Math.floor(table.scrollLeft);

            // If the width is greater than minumum allowed header width, resize based on the width calculation
            // else set it to the minumum header width
            th.children[1].style.position = 'absolute';
            console.log({ table });

            if (width > minCellWidth) {
                th.children[1].style.left = `${width}px`;
            } else {
                th.children[1].style.left = `${minCellWidth}px`;
            }

            // Go through each column and if the column is the one being resized,
            // set the width by getting the new position of the resize handle on the page minus the width of the sidebar
            // and additional left padding, else return its current width
            const gridColumns = currentColumns.map((col, i) => {
                const th: any = document.getElementById(dataCollectionView ? `${dataCollectionView._id}-${col?._id}` : (col?._id as string));

                if (i === activeIndex) {
                    const width = e.clientX - columnResizingOffset - th.offsetLeft + Math.floor(table.scrollLeft);

                    return width >= minCellWidth ? `${width}px` : `${minCellWidth}px`;
                }
                return `${th.offsetWidth}px`;
            });

            setResizedWidth(gridColumns[activeIndex as number]);

            // Add the gridTemplateColumns string to state
            setColumnWidth(`${gridColumns.join(' ')}`);

            // Event listener needs to be set here so that it does not go up the DOM tree
            // which creates a lag when the width is less than the minumum header width
            // document.addEventListener('mouseup', mouseUp, { once: true });
        },
        [activeIndex, currentColumns, minCellWidth, columnWidth, setResizedWidth]
    );

    const removeListeners = () => {
        window.removeEventListener('mousemove', mouseMove);
        window.removeEventListener('mouseup', removeListeners);
    };

    const mouseUp = useCallback(() => {
        if (resizedWidth !== null) {
            // Set the column widths
            if (dataCollectionView) {
                const tableRows: any = document.getElementsByClassName(`table-row view-${dataCollectionView._id}`);

                for (const tableRow of tableRows) {
                    tableRow.style.gridTemplateColumns = `220px ${columnWidth} 100px`;
                }

                const subTableRows: any = document.getElementsByClassName('table-row subrow');
                for (const tableRow of subTableRows) {
                    tableRow.style.gridTemplateColumns = `210px ${columnWidth} 100px`;
                }
            } else {
                const tableRows: any = document.getElementsByClassName('table-row');
                for (const tableRow of tableRows) {
                    tableRow.style.gridTemplateColumns = `220px ${columnWidth} 100px`;
                }

                const subTableRows: any = document.getElementsByClassName('table-row subrow');
                for (const tableRow of subTableRows) {
                    tableRow.style.gridTemplateColumns = `210px ${columnWidth} 100px`;
                }
            }

            // Set the defaults of the handle
            const th: any = document.getElementById(dataCollectionView ? `${dataCollectionView._id}-${activeColumn?._id}` : (activeColumn?._id as string));
            th.children[1].style.left = '100%';

            startTransition(() => {
                handleGridTemplateColumns(columnWidth);
            });

            // More defaults
            setMouseIsUp(true);
            removeListeners();
        }
    }, [setActiveIndex, removeListeners, columnWidth, gridTemplateColumns, resizedWidth]);

    // Sets up event listeners
    useEffect(() => {
        if (activeIndex !== null) {
            window.addEventListener('mousemove', mouseMove);
            window.addEventListener('mouseup', mouseUp, { once: true });
        }

        return () => {
            removeListeners();
        };
    }, [activeIndex, mouseMove, mouseUp, removeListeners]);

    // Whenever active index changes back to null from the mouse up event, update the database
    useEffect(() => {
        if (mouseIsUp && resizedWidth !== null) {
            updateBackendColumnWidth({ ...currentColumns[activeIndex || 0], width: resizedWidth });
            // handleGridTemplateColumns(`180px ${columnWidth}`);
            // handleGridTemplateColumns(columnWidth);
            setActiveIndex(null);
            setResizedWidth(null);
            window.removeEventListener('mouseup', mouseUp);
        }
    }, [mouseIsUp]);

    // When active index goes back to null ofter mouse up event, so does the mouseIsUp
    // Cannot set mouseIsUp in the save useEffect because it creates infinite rerenders
    useEffect(() => {
        if (activeIndex === null) {
            setMouseIsUp(false);
        }
    }, [activeIndex]);

    const handleAddNewColumnToRows = useCallback(
        (column: TColumn) => {
            setCurrentColumns([...currentColumns, column]);
            addNewColumnToRows(column);
        },
        [addNewColumnToRows, currentColumns]
    );

    const handleDeleteColumn = useCallback(
        (column: any) => {
            setCurrentColumns((prevColumns) => prevColumns.filter((prevColumn) => prevColumn._id !== column._id));
            deleteColumn(column);
            handleRemoveColumnFormRows(column);
        },
        [deleteColumn, currentColumns]
    );

    return (
        <div className="table-header">
            <div
                className={`table-row header ${dataCollectionView ? `view-${dataCollectionView._id}` : ''}`}
                style={{
                    // gridTemplateColumns: '220px ' + gridTemplateColumns + ' 100px',
                    gridTemplateColumns: `${hasCheckboxOptions ? '220px' : '150px'} ${gridTemplateColumns} 100px`,
                    position: 'sticky',
                    top: '0',
                    height: headerHeight,
                    borderBottom: '1px solid #edf2f7',
                }}
            >
                <span
                    style={{
                        height: '39px',
                        padding: '0px 20px',
                        borderRight: '1px solid #edf2f7',
                    }}
                >
                    {/* {isFetching ? <Spinner thickness="2px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="md" mt={'10px'} /> : null} */}
                </span>
                {currentColumns.map((column: any, columnIndex) => {
                    if (dataCollectionPermissions) {
                        const columnsPermissions = dataCollectionPermissions.columns.find((item: any) => {
                            return item.name === column?.name;
                        });

                        // if (columnsPermissions === undefined) {
                        //     refetchPermissions();
                        // }

                        if (columnsPermissions !== undefined && !columnsPermissions?.permissions.column.view) {
                            return null;
                        }
                    }

                    const draggable = columnIndex !== 0 && columnsAreDraggable && appModel === null && !isArchives;
                    // const draggable = true;

                    return (
                        <span
                            key={columnIndex}
                            id={dataCollectionView ? `${dataCollectionView._id}-${column._id}` : column._id}
                            className="resize-header"
                            style={{
                                height: '39px',
                                padding: '0px 20px',
                                cursor: draggable ? 'grab' : 'default',
                                zIndex: `${100 - columnIndex}`,
                                backgroundColor: draggedColumnIndex === columnIndex ? '#edf2f7' : 'unset',
                                borderLeft:
                                    draggedColumnIndex !== null && dropColumnIndex === columnIndex && draggedColumnIndex >= columnIndex
                                        ? '3px solid #2d82eb'
                                        : // : dropColumnIndex === null && columnIndex === 0
                                          // ? '1px solid lightgray'
                                          'unset',
                                borderRight:
                                    draggedColumnIndex !== null && dropColumnIndex === columnIndex && draggedColumnIndex < columnIndex
                                        ? '3px solid #2d82eb'
                                        : '1px solid #edf2f7',
                            }}
                        >
                            {/* Reorder column box */}
                            {columnIndex !== 0 ? (
                                <div
                                    style={{
                                        height: headerHeight,
                                        paddingTop: '8px',
                                        textAlign: 'center',
                                        fontWeight: '500',
                                        fontSize: '13px',
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis',
                                        cursor: draggable ? 'default' : 'grab',
                                    }}
                                    draggable={draggable}
                                    onDragStart={() => handleDragStart(columnIndex)}
                                    onDragOver={(event) => handleDragOver(event, columnIndex)}
                                    onDragEnd={() => handleDragEnd()}
                                    onDrop={(event) => handleDrop(event, columnIndex)}
                                    onDragLeave={() => handleDragLeave(columnIndex)}
                                >
                                    {/* {dataCollectionPermissions.columnActions.update || dataCollectionPermissions.columnActions.delete ? (
                                        <ColumnMenu
                                            column={column}
                                            columns={columns}
                                            handleDeleteColumn={handleDeleteColumn}
                                            handleAddNewColumnToRows={addNewColumnToRows}
                                            index={columnIndex}
                                            handleSortByColumnAsc={handleSortByColumnAsc}
                                            handleSortByColumnDes={handleSortByColumnDes}
                                            hasColumnOptions={hasColumnOptions}
                                            dataCollectionPermissions={dataCollectionPermissions}
                                        />
                                    ) : (
                                        <Text fontSize={'14px'} fontWeight={'medium'} color={'#666666'}>{`${column.name[0].toUpperCase()}${column.name
                                            .slice(1, column.name.length)
                                            .split('_')
                                            .join(' ')}`}</Text>
                                    )} */}
                                    <ColumnMenu
                                        column={column}
                                        columns={columns}
                                        handleDeleteColumn={handleDeleteColumn}
                                        handleAddNewColumnToRows={addNewColumnToRows}
                                        index={columnIndex}
                                        handleSortByColumnAsc={handleSortByColumnAsc}
                                        handleSortByColumnDes={handleSortByColumnDes}
                                        dataCollectionView={dataCollectionView}
                                        dataCollectionPermissions={dataCollectionPermissions}
                                        appModel={appModel}
                                    />
                                </div>
                            ) : (
                                <div
                                    style={{
                                        height: headerHeight,
                                        paddingTop: '8px',
                                        textAlign: 'center',
                                        fontWeight: '500',
                                        fontSize: '13px',
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis',
                                    }}
                                    // draggable={columnIndex !== 0}
                                    // onDragStart={() => handleDragStart(columnIndex)}
                                    // onDragOver={(event) => handleDragOver(event, columnIndex)}
                                    // onDragEnd={() => handleDragEnd()}
                                    // onDrop={(event) => handleDrop(event, columnIndex)}
                                    // onDragLeave={() => handleDragLeave(columnIndex)}
                                    // onClick={() => console.log('HEADER CLICKED')}
                                >
                                    {/* {dataCollectionPermissions.columnActions.update || dataCollectionPermissions.columnActions.delete ? (
                                        <ColumnMenu
                                            column={column}
                                            columns={columns}
                                            handleDeleteColumn={handleDeleteColumn}
                                            handleAddNewColumnToRows={handleAddNewColumnToRows}
                                            index={columnIndex}
                                            handleSortByColumnAsc={handleSortByColumnAsc}
                                            handleSortByColumnDes={handleSortByColumnDes}
                                            hasColumnOptions={hasColumnOptions}
                                        />
                                    ) : (
                                        <Text fontSize={'14px'} fontWeight={'medium'} color={'#666666'}>{`${column.name[0].toUpperCase()}${column.name
                                            .slice(1, column.name.length)
                                            .split('_')
                                            .join(' ')}`}</Text>
                                    )} */}
                                    <ColumnMenu
                                        column={column}
                                        columns={columns}
                                        handleDeleteColumn={handleDeleteColumn}
                                        handleAddNewColumnToRows={handleAddNewColumnToRows}
                                        index={columnIndex}
                                        handleSortByColumnAsc={handleSortByColumnAsc}
                                        handleSortByColumnDes={handleSortByColumnDes}
                                        dataCollectionView={dataCollectionView}
                                        dataCollectionPermissions={dataCollectionPermissions}
                                        appModel={appModel}
                                    />
                                </div>
                            )}
                            {/* Resize column box */}
                            {dataCollectionPermissions && dataCollectionPermissions.columnActions.resize ? (
                                <Box
                                    width={'5px'}
                                    height={headerHeight}
                                    position={'absolute'}
                                    top={'0'}
                                    left={'100%'}
                                    bgColor={activeIndex === columnIndex ? '#2d82eb' : 'unset'}
                                    _hover={{ bgColor: '#2d82eb', cursor: 'col-resize' }}
                                    onMouseDown={() => {
                                        setActiveIndex(columnIndex);
                                        setActiveColumn(column);
                                    }}
                                    // onMouseEnter={() => mouseEnter()}
                                ></Box>
                            ) : null}
                        </span>
                    );
                })}
                <span
                    style={{
                        height: '39px',
                        padding: '0px 20px',
                    }}
                >
                    {hasCreateColumn && dataCollectionPermissions && dataCollectionPermissions.columnActions.create && appModel == null && !isArchives ? (
                        <CreateColumn
                            columns={columns}
                            createColumn={createColumn}
                            addNewColumnToRows={handleAddNewColumnToRows}
                            columnIsUpdating={columnIsUpdating as boolean}
                            handleSetColumns={handleSetColumns}
                            columnsAreFetching={columnsAreFetching}
                            refetchPermissions={refetchPermissions}
                        />
                    ) : null}
                </span>
            </div>
        </div>
    );
};

export default memo(TableHeader);
