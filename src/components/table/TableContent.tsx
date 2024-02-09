import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { ViewportList } from 'react-viewport-list';
import Row from './Row';
import { swapItems } from '../../utils/helpers';

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
            console.log(draggedId);
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

    const handleSwap = useCallback(
        (overId: number, draggedId: number) => {
            console.log({ rowDragged: Number(localStorage.getItem('rowDragged')), rowOver: Number(localStorage.getItem('rowOver')) });
            console.log({ overId, draggedId, currentRows });

            const newRows = [...currentRows];
            const draggedRowData = newRows[Number(localStorage.getItem('rowDragged'))];
            const overRowData = newRows[Number(localStorage.getItem('rowOver'))];
            const isParent = draggedRowData.isParent;
            const overIsChild = overRowData.parentRowId !== null;

            console.log(isParent && overIsChild);

            const childRows = newRows.filter((row) => {
                return isParent && row.parentRowId === draggedRowData._id;
            });

            const reorderedRows = swapItems(newRows, Number(localStorage.getItem('rowDragged')), Number(localStorage.getItem('rowOver')), childRows.length + 1);

            if (isParent) {
                setCurrentRows(reorderedRows);
                setRows(reorderedRows);
            } else {
                let currentParentId: any;

                setCurrentRows(
                    reorderedRows.map((row: any, index: number) => {
                        console.log(row);
                        if (index === Number(localStorage.getItem('rowOver'))) {
                            let result = { ...row, parentRowId: currentParentId };
                            currentParentId = null;
                            handleUpdateRow(result);
                            return result;
                        }

                        if (row.isParent && row.parentRowId === null) {
                            currentParentId = row._id;
                        } else {
                            currentParentId = null;
                        }
                        return row;
                    })
                );

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
            }

            // handleReorderRows({
            //     draggedRowPosition: Number(localStorage.getItem('rowDragged')),
            //     overRowPosition: Number(localStorage.getItem('rowOver')),
            //     numberOfItems: childRows.length + 1,
            // });
            // handleReorderRows({ draggedRowPosition: Number(localStorage.getItem('rowDragged')), overRowPosition: Number(localStorage.getItem('rowOver')) });

            setOverId(null);
            setDraggedId(null);
        },
        [overId, draggedId, currentRows]
    );

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
