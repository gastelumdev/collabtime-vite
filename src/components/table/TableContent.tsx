import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { ViewportList } from 'react-viewport-list';
import Row from './Row';
import { swapItems } from '../../utils/helpers';
// import { useUpdateRowMutation } from '../../app/services/api';
import { Box } from '@chakra-ui/react';

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
}: IProps) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [gridTemplateColumns, setGridTemplateColumns] = useState('');

    const [currentRows, setCurrentRows] = useState(rows);

    useEffect(() => {
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

    // const [updateRow] = useUpdateRowMutation();

    useEffect(() => {
        setGridTemplateColumns(gridTemplateColumnsIn);
    }, [gridTemplateColumnsIn]);

    const [_, setOverId] = useState<number | null>(null);
    const [draggedId, setDraggedId] = useState<number | null>(null);

    const handleDragEnter = useCallback(
        (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            event.stopPropagation();
            if (draggedId !== null) {
                event.preventDefault();
                event.stopPropagation();
            }
        },
        [draggedId]
    );
    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    //****************************************************** */
    const handleSetDraggedId = useCallback((rowIndex: number) => {
        setDraggedId(rowIndex);
    }, []);

    const handleSetOverId = useCallback((rowIndex: number | null) => {
        setOverId(rowIndex);
    }, []);

    const handleSwap = () => {
        // let position = 0;
        const newRows = [...rows];
        // const newRows: any = rows.map((row) => {
        //     position = position + 1;
        //     return { ...row, position: position };
        // });

        // Get the dragged row and the row that it was dropped on
        const draggedRowData = newRows[Number(localStorage.getItem('rowDragged')) - 1];
        const overRowData = newRows[Number(localStorage.getItem('rowOver')) - 1];

        // Set the type of row that was dragged
        const draggedIsCommon = !draggedRowData.isParent && draggedRowData.parentRowId === null;
        const draggedIsParent = draggedRowData.isParent && draggedRowData.parentRowId === null;
        const draggedIsChild = !draggedRowData.isParent && draggedRowData.parentRowId !== null;
        // Set the type of row that it was dropped on
        const overIsCommon = !overRowData.isParent && overRowData.parentRowId === null;
        const overIsParent = overRowData.isParent && overRowData.parentRowId === null;
        const overIsChild = !overRowData.isParent && overRowData.parentRowId !== null;

        // Get the rows if the dragged row is a parent
        let childRows = [];
        if (draggedIsParent) {
            childRows = newRows.filter((row: any) => {
                return draggedIsParent && row.parentRowId === draggedRowData._id;
            });
        }

        let reorderedRows;

        if ((draggedIsParent && overIsChild) || (draggedIsParent && overIsParent)) {
            setCurrentRows([...newRows]);
        } else {
            reorderedRows = swapItems(newRows, Number(localStorage.getItem('rowDragged')), Number(localStorage.getItem('rowOver')), childRows.length + 1);
            setRows(reorderedRows);
            setCurrentRows(reorderedRows);

            // const repositionedRows: any = setPositions(reorderedRows);

            const rowsToUpdate: any = {};

            // if ((draggedIsParent && overIsCommon) || (draggedIsCommon && overIsCommon)) {
            //     setRows(repositionedRows);
            //     setCurrentRows(repositionedRows);
            // }

            const relAdjustedRow = reorderedRows.map((row: any, index: number) => {
                let rowToUpdate: any = row;

                if (rowToUpdate.position !== index + 1) {
                    console.log('Row out of order');
                    rowToUpdate = { ...rowToUpdate, position: index + 1 };

                    rowsToUpdate[rowToUpdate._id] = { ...rowToUpdate, position: index + 1 };
                }

                if (rowToUpdate.position === overRowData.position) {
                    console.log(rowToUpdate);
                    if (draggedIsCommon && overIsParent && draggedRowData.position < overRowData.position) {
                        // The dragged row needs to update to be set as parent false and parentRowId of over row

                        rowToUpdate = { ...rowToUpdate, isParent: false, parentRowId: overRowData._id, isVisible: overRowData.showSubrows };
                        rowsToUpdate[rowToUpdate._id] = { ...rowToUpdate, isParent: false, parentRowId: overRowData._id, isVisible: overRowData.showSubrows };
                        // updateRow({ ...rowToUpdate, isParent: false, parentRowId: overRowData._id, isVisible: overRowData.showSubrows });
                        return { ...rowToUpdate, isParent: false, parentRowId: overRowData._id, isVisible: overRowData.showSubrows };
                    }

                    if (draggedIsCommon && overIsChild) {
                        // The dragged row needs to update to be set as parent false and share the parentRowId of the over row

                        console.log(rowToUpdate);
                        rowToUpdate = { ...rowToUpdate, isParent: false, parentRowId: overRowData.parentRowId };
                        rowsToUpdate[rowToUpdate._id] = { ...rowToUpdate, isParent: false, parentRowId: overRowData.parentRowId };
                        // updateRow({ ...rowToUpdate, isParent: false, parentRowId: overRowData.parentRowId });
                        return { ...rowToUpdate, isParent: false, parentRowId: overRowData.parentRowId };
                    }

                    if (draggedIsChild && overIsCommon) {
                        // The dragged row needs to update to be set as parent false and parentRowId as null
                        // console.log('Child into common');
                        console.log(rowToUpdate);
                        rowToUpdate = { ...rowToUpdate, isParent: false, parentRowId: null };
                        rowsToUpdate[rowToUpdate._id] = { ...rowToUpdate, isParent: false, parentRowId: null };
                        // updateRow({ ...rowToUpdate, isParent: false, parentRowId: null });
                        return { ...rowToUpdate, isParent: false, parentRowId: null };
                    }

                    if (draggedIsChild && overIsParent) {
                        if (draggedRowData.position < overRowData.position) {
                            // The dragged row needs to update to be set as parent false and parentRowId of over row

                            rowToUpdate = { ...rowToUpdate, isParent: false, parentRowId: overRowData._id };
                            rowsToUpdate[rowToUpdate._id] = { ...rowToUpdate, isParent: false, parentRowId: overRowData._id };
                            // updateRow({ ...rowToUpdate, isParent: false, parentRowId: overRowData._id });
                            return { ...rowToUpdate, isParent: false, parentRowId: overRowData._id };
                        } else {
                            // The dragged row needs to update to be set as parent false and parentRowId as null

                            rowToUpdate = { ...rowToUpdate, isParent: false, parentRowId: null };
                            rowsToUpdate[rowToUpdate._id] = { ...rowToUpdate, isParent: false, parentRowId: null };
                            // updateRow({ ...rowToUpdate, isParent: false, parentRowId: null });
                            return { ...rowToUpdate, isParent: false, parentRowId: null };
                        }
                    }
                }

                return rowToUpdate;
            });

            for (const rowToUpdateId in rowsToUpdate) {
                updateRow(rowsToUpdate[rowToUpdateId]);
            }

            setRows(relAdjustedRow);

            setCurrentRows(relAdjustedRow);

            // if (draggedIsCommon && overIsParent && draggedRowData.position < overRowData.position) {
            //     // The dragged row needs to update to be set as parent false and parentRowId of over row

            //     const relAdjustedRow = repositionedRows.map((row: any) => {
            //         if (row.position === overRowData.position) {
            //             updateRow({ ...row, isParent: false, parentRowId: overRowData._id, isVisible: overRowData.showSubrows });
            //             return { ...row, isParent: false, parentRowId: overRowData._id, isVisible: overRowData.showSubrows };
            //         }
            //         return row;
            //     });

            //     setRows(relAdjustedRow);

            //     setCurrentRows(relAdjustedRow);
            // }

            // if (draggedIsCommon && overIsChild) {
            //     // The dragged row needs to update to be set as parent false and share the parentRowId of the over row
            //     console.log('Common into child');
            //     const relAdjustedRows = repositionedRows.map((row: any) => {
            //         if (row.position === overRowData.position) {
            //             console.log(row);
            //             updateRow({ ...row, isParent: false, parentRowId: overRowData.parentRowId });
            //             return { ...row, isParent: false, parentRowId: overRowData.parentRowId };
            //         }
            //         return row;
            //     });

            //     setRows(relAdjustedRows);

            //     setCurrentRows(relAdjustedRows);
            // }

            // if (draggedIsChild && overIsCommon) {
            //     // The dragged row needs to update to be set as parent false and parentRowId as null
            //     // console.log('Child into common');
            //     const relAdjustedRows = repositionedRows.map((row: any) => {
            //         if (row.position === overRowData.position) {
            //             console.log(row);
            //             updateRow({ ...row, isParent: false, parentRowId: null });
            //             return { ...row, isParent: false, parentRowId: null };
            //         }
            //         return row;
            //     });

            //     setRows(relAdjustedRows);

            //     setCurrentRows(relAdjustedRows);
            // }

            // if (draggedIsChild && overIsParent) {
            //     if (draggedRowData.position < overRowData.position) {
            //         // The dragged row needs to update to be set as parent false and parentRowId of over row

            //         const relAdjustedRows = repositionedRows.map((row: any) => {
            //             if (row.position === overRowData.position) {
            //                 updateRow({ ...row, isParent: false, parentRowId: overRowData._id });
            //                 return { ...row, isParent: false, parentRowId: overRowData._id };
            //             }
            //             return row;
            //         });

            //         setRows(relAdjustedRows);

            //         setCurrentRows(relAdjustedRows);
            //     } else {
            //         // The dragged row needs to update to be set as parent false and parentRowId as null

            //         const relAdjustedRows = repositionedRows.map((row: any) => {
            //             if (row.position === overRowData.position) {
            //                 updateRow({ ...row, isParent: false, parentRowId: null });
            //                 return { ...row, isParent: false, parentRowId: null };
            //             }
            //             return row;
            //         });

            //         setRows(relAdjustedRows);

            //         setCurrentRows(relAdjustedRows);
            //     }
            // }
        }

        setOverId(null);
        setDraggedId(null);
        localStorage.setItem('dragging', '');
    };

    const handleChange = (row: any) => {
        setCurrentRows((prev) => prev.map((prevRow) => (prevRow._id === row._id ? row : prevRow)));
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
                                            handleSetDraggedId={handleSetDraggedId}
                                            handleSetOverId={handleSetOverId}
                                            handleSwap={handleSwap}
                                            handleChange={handleChange}
                                            deleteBoxIsChecked={row.checked}
                                            handleDeleteBoxChange={handleDeleteBoxChangeForRow}
                                            handleSubrowVisibility={handleSubrowVisibility}
                                            // rowCallUpdate={rowCallUpdate}
                                            allowed={allowed}
                                            showDoneRows={showDoneRows}
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
