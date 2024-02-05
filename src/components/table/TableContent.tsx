import { Box } from '@chakra-ui/react';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { ViewportList } from 'react-viewport-list';
import Row from './Row';

interface IProps {
    rows: any[];
    columns: any[];
    setRows: any;
    gridTemplateColumnsIn: string;
    minCellWidth: number;
    columnResizingOffset: number;
    updateColumn: any;
    reorderColumns: any;
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
    minCellWidth,
    columnResizingOffset,
    updateColumn,
    reorderColumns,
    handleUpdateRowNoRender,
    handleUpdateRow,
    handleDeleteBoxChange,
    handleReorderRows,
    rowCallUpdate,
}: IProps) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [gridTemplateColumns, setGridTemplateColumns] = useState('');

    const [currentRows, setCurrentRows] = useState(rows);

    const [deleteCheckboxStatusList, setDeleteCheckboxStatusList] = useState(
        Array(rows.length)
            .fill(null)
            .map(() => false)
    );
    const [numberOfDeleteItems, setNumberOfDeleteItems] = useState(0);

    useEffect(() => {
        setCurrentRows(rows);
    }, [rows]);

    useEffect(() => {
        setGridTemplateColumns(gridTemplateColumnsIn);
    }, [gridTemplateColumnsIn]);

    const [overId, setOverId] = useState<number | null>(null);
    const [draggedId, setDraggedId] = useState<number | null>(null);

    const handleDragStart = useCallback(
        (event: React.DragEvent<HTMLDivElement>, rowIndex: number) => {
            setDraggedId(rowIndex);
            const reorderHandle: any = document.getElementById(`reorder-handle-${rowIndex}`);
            reorderHandle.style.cursor = 'move';
            // setRows((prev) => prev.filter((_, index) => index !== rowIndex));
        },
        [draggedId]
    );

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

    const handleDragOver = useCallback(
        (event: React.DragEvent<HTMLDivElement>, rowIndex: number) => {
            console.log(draggedId !== null);
            event.preventDefault();
            event.stopPropagation();
            if (draggedId !== null) {
                event.preventDefault();
                event.stopPropagation();

                // const tableRowContainer: any = document.getElementById(`table-row-container-${rowIndex}`);
                // tableRowContainer.style.backgroundColor = '#85bcff';

                // const dropIndicator = document.getElementById(`drop-indicator-${rowIndex}`);

                setOverId(rowIndex);
            }

            // }
        },
        [overId, draggedId]
    );

    const handleDragEnd = useCallback(
        (event: any) => {
            console.log({ draggedId, overId });
            const newRows = [...currentRows];
            const [draggedRow] = newRows.splice(draggedId as number, 1);
            console.log({ draggedRow });

            // if ((draggedId as number) >= (overId as number)) {
            newRows.splice(overId as number, 0, draggedRow);
            // } else {
            //   newRows.splice((overId as number) - 1, 0, draggedRow);
            // }

            setCurrentRows(newRows);

            setOverId(null);
            setDraggedId(null);
        },
        [overId, setOverId]
    );

    const [subrowDrawers, setSubrowDrawers] = useState<boolean[]>([]);

    useEffect(() => {
        setSubrowDrawers(
            Array(rows.length)
                .fill(null)
                .map((_) => false)
        );
    }, [rows]);

    //****************************************************** */
    const handleSetDraggedId = useCallback(
        (rowIndex: number) => {
            console.log(rowIndex);
            setDraggedId(rowIndex);
        },
        [draggedId]
    );

    const handleSetOverId = useCallback(
        (rowIndex: number | null) => {
            console.log({ rowIndex });
            setOverId(rowIndex);
        },
        [overId]
    );

    const handleSwap = useCallback(() => {
        console.log({ overId, draggedId });
        const newRows = [...currentRows];
        const [draggedRow] = newRows.splice(draggedId as number, 1);
        newRows.splice(overId as number, 0, draggedRow);

        setCurrentRows(newRows);
        setRows(newRows);

        const rowIds = newRows.map((newRow) => newRow._id);

        handleReorderRows({ draggedRowPosition: draggedId, overRowPosition: overId });

        setOverId(null);
        setDraggedId(null);
    }, [overId, draggedId]);

    const handleChange = useCallback(
        (row: any) => {
            console.log(row);
            handleUpdateRow(row);
            handleUpdateRowNoRender(row);
            setCurrentRows((prev) => prev.map((prevRow) => (prevRow._id === row._id ? row : prevRow)));
        },
        [currentRows]
    );

    const handleDeleteBoxChangeForRow = useCallback(
        (status: boolean, index: number) => {
            console.log(currentRows);
            // setCurrentRows((prevRows) => prevRows.map((prevRow, rowIndex) => (index === rowIndex ? { ...prevRow, markedForDeletion: status } : prevRow)));
            // if (status) {
            //     setNumberOfDeleteItems(numberOfDeleteItems + 1);
            // } else {
            //     setNumberOfDeleteItems(numberOfDeleteItems - 1);
            // }

            // Allows Table component to set
            handleDeleteBoxChange(status, index);
            setRows(currentRows.map((prevRow, rowIndex) => (index === rowIndex ? { ...prevRow, markedForDeletion: status } : prevRow)));
        },
        [currentRows]
    );

    const [show, setShow] = useState(true);
    return (
        <div
            className="table-content scroll-container"
            ref={ref}
            onDragEnter={(event: React.DragEvent<HTMLDivElement>) => handleDragEnter(event)}
            onDragLeave={(event: React.DragEvent<HTMLDivElement>) => handleDragLeave(event)}
            onScroll={(event: React.UIEvent<HTMLDivElement, UIEvent>) => {
                if (show) {
                    setShow(false);
                }

                setShow(true);
            }}
        >
            {show ? (
                <ViewportList viewportRef={ref} items={currentRows} overscan={25}>
                    {(row, rowIndex) => (
                        <div key={row._id} className="item">
                            <div key={row._id}>
                                <div
                                    className="drop-indicator-container"
                                    onDragOver={(event: React.DragEvent<HTMLDivElement>) => handleDragOver(event, rowIndex)}
                                >
                                    <Box
                                        id={`drop-indicator-${rowIndex}`}
                                        className="drop-indicator"
                                        style={{
                                            visibility: overId !== null && overId === rowIndex ? 'visible' : 'hidden',
                                            bottom:
                                                draggedId !== null && overId === 0 && draggedId >= rowIndex
                                                    ? '-4px'
                                                    : draggedId !== null && overId === rowIndex && draggedId < rowIndex
                                                    ? '-29px'
                                                    : '0px',
                                        }}
                                    ></Box>
                                </div>
                                <Row
                                    row={row}
                                    rowIndex={rowIndex}
                                    columns={columns}
                                    gridTemplateColumns={gridTemplateColumns}
                                    handleSetDraggedId={handleSetDraggedId}
                                    handleSetOverId={handleSetOverId}
                                    handleSwap={handleSwap}
                                    handleChange={handleChange}
                                    deleteBoxIsChecked={deleteCheckboxStatusList[rowIndex]}
                                    handleDeleteBoxChange={handleDeleteBoxChangeForRow}
                                    rowCallUpdate={rowCallUpdate}
                                />
                            </div>
                            <div></div>
                        </div>
                    )}
                </ViewportList>
            ) : null}
        </div>
    );
};

export default memo(TableContent);
// Start marker
