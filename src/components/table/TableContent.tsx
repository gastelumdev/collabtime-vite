import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { ViewportList } from 'react-viewport-list';
import Row from './Row';
// import { swapItems } from '../../utils/helpers';
// import { useUpdateRowMutation } from '../../app/services/api';
import { Box } from '@chakra-ui/react';
import { TRow } from '../../types';

interface IProps {
    rows: any[];
    columns: any[];
    setRows: any;
    gridTemplateColumnsIn: string;
    minCellWidth?: number;
    columnResizingOffset?: number;
    updateColumn?: any;
    reorderColumns?: any;
    handleUpdateRowNoRender: any;
    updateRow?: any;
    handleDeleteBoxChange: any;
    handleReorderRows?: any;
    rowCallUpdate?: any;
    showDoneRows?: boolean;
    allowed?: boolean;
    columnToSortBy: any;
    directionToSortBy: string;
    view?: boolean;
}

const TableContent = ({
    rows,
    columns,
    setRows,
    gridTemplateColumnsIn,
    // minCellWidth,
    // columnResizingOffset,
    // updateColumn,
    // reorderColumns,

    handleUpdateRowNoRender,
    updateRow,
    handleDeleteBoxChange,
    // rowCallUpdate,
    showDoneRows = false,
    allowed = false,
    columnToSortBy = null,
    directionToSortBy = 'Asc',
    view = false,
}: IProps) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [gridTemplateColumns, setGridTemplateColumns] = useState('');

    const [currentRows, setCurrentRows] = useState(rows);

    useEffect(() => {
        view;
        if (showDoneRows) {
            setCurrentRows(rows);
        } else {
            setCurrentRows(
                rows?.filter((row) => {
                    return !row.complete;
                })
            );
        }
    }, [showDoneRows, rows]);

    useEffect(() => {
        console.log(columnToSortBy);
        if (columnToSortBy !== null) {
            const rowsCopy: TRow[] = [...rows];

            let rowValue = '';

            const rowsWithSortKey = rowsCopy.map((row) => {
                if (row.parentRowId === null) rowValue = row.values[columnToSortBy.name];

                return { ...row, sortKey: rowValue };
            });

            console.log(rowsWithSortKey);

            if (directionToSortBy === 'Asc') {
                rowsWithSortKey.sort((a: any, b: any) => {
                    let aValue = a.sortKey;
                    let bValue = b.sortKey;

                    if (aValue === undefined || aValue === '') aValue = '~';
                    if (bValue === undefined || bValue === '') bValue = '~';

                    if (aValue.toLowerCase() < bValue.toLowerCase()) {
                        return -1;
                    } else if (aValue.toLowerCase() > bValue.toLowerCase()) {
                        return 1;
                    }

                    return 0;
                });
            } else {
                rowsWithSortKey.sort((a: any, b: any) => {
                    let aValue = a.sortKey;
                    let bValue = b.sortKey;

                    if (aValue === undefined || aValue === '') aValue = ' ';
                    if (bValue === undefined || bValue === '') bValue = ' ';

                    if (aValue.toLowerCase() > bValue.toLowerCase()) {
                        return -1;
                    } else if (aValue.toLowerCase() < bValue.toLowerCase()) {
                        return 1;
                    }

                    return 0;
                });
            }

            setCurrentRows(rowsWithSortKey);
            setRows(rowsWithSortKey);
        }
    }, [columnToSortBy, directionToSortBy]);

    // const [updateRow] = useUpdateRowMutation();

    useEffect(() => {
        setGridTemplateColumns(gridTemplateColumnsIn);
    }, [gridTemplateColumnsIn]);

    // const [_, setOverId] = useState<number | null>(null);
    // const [draggedId, setDraggedId] = useState<number | null>(null);

    const handleDragEnter = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    }, []);
    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleSwap = () => {
        console.log({ rowDragged: localStorage.getItem('rowDragged'), rowOver: localStorage.getItem('rowOver') });
        const rowsCopy = [...rows];
        const rowDragged = Number(localStorage.getItem('rowDragged'));
        const rowOver = Number(localStorage.getItem('rowOver'));
        const draggedUp = rowDragged > rowOver;

        let orderedRows: any;

        const draggedRow = {
            ...rowsCopy.find((row) => {
                return row.position === rowDragged;
            }),
        };

        const overRow = rowsCopy.find((row) => {
            return row.position === rowOver;
        });

        const draggedIsParent = draggedRow.isParent;
        const draggedIsChild = !draggedRow.isParent && draggedRow.parentRowId !== null;
        const draggedIsCommon = !draggedRow.isParent && draggedRow.parentRowId === null;

        const overIsParent = overRow.isParent;
        const overIsChild = !overRow.isParent && overRow.parentRowId !== null;
        const overIsCommon = !overRow.isParent && overRow.parentRowId === null;

        // DRAGGED UP
        if (draggedUp) {
            const rowsBeforeOver = rowsCopy.filter((row) => {
                return row.position < overRow.position;
            });

            const rowBeforeOver = rowsBeforeOver.length > 0 ? rowsBeforeOver[rowsBeforeOver.length - 1] : null;

            if (!draggedIsParent) {
                draggedRow.position = (overRow.position + (rowBeforeOver ? rowBeforeOver.position : 0)) / 2;

                if ((draggedIsCommon && overIsChild) || (draggedIsChild && overIsChild)) {
                    draggedRow.parentRowId = overRow.parentRowId;
                }

                if (
                    (draggedIsChild && overIsParent) ||
                    (draggedIsChild && overIsCommon) ||
                    (draggedIsCommon && overIsParent) ||
                    (draggedIsCommon && overIsCommon)
                ) {
                    draggedRow.isParent = false;
                    draggedRow.parentRowId = null;
                }

                const newRows = rowsCopy.map((row) => {
                    if (row._id === draggedRow._id) {
                        updateRow(draggedRow);
                        return draggedRow;
                    }
                    return row;
                });

                orderedRows = newRows.sort((a, b) => {
                    if (a.position < b.position) {
                        return -1;
                    } else if (a.position > b.position) {
                        return 1;
                    }
                    return 0;
                });

                console.log({ draggedRow, overRow, rowBeforeOver });
            } else {
                let newDraggedRows: any = [];

                console.log({ draggedRow, overRow, rowBeforeOver });

                if ((draggedIsParent && overIsParent) || (draggedIsParent && overIsCommon)) {
                    const draggedRows = rowsCopy.filter((row) => {
                        return row._id === draggedRow._id || row.parentRowId === draggedRow._id;
                    });

                    const positionDivision = Math.round((overRow.position - (rowBeforeOver ? rowBeforeOver.position : 0)) / (draggedRows.length + 1));
                    let position = (rowBeforeOver ? rowBeforeOver.position : 0) + positionDivision;

                    newDraggedRows = draggedRows.map((row) => {
                        const newRow = { ...row, position: position };
                        position = position + positionDivision;
                        return newRow;
                    });
                }

                const newRows = rowsCopy.map((row) => {
                    const newDraggedRow = newDraggedRows.find((item: any) => {
                        return row._id === item._id;
                    });

                    if (newDraggedRow !== undefined) {
                        updateRow(newDraggedRow);
                        return newDraggedRow;
                    }
                    return row;
                });

                orderedRows = newRows.sort((a, b) => {
                    if (a.position < b.position) {
                        return -1;
                    } else if (a.position > b.position) {
                        return 1;
                    }
                    return 0;
                });

                console.log(orderedRows);
            }

            // setRows(orderedRows);
            // setCurrentRows(orderedRows);

            // DRAGGED DOWN
        } else {
            const rowsAfterOver = rowsCopy.filter((row) => {
                return row.position > overRow.position;
            });

            const rowAfterOver = rowsAfterOver[0];

            if (!draggedIsParent) {
                const newPosition = (overRow.position + rowAfterOver.position) / 2;

                draggedRow.position = newPosition;

                if ((draggedIsChild && overIsParent) || (draggedIsCommon && overIsParent)) {
                    draggedRow.parentRowId = overRow._id;
                }

                if ((draggedIsChild && overIsChild) || (draggedIsCommon && overIsChild)) {
                    draggedRow.parentRowId = overRow.parentRowId;
                }

                if ((draggedIsChild && overIsCommon) || (draggedIsCommon && overIsCommon)) {
                    draggedRow.isParent = false;
                    draggedRow.parentRowId = null;
                }

                const newRows = rowsCopy.map((row) => {
                    if (row._id === draggedRow._id) {
                        updateRow(draggedRow);
                        return draggedRow;
                    }
                    return row;
                });

                orderedRows = newRows.sort((a, b) => {
                    if (a.position < b.position) {
                        return -1;
                    } else if (a.position > b.position) {
                        return 1;
                    }
                    return 0;
                });

                console.log({ draggedRow, overRow, rowAfterOver });

                // setRows(orderedRows);
                // setCurrentRows(orderedRows);
            } else {
                let newDraggedRows: any = [];

                const overRowSiblings = rowsCopy.filter((row) => {
                    return row.parentRowId === overRow.parentRowId;
                });

                console.log(overRowSiblings);

                if ((draggedIsParent && overIsCommon) || overRow._id === overRowSiblings[overRowSiblings.length - 1]._id) {
                    const draggedRows = rowsCopy.filter((row) => {
                        return row._id === draggedRow._id || row.parentRowId === draggedRow._id;
                    });

                    const positionDivision = Math.round((rowAfterOver.position - overRow.position) / (draggedRows.length + 1));
                    let position = overRow.position + positionDivision;

                    newDraggedRows = draggedRows.map((row) => {
                        const newRow = { ...row, position: position };
                        position = position + positionDivision;
                        return newRow;
                    });
                }

                const newRows = rowsCopy.map((row) => {
                    const newDraggedRow = newDraggedRows.find((item: any) => {
                        return row._id === item._id;
                    });

                    if (newDraggedRow !== undefined) {
                        updateRow(newDraggedRow);
                        return newDraggedRow;
                    }
                    return row;
                });

                orderedRows = newRows.sort((a, b) => {
                    if (a.position < b.position) {
                        return -1;
                    } else if (a.position > b.position) {
                        return 1;
                    }
                    return 0;
                });

                console.log(orderedRows);
            }

            console.log({ draggedRow, overRow, rowAfterOver });

            // setRows(orderedRows);
            // setCurrentRows(orderedRows);
        }

        const finalRows = orderedRows.map((row: any) => {
            if (row.isParent) {
                const child = orderedRows.find((orderedRow: any) => {
                    return orderedRow.parentRowId === row._id;
                });

                if (child === undefined) {
                    updateRow({ ...row, isParent: false });
                    return { ...row, isParent: false };
                }

                return row;
            }
            return row;
        });

        setRows(finalRows);
        setCurrentRows(finalRows);
    };

    const handleChange = (row: any) => {
        setCurrentRows((prev) => prev.map((prevRow) => (prevRow._id === row._id ? row : prevRow)));
        setRows((prev: any) => prev.map((prevRow: any) => (prevRow._id === row._id ? row : prevRow)));
        handleUpdateRowNoRender(row);
    };

    const handleSubrowVisibility = (row: any) => {
        const newRows: any = currentRows.map((currentRow) => {
            if (currentRow._id === row._id) {
                updateRow({ ...currentRow, showSubrows: !currentRow.showSubrows });
                return { ...currentRow, showSubrows: !currentRow.showSubrows };
            }
            if (currentRow.parentRowId === row._id) {
                updateRow({ ...currentRow, isVisible: !currentRow.isVisible });
                return { ...currentRow, isVisible: !currentRow.isVisible };
            }
            return currentRow;
        });

        setRows(newRows);
        setCurrentRows(newRows);
    };

    const handleDeleteBoxChangeForRow = (status: boolean, index: number) => {
        // Allows Table component to set
        handleDeleteBoxChange(status, index);
        setRows(currentRows.map((prevRow, rowIndex) => (index === rowIndex ? { ...prevRow, checked: status } : prevRow)));
    };

    const [show, setShow] = useState(true);
    return (
        <div
            className="table-content scroll-container"
            ref={ref}
            onDragEnter={(event: React.DragEvent<HTMLDivElement>) => handleDragEnter(event)}
            onDragLeave={(event: React.DragEvent<HTMLDivElement>) => handleDragLeave(event)}
            onScroll={(event: React.UIEvent<HTMLDivElement, UIEvent>) => {
                event;
                if (show) {
                    setShow(false);
                }

                setShow(true);
            }}
        >
            <ViewportList viewportRef={ref} items={currentRows} overscan={25}>
                {(row, rowIndex) => {
                    return (
                        <Box key={row._id}>
                            {!row.complete || showDoneRows ? (
                                <div key={row._id} className="item">
                                    <div key={row._id}>
                                        <Row
                                            row={row}
                                            rowIndex={rowIndex}
                                            columns={columns}
                                            gridTemplateColumns={gridTemplateColumns}
                                            // handleSetDraggedId={handleSetDraggedId}
                                            // handleSetOverId={handleSetOverId}
                                            handleSwap={handleSwap}
                                            handleChange={handleChange}
                                            deleteBoxIsChecked={row.checked}
                                            handleDeleteBoxChange={handleDeleteBoxChangeForRow}
                                            handleSubrowVisibility={handleSubrowVisibility}
                                            // rowCallUpdate={rowCallUpdate}
                                            allowed={allowed}
                                            showDoneRows={showDoneRows}
                                            isDraggable={columnToSortBy === null}
                                        />
                                    </div>
                                    <div></div>
                                </div>
                            ) : null}
                        </Box>
                    );
                }}
            </ViewportList>
            {/* ) : (
                'Loading'
            )} */}
        </div>
    );
};

export default memo(TableContent);
// Start marker
