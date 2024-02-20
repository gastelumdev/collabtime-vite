import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { ViewportList } from 'react-viewport-list';
import Row from './Row';
import { swapItems } from '../../utils/helpers';
import { useUpdateRowMutation } from '../../app/services/api';

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
    handleUpdateRow: any;
    handleDeleteBoxChange: any;
    handleReorderRows: any;
    rowCallUpdate: any;
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
    handleUpdateRow,
    handleDeleteBoxChange,
    rowCallUpdate,
}: IProps) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [gridTemplateColumns, setGridTemplateColumns] = useState('');

    const [currentRows, setCurrentRows] = useState(rows);

    const [updateRow] = useUpdateRowMutation();

    // const [deleteCheckboxStatusList, setDeleteCheckboxStatusList] = useState(
    //     Array(rows.length)
    //         .fill(null)
    //         .map(() => false)
    // );
    // const [numberOfDeleteItems, setNumberOfDeleteItems] = useState(0);

    useEffect(() => {
        console.log(rows);
        setCurrentRows(rows);
    }, [rows]);

    useEffect(() => {
        setGridTemplateColumns(gridTemplateColumnsIn);
    }, [gridTemplateColumnsIn]);

    const [overId, setOverId] = useState<number | null>(null);
    const [draggedId, setDraggedId] = useState<number | null>(null);

    // const handleDragStart = useCallback(
    //     (event: React.DragEvent<HTMLDivElement>, rowIndex: number) => {
    //         setDraggedId(rowIndex);
    //         const reorderHandle: any = document.getElementById(`reorder-handle-${rowIndex}`);
    //         reorderHandle.style.cursor = 'move';
    //         // setRows((prev) => prev.filter((_, index) => index !== rowIndex));
    //     },
    //     [draggedId]
    // );

    const handleDragEnter = useCallback(
        (event: React.DragEvent<HTMLDivElement>) => {
            console.log(draggedId, overId);
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

    // const handleDragOver = useCallback(
    //     (event: React.DragEvent<HTMLDivElement>, rowIndex: number) => {
    //         console.log(draggedId !== null);
    //         event.preventDefault();
    //         event.stopPropagation();
    //         if (draggedId !== null) {
    //             event.preventDefault();
    //             event.stopPropagation();

    //             // const tableRowContainer: any = document.getElementById(`table-row-container-${rowIndex}`);
    //             // tableRowContainer.style.backgroundColor = '#85bcff';

    //             // const dropIndicator = document.getElementById(`drop-indicator-${rowIndex}`);

    //             setOverId(rowIndex);
    //         }

    //         // }
    //     },
    //     [overId, draggedId]
    // );

    // const handleDragEnd = useCallback(
    //     (event: any) => {
    //         console.log({ draggedId, overId });
    //         const newRows = [...currentRows];
    //         const [draggedRow] = newRows.splice(draggedId as number, 1);
    //         console.log({ draggedRow });

    //         // if ((draggedId as number) >= (overId as number)) {
    //         newRows.splice(overId as number, 0, draggedRow);
    //         // } else {
    //         //   newRows.splice((overId as number) - 1, 0, draggedRow);
    //         // }

    //         setCurrentRows(newRows);

    //         setOverId(null);
    //         setDraggedId(null);
    //     },
    //     [overId, setOverId]
    // );

    // const [subrowDrawers, setSubrowDrawers] = useState<boolean[]>([]);

    // useEffect(() => {
    //     setSubrowDrawers(
    //         Array(rows.length)
    //             .fill(null)
    //             .map((_) => false)
    //     );
    // }, [rows]);

    //****************************************************** */
    const handleSetDraggedId = useCallback((rowIndex: number) => {
        console.log(rowIndex);
        setDraggedId(rowIndex);
    }, []);

    const handleSetOverId = useCallback((rowIndex: number | null) => {
        console.log({ rowIndex });
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

        console.log({ list, range });

        // let index = range[0];

        const newRows = list.map((row: any, index: number) => {
            console.log({ rowPosition: row.position, value: row.values['item_name'], index });
            const updatedRow = { ...row, position: index + 1 };

            // console.log(updatedRow);
            console.log({ index, position: updatedRow.position });
            // handleUpdateRow(updatedRow);

            if (row.position !== index + 1) {
                updateRow(updatedRow);
            }
            return updatedRow;
        });
        return newRows;
    };

    const handleSwap = (overId: number, draggedId: number) => {
        console.log({ rowDragged: Number(localStorage.getItem('rowDragged')), rowOver: Number(localStorage.getItem('rowOver')) });
        console.log({ overId, draggedId, currentRows });
        const newRows: any = currentRows;
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

        console.log(childRows);

        let reorderedRows;

        if ((draggedIsParent && overIsChild) || (draggedIsParent && overIsParent)) {
            console.log('This drag and drop is not allowed!');
            setCurrentRows([...newRows]);
        } else {
            console.log('This drag and drop is allowed!');
            reorderedRows = swapItems(newRows, Number(localStorage.getItem('rowDragged')), Number(localStorage.getItem('rowOver')), childRows.length + 1);
            setRows(reorderedRows);
            setCurrentRows(reorderedRows);
            console.log(reorderedRows);

            const repositionedRows: any = setPositions(
                reorderedRows,
                // currentRows,
                Number(localStorage.getItem('rowDragged')),
                Number(localStorage.getItem('rowOver')),
                childRows.length
            );

            // setCurrentRows(repositionedRows);

            if ((draggedIsParent && overIsCommon) || (draggedIsCommon && overIsCommon)) {
                console.log(`${draggedRowData.position} is dragged over common row ${overRowData.position}`);
                setRows(repositionedRows);
                setCurrentRows(repositionedRows);
            }

            if (draggedIsCommon && overIsParent && draggedRowData.position < overRowData.position) {
                console.log(`${draggedRowData.position} will become a child of the parent row ${overRowData.position}`);
                // The dragged row needs to update to be set as parent false and parentRowId of over row

                const relAdjustedRow = repositionedRows.map((row: any) => {
                    if (row.position === overRowData.position) {
                        updateRow({ ...row, isParent: false, parentRowId: overRowData._id });
                        return { ...row, isParent: false, parentRowId: overRowData._id, checked: false };
                    }
                    return row;
                });

                setRows(relAdjustedRow);

                setCurrentRows(relAdjustedRow);
            }

            if (draggedIsCommon && overIsChild) {
                console.log(`${draggedRowData.position} will become a sibling of the child row ${overRowData.position}`);
                // The dragged row needs to update to be set as parent false and share the parentRowId of the over row

                const relAdjustedRows = repositionedRows.map((row: any) => {
                    if (row.position === overRowData.position) {
                        updateRow({ ...row, isParent: false, parentRowId: overRowData.parentRowId });
                        return { ...row, isParent: false, parentRowId: overRowData.parentRowId };
                    }
                    return row;
                });

                setRows(relAdjustedRows);

                setCurrentRows(relAdjustedRows);
            }

            if (draggedIsChild && overIsCommon) {
                console.log(`${draggedRowData.position} will become common row over ${overRowData.position}`);
                // The dragged row needs to update to be set as parent false and parentRowId as null

                const relAdjustedRows = repositionedRows.map((row: any) => {
                    if (row.position === overRowData.position) {
                        updateRow({ ...row, isParent: false, parentRowId: null });
                        return { ...row, isParent: false, parentRowId: null };
                    }
                    return row;
                });

                setRows(relAdjustedRows);

                setCurrentRows(relAdjustedRows);
            }

            if (draggedIsChild && overIsParent) {
                if (draggedRowData.position < overRowData.position) {
                    console.log(`${draggedRowData.position} will become a child of the parent row ${overRowData.position}`);
                    // The dragged row needs to update to be set as parent false and parentRowId of over row

                    const relAdjustedRows = repositionedRows.map((row: any) => {
                        if (row.position === overRowData.position) {
                            updateRow({ ...row, isParent: false, parentRowId: overRowData._id });
                            return { ...row, isParent: false, parentRowId: overRowData._id };
                        }
                        return row;
                    });

                    setRows(relAdjustedRows);

                    setCurrentRows(relAdjustedRows);
                } else {
                    console.log(`${draggedRowData.position} will become common row over ${overRowData.position}`);
                    // The dragged row needs to update to be set as parent false and parentRowId as null

                    const relAdjustedRows = repositionedRows.map((row: any) => {
                        if (row.position === overRowData.position) {
                            updateRow({ ...row, isParent: false, parentRowId: null });
                            return { ...row, isParent: false, parentRowId: null };
                        }
                        return row;
                    });

                    setRows(relAdjustedRows);

                    setCurrentRows(relAdjustedRows);
                }
            }
        }

        // if (!(draggedIsParent && overIsChild) || !(draggedIsParent && overIsParent)) {
        //     console.log(`${draggedRowData.position} was dropped over not child ${overRowData.position}`);
        // reorderedRows = swapItems(newRows, Number(localStorage.getItem('rowDragged')), Number(localStorage.getItem('rowOver')), childRows.length + 1);

        // const repositionedRows: any = setPositions(
        //     reorderedRows,
        //     Number(localStorage.getItem('rowDragged')),
        //     Number(localStorage.getItem('rowOver')),
        //     childRows.length
        // );

        // if (draggedIsParent) {
        //     setCurrentRows(reorderedRows);
        //     setRows(reorderedRows);
        // } else {
        //     let currentParentId: any;
        //     setCurrentRows(
        //         repositionedRows.map((row: any, index: number) => {
        //             // console.log(index, row.position);
        //             // if the current row is the drop location then update wether it has a parent
        //             if (index === Number(localStorage.getItem('rowOver'))) {
        //                 let result = { ...row, parentRowId: currentParentId };
        //                 currentParentId = null;
        //                 // handleUpdateRow(result);
        //                 return result;
        //             }

        //             // if the row is a parent then set then set its id for the next iteration
        //             if (row.isParent) {
        //                 currentParentId = row._id;
        //             } else {
        //                 if (row.parentRowId !== null) {
        //                     currentParentId = row.parentRowId;
        //                 } else {
        //                     currentParentId = null;
        //                 }
        //             }

        //             return row;
        //         })
        //     );

        // setRows(
        //     reorderedRows.map((row: any, index: number) => {
        //         if (index === Number(localStorage.getItem('rowOver'))) {
        //             let result = { ...row, parentRowId: currentParentId };
        //             currentParentId = null;
        //             // handleUpdateRow(result);
        //             return result;
        //         }

        //         if (row.isParent && row.parentRowId === null) {
        //             currentParentId = row._id;
        //         } else {
        //             currentParentId = null;
        //         }

        //         return row;
        //     })
        // );
        // }
        // } else {
        // console.log(`${draggedRowData.position} is a parent and was dragged over subrow ${overRowData.position} `);
        // setCurrentRows(newRows);
        // setRows(newRows);
        // }

        // handleReorderRows({
        //     draggedRowPosition: Number(localStorage.getItem('rowDragged')),
        //     overRowPosition: Number(localStorage.getItem('rowOver')),
        //     numberOfItems: childRows.length + 1,
        // });
        // handleReorderRows({ draggedRowPosition: Number(localStorage.getItem('rowDragged')), overRowPosition: Number(localStorage.getItem('rowOver')) });

        setOverId(null);
        setDraggedId(null);
        localStorage.setItem('dragging', '');
        // localStorage.setItem('rowDragged', '');
        // localStorage.setItem('rowOver', '');
    };

    const handleChange = (row: any) => {
        console.log(row);
        handleUpdateRow(row);
        handleUpdateRowNoRender(row);
        setCurrentRows((prev) => prev.map((prevRow) => (prevRow._id === row._id ? row : prevRow)));
    };

    const handleDeleteBoxChangeForRow = (status: boolean, index: number) => {
        console.log(currentRows);
        // setCurrentRows((prevRows) => prevRows.map((prevRow, rowIndex) => (index === rowIndex ? { ...prevRow, checked: status } : prevRow)));
        // if (status) {
        //     setNumberOfDeleteItems(numberOfDeleteItems + 1);
        // } else {
        //     setNumberOfDeleteItems(numberOfDeleteItems - 1);
        // }

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
            {/* {currentRows.map((row, rowIndex) => (
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
                            rowCallUpdate={rowCallUpdate}
                        />
                    </div>
                    <div></div>
                </div>
            ))} */}
            <ViewportList viewportRef={ref} items={currentRows} overscan={25}>
                {(row, rowIndex) => (
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
                                rowCallUpdate={rowCallUpdate}
                            />
                        </div>
                        <div></div>
                    </div>
                )}
            </ViewportList>
        </div>
    );
};

export default memo(TableContent);
// Start marker
