import { Box } from '@chakra-ui/react';
import React, { memo, useCallback, useEffect, useState } from 'react';

const SubRowsContent = ({ rows, columns, gridTemplateColumns, opened }: { rows: any[]; columns: any[]; gridTemplateColumns: string; opened: boolean }) => {
    // console.log({ rows, columns, gridTemplateColumns, opened });

    const [overId, setOverId] = useState<number | null>(null);
    const [draggedId, setDraggedId] = useState<number | null>(null);

    useEffect(() => {
        const row = document.getElementsByClassName('table-row')[0];
        const gtcs = getComputedStyle(row).getPropertyValue('grid-template-columns');

        const columnWidths: any = gtcs.split(' ');
        columnWidths.shift();

        const fullWidths = '210px ' + columnWidths.join(' ');

        const subTableRows: any = document.getElementsByClassName('table-row subrow');
        for (const tableRow of subTableRows) {
            tableRow.style.gridTemplateColumns = fullWidths;
        }
    }, [opened]);

    const handleDragStart = useCallback(
        (event: React.DragEvent<HTMLDivElement>, rowIndex: number) => {
            setDraggedId(rowIndex);
            const reorderHandle: any = document.getElementById(`reorder-handle-${rowIndex}`);
            reorderHandle.style.cursor = 'move';
            // setRows((prev) => prev.filter((_, index) => index !== rowIndex));
        },
        [draggedId]
    );

    const handleDragEnter = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        // if (draggedId !== null) {
        event.preventDefault();
        event.stopPropagation();
        // }
    }, []);
    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleDragOver = useCallback(
        (event: React.DragEvent<HTMLDivElement>, rowIndex: number) => {
            console.log(draggedId !== null);
            if (draggedId !== null) {
                event.preventDefault();
                event.stopPropagation();

                setOverId(rowIndex);
            }
        },
        [overId, draggedId]
    );

    const handleDragEnd = useCallback(
        (event: any) => {
            console.log({ draggedId, overId });
            const newRows = [...rows];
            const [draggedRow] = newRows.splice(draggedId as number, 1);
            newRows.splice(overId as number, 0, draggedRow);

            setOverId(null);
            setDraggedId(null);
        },
        [overId, setOverId]
    );
    return (
        <>
            {opened ? (
                <div style={{ border: '1px solid #edf2f7', padding: '16px 10px', backgroundColor: '#f3f7fc' }}>
                    {rows.map((subrow: any, rowIndex) => {
                        console.log(gridTemplateColumns);
                        return (
                            <div
                                key={rowIndex}
                                id={`table-row-container-${rowIndex}`}
                                className="table-row-container"
                                style={{
                                    backgroundColor: draggedId === rowIndex ? '#85bcff' : 'white',
                                    borderTop: '1px solid #edf2f7',
                                }}
                            >
                                <div
                                    className="drop-indicator-container"
                                    onDragOver={(event: React.DragEvent<HTMLDivElement>) => handleDragOver(event, rowIndex)}
                                >
                                    <div
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
                                    ></div>
                                </div>
                                <div
                                    className="table-row content subrow"
                                    style={{
                                        gridTemplateColumns: '210px ' + gridTemplateColumns + ' 100px',
                                    }}
                                    onDragOver={(event: React.DragEvent<HTMLDivElement>) => handleDragOver(event, rowIndex)}
                                >
                                    <span>
                                        <Box
                                            id={`reorder-handle-${rowIndex}`}
                                            w={'15px'}
                                            h={'30px'}
                                            bgColor={'#2d82eb'}
                                            cursor={'move'}
                                            draggable
                                            onDragStart={(event: React.DragEvent<HTMLDivElement>) => handleDragStart(event, rowIndex)}
                                            onDragOver={(event: React.DragEvent<HTMLDivElement>) => handleDragOver(event, rowIndex)}
                                            onDragEnd={(event: React.DragEvent<HTMLDivElement>) => handleDragEnd(event)}
                                            onDragEnter={(event: React.DragEvent<HTMLDivElement>) => handleDragEnter(event)}
                                            onDragLeave={(event: React.DragEvent<HTMLDivElement>) => handleDragLeave(event)}
                                        ></Box>
                                    </span>
                                    {columns.map((column, columnIndex) => {
                                        return (
                                            <span
                                                key={columnIndex}
                                                style={{
                                                    overflow: 'hidden',
                                                    whiteSpace: 'nowrap',
                                                    textOverflow: 'ellipsis',
                                                    fontSize: '14px',
                                                    paddingTop: '4px',
                                                    paddingLeft: '10px',
                                                    paddingRight: '10px',
                                                }}
                                            >
                                                {subrow.values[column.name]}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : null}
        </>
    );
};

export default memo(SubRowsContent);
