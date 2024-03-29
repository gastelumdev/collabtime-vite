import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { ViewportList } from 'react-viewport-list';
import Row from './Row';
import { swapItems } from '../../utils/helpers';
import { useUpdateRowMutation, useUpdateRowNoTagMutation } from '../../app/services/api';
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
    handleUpdateRow?: any;
    handleDeleteBoxChange: any;
    handleReorderRows: any;
    rowCallUpdate: any;
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
    // handleUpdateRow,
    handleDeleteBoxChange,
    rowCallUpdate,
    showDoneRows = false,
    allowed = false,
}: IProps) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [gridTemplateColumns, setGridTemplateColumns] = useState('');

    const [currentRows, setCurrentRows] = useState(rows);

    useEffect(() => {
        setCurrentRows(rows);
    }, [rows]);

    const [updateRow] = useUpdateRowMutation();
    const [updateRowNoTag] = useUpdateRowNoTagMutation();

    useEffect(() => {
        let position = 0;
        let currentParent: any = null;
        const parentsToMakeCommon: any = [];

        const repositionedRows = rows.map((row) => {
            if (currentParent !== null && row.parentRowId !== currentParent._id) {
                parentsToMakeCommon.push(currentParent._id);
            }

            if (row.isParent) {
                currentParent = row;
            } else {
                currentParent = null;
            }

            position = position + 1;
            if (row.position != position) {
                updateRow({ ...row, position: position });
                return { ...row, position: position };
            }
            return row;
        });

        const resetRows = repositionedRows.map((row) => {
            if (parentsToMakeCommon.includes(row._id)) {
                updateRow({ ...row, isParent: false, showSubrows: true });
                return { ...row, isParent: false, showSubrows: true };
            }
            return row;
        });
        setCurrentRows(resetRows);
    }, [rows, showDoneRows]);

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

    const setPositions = (list: any, draggedIndex: number, overIndex: number, numberOfChildren: number) => {
        const range: any = [];

        if (draggedIndex < overIndex) {
            if (draggedIndex !== 0) {
                draggedIndex = draggedIndex - 1;
            }
            if (overIndex !== list.length) {
                overIndex = overIndex + 1;
            }
            for (let i = draggedIndex; i < overIndex + numberOfChildren; i++) {
                range.push(i);
            }
        } else {
            if (overIndex !== 0) {
                overIndex = overIndex - 1;
            }
            if (draggedIndex !== list.length) {
                draggedIndex = draggedIndex + 1;
            }
            for (let i = overIndex; i < draggedIndex + numberOfChildren; i++) {
                range.push(i);
            }
        }

        const newRows = list.map((row: any, index: number) => {
            const updatedRow = { ...row, position: index + 1 };
            // handleUpdateRow(updatedRow);

            if (row.position !== index + 1) {
                updateRowNoTag(updatedRow);
            }
            return updatedRow;
        });
        return newRows;
    };

    const handleSwap = () => {
        let position = 0;
        const newRows: any = currentRows.map((row) => {
            position = position + 1;
            return { ...row, position: position };
        });
        const draggedRowData = newRows[Number(localStorage.getItem('rowDragged')) - 1];
        const overRowData = newRows[Number(localStorage.getItem('rowOver')) - 1];

        const draggedIsCommon = !draggedRowData.isParent && draggedRowData.parentRowId === null;
        const draggedIsParent = draggedRowData.isParent && draggedRowData.parentRowId === null;
        const draggedIsChild = !draggedRowData.isParent && draggedRowData.parentRowId !== null;

        const overIsCommon = !overRowData.isParent && overRowData.parentRowId === null;
        const overIsParent = overRowData.isParent && overRowData.parentRowId === null;
        const overIsChild = !overRowData.isParent && overRowData.parentRowId !== null;

        const childRows = newRows.filter((row: any) => {
            return draggedIsParent && row.parentRowId === draggedRowData._id;
        });

        let reorderedRows;

        if ((draggedIsParent && overIsChild) || (draggedIsParent && overIsParent)) {
            setCurrentRows([...newRows]);
        } else {
            reorderedRows = swapItems(newRows, Number(localStorage.getItem('rowDragged')), Number(localStorage.getItem('rowOver')), childRows.length + 1);
            setRows(reorderedRows);
            setCurrentRows(reorderedRows);

            const repositionedRows: any = setPositions(
                reorderedRows,
                // currentRows,
                Number(localStorage.getItem('rowDragged')),
                Number(localStorage.getItem('rowOver')),
                childRows.length
            );

            // setCurrentRows(repositionedRows);

            if ((draggedIsParent && overIsCommon) || (draggedIsCommon && overIsCommon)) {
                setRows(repositionedRows);
                setCurrentRows(repositionedRows);
            }

            if (draggedIsCommon && overIsParent && draggedRowData.position < overRowData.position) {
                // The dragged row needs to update to be set as parent false and parentRowId of over row

                const relAdjustedRow = repositionedRows.map((row: any) => {
                    if (row.position === overRowData.position) {
                        updateRowNoTag({ ...row, isParent: false, parentRowId: overRowData._id, isVisible: overRowData.showSubrows });
                        return { ...row, isParent: false, parentRowId: overRowData._id, isVisible: overRowData.showSubrows };
                    }
                    return row;
                });

                setRows(relAdjustedRow);

                setCurrentRows(relAdjustedRow);
            }

            if (draggedIsCommon && overIsChild) {
                // The dragged row needs to update to be set as parent false and share the parentRowId of the over row
                console.log('Common into child');
                const relAdjustedRows = repositionedRows.map((row: any) => {
                    if (row.position === overRowData.position) {
                        console.log(row);
                        updateRowNoTag({ ...row, isParent: false, parentRowId: overRowData.parentRowId });
                        return { ...row, isParent: false, parentRowId: overRowData.parentRowId };
                    }
                    return row;
                });

                setRows(relAdjustedRows);

                setCurrentRows(relAdjustedRows);
            }

            if (draggedIsChild && overIsCommon) {
                // The dragged row needs to update to be set as parent false and parentRowId as null
                // console.log('Child into common');
                const relAdjustedRows = repositionedRows.map((row: any) => {
                    if (row.position === overRowData.position) {
                        console.log(row);
                        updateRowNoTag({ ...row, isParent: false, parentRowId: null });
                        return { ...row, isParent: false, parentRowId: null };
                    }
                    return row;
                });

                setRows(relAdjustedRows);

                setCurrentRows(relAdjustedRows);
            }

            if (draggedIsChild && overIsParent) {
                if (draggedRowData.position < overRowData.position) {
                    // The dragged row needs to update to be set as parent false and parentRowId of over row

                    const relAdjustedRows = repositionedRows.map((row: any) => {
                        if (row.position === overRowData.position) {
                            updateRowNoTag({ ...row, isParent: false, parentRowId: overRowData._id });
                            return { ...row, isParent: false, parentRowId: overRowData._id };
                        }
                        return row;
                    });

                    setRows(relAdjustedRows);

                    setCurrentRows(relAdjustedRows);
                } else {
                    // The dragged row needs to update to be set as parent false and parentRowId as null

                    const relAdjustedRows = repositionedRows.map((row: any) => {
                        if (row.position === overRowData.position) {
                            updateRowNoTag({ ...row, isParent: false, parentRowId: null });
                            return { ...row, isParent: false, parentRowId: null };
                        }
                        return row;
                    });

                    setRows(relAdjustedRows);

                    setCurrentRows(relAdjustedRows);
                }
            }
        }

        setOverId(null);
        setDraggedId(null);
        localStorage.setItem('dragging', '');
    };

    const handleChange = (row: any) => {
        // handleUpdateRow(row);

        // setCurrentRows((prev) => prev.map((prevRow) => (prevRow._id === row._id ? row : prevRow)));
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
                                            rowCallUpdate={rowCallUpdate}
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
