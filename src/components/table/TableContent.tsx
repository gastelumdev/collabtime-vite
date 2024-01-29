import { Box, Button, Flex, Text } from '@chakra-ui/react';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import LabelMenu from '../../features/dataCollections/LabelMenu';

interface IProps {
    rows: any[];
    columns: any[];
    setRows: any;
    gridTemplateColumnsIn: string;
    minCellWidth: number;
    columnResizingOffset: number;
    updateColumn: any;
    reorderColumns: any;
}

const SubRowsContent = memo(({ rows, columns, gridTemplateColumns, opened }: { rows: any[]; columns: any[]; gridTemplateColumns: string; opened: boolean }) => {
    // console.log({ rows, columns, gridTemplateColumns, opened });

    const [overId, setOverId] = useState<number | null>(null);
    const [draggedId, setDraggedId] = useState<number | null>(null);

    useEffect(() => {
        const row = document.getElementsByClassName('table-row')[0];
        const gtcs = getComputedStyle(row).getPropertyValue('grid-template-columns');

        const columnWidths: any = gtcs.split(' ');
        columnWidths.shift();

        const fullWidths = '170px ' + columnWidths.join(' ');

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
                <div style={{ border: '1px solid lightgray', padding: '16px 10px', backgroundColor: '#f3f7fc' }}>
                    {rows.map((subrow: any, rowIndex) => {
                        console.log(gridTemplateColumns);
                        return (
                            <div
                                key={rowIndex}
                                id={`table-row-container-${rowIndex}`}
                                className="table-row-container"
                                style={{
                                    backgroundColor: draggedId === rowIndex ? '#85bcff' : 'white',
                                    borderTop: '1px solid lightgray',
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
                                        gridTemplateColumns: gridTemplateColumns,
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
});

const Row = memo(
    ({
        row,
        rowIndex,
        columns,
        // draggedId,
        // overId,
        gridTemplateColumns,
        // handleDragOver,
        // handleDragStart,
        // handleDragEnd,
        // handleDragEnter,
        // handleDragLeave,
        handleSetDraggedId,
        handleSetOverId,
        handleSwap,
    }: {
        row: any;
        rowIndex: number;
        columns: any;
        // draggedId: number | null;
        // overId: number | null;
        gridTemplateColumns: string;
        // handleDragOver: any;
        // handleDragStart: any;
        // handleDragEnd: any;
        // handleDragEnter: any;
        // handleDragLeave: any;
        handleSetDraggedId: any;
        handleSetOverId: any;
        handleSwap: any;
    }) => {
        const rowsData = useMemo(
            () => [
                { _id: '12345', values: { assigned_to: 'Omar', task: 'Task 1', status: 'Done', priority: 'Low', due_date: 'tomorrow' } },
                { _id: '12346', values: { assigned_to: 'Omar', task: 'Task 2', status: 'Done', priority: 'Low', due_date: 'tomorrow' } },
                { _id: '12347', values: { assigned_to: 'Omar', task: 'Task 3', status: 'Done', priority: 'Low', due_date: 'tomorrow' } },
            ],
            []
        );

        const [overId, setOverId] = useState<number | null>(null);
        const [draggedId, setDraggedId] = useState<number | null>(null);

        let tableContent = true;

        const handleDragStart = useCallback(
            (event: React.DragEvent<HTMLDivElement>, rowIndex: number) => {
                localStorage.setItem('rowDragged', `${rowIndex}`);
                handleSetDraggedId(rowIndex);
                setDraggedId(rowIndex);
                // const reorderHandle: any = document.getElementById(`reorder-handle-${rowIndex}`);
                // reorderHandle.style.cursor = 'move';
                // setRows((prev) => prev.filter((_, index) => index !== rowIndex));
            },
            [draggedId, setDraggedId, handleSetDraggedId]
        );

        const handleDragEnter = useCallback(
            (event: React.DragEvent<HTMLDivElement>) => {
                // console.log(draggedId);
                // if (draggedId !== null) {
                event.preventDefault();
                event.stopPropagation();
                // }
            },
            [draggedId]
        );

        const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            event.stopPropagation();

            // setOver(false);
        }, []);

        const handleDragOver = useCallback(
            (event: React.DragEvent<HTMLDivElement>, rowIndex: number) => {
                console.log(localStorage.getItem('rowDragged'));
                if (localStorage.getItem('rowDragged') !== null) {
                    event.preventDefault();
                    event.stopPropagation();

                    handleSetOverId(rowIndex);
                    setOverId(rowIndex);
                }
            },
            [handleSetOverId, draggedId]
        );

        const handleDragEnd = useCallback(
            (event: any) => {
                // const newRows = [...rows];
                // const [draggedRow] = newRows.splice(draggedId as number, 1);
                // newRows.splice(overId as number, 0, draggedRow);

                // setRows(newRows);

                // setOverId(null);
                // setDraggedId(null);
                setDraggedId(null);
                handleSetOverId(null);
                handleSwap();
                localStorage.removeItem('rowDragged');
            },
            [handleSwap, overId, draggedId]
        );

        const [opened, setOpened] = useState<boolean>(false);
        return (
            <Box key={rowIndex}>
                <>{console.log('ROW RENDERED')}</>
                <Box
                    key={rowIndex}
                    id={`table-row-container-${rowIndex}`}
                    className="table-row-container"
                    style={{
                        // backgroundColor: draggedId === rowIndex ? '#85bcff' : 'white',
                        borderTop: '1px solid lightgray',
                        // height: draggedId !== null && overId === rowIndex && draggedId >= rowIndex ? '26px' : '29px',
                    }}
                >
                    <div
                        className="table-row content"
                        style={{
                            gridTemplateColumns: '180px ' + gridTemplateColumns,
                        }}
                        onDragStart={(event: React.DragEvent<HTMLDivElement>) => handleDragStart(event, rowIndex)}
                        onDragOver={(event: React.DragEvent<HTMLDivElement>) => handleDragOver(event, rowIndex)}
                        onDragEnd={(event: React.DragEvent<HTMLDivElement>) => handleDragEnd(event)}
                        onDragEnter={(event: React.DragEvent<HTMLDivElement>) => handleDragEnter(event)}
                        onDragLeave={(event: React.DragEvent<HTMLDivElement>) => handleDragLeave(event)}
                    >
                        <span>
                            <Flex>
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
                                <Button
                                    variant={'unstyled'}
                                    h={'20px'}
                                    onClick={() => {
                                        console.log('BUTTON CLICKED on INDEX', rowIndex);
                                        // setSubrowDrawers((prev) => prev.map((state, index) => (index === rowIndex ? !state : state)));
                                        setOpened(!opened);
                                    }}
                                >
                                    <Text>{opened ? <ChevronDownIcon /> : <ChevronRightIcon />}</Text>
                                </Button>
                                <Button
                                    variant={'unstyled'}
                                    h={'20px'}
                                    onClick={() => {
                                        console.log('BUTTON CLICKED on INDEX', rowIndex);
                                        // setSubrowDrawers((prev) => prev.map((state, index) => (index === rowIndex ? !state : state)));
                                        setOpened(!opened);
                                    }}
                                >
                                    <Text>{opened ? <ChevronDownIcon /> : <ChevronRightIcon />}</Text>
                                </Button>
                                <Button
                                    variant={'unstyled'}
                                    h={'20px'}
                                    onClick={() => {
                                        console.log('BUTTON CLICKED on INDEX', rowIndex);
                                        // setSubrowDrawers((prev) => prev.map((state, index) => (index === rowIndex ? !state : state)));
                                        setOpened(!opened);
                                    }}
                                >
                                    <Text>{opened ? <ChevronDownIcon /> : <ChevronRightIcon />}</Text>
                                </Button>
                                <Button
                                    variant={'unstyled'}
                                    h={'20px'}
                                    onClick={() => {
                                        console.log('BUTTON CLICKED on INDEX', rowIndex);
                                        // setSubrowDrawers((prev) => prev.map((state, index) => (index === rowIndex ? !state : state)));
                                        setOpened(!opened);
                                    }}
                                >
                                    <Text>{opened ? <ChevronDownIcon /> : <ChevronRightIcon />}</Text>
                                </Button>
                            </Flex>
                        </span>
                        {columns.map((column: any, columnIndex: number) => {
                            return (
                                <div
                                    key={columnIndex}
                                    className={'cell'}
                                    style={{
                                        whiteSpace: 'nowrap',
                                        fontSize: '12px',
                                    }}
                                >
                                    {column.type === 'label' || column.type === 'priority' || column.type === 'status' ? (
                                        <LabelMenu
                                            id={rowIndex}
                                            labels={column.labels}
                                            columnName={column.name}
                                            value={row.values[column.name]}
                                            onChange={() => {}}
                                        />
                                    ) : (
                                        <Text overflow={'hidden'} textOverflow={'ellipsis'}>
                                            {row.values[column.name]}
                                        </Text>
                                    )}
                                    {/* {row.values[column.name]} */}
                                </div>
                            );
                        })}
                    </div>
                </Box>
                <SubRowsContent rows={rowsData} columns={columns} gridTemplateColumns={'170px ' + gridTemplateColumns} opened={opened} />
            </Box>
        );
    },
    (prevProps, nextProps) => {
        const {
            row: prevrow,
            rowIndex: prevrowIndex,
            columns: prevcolumns,
            gridTemplateColumns: prevgridTemplateColumns,
            handleSetDraggedId: prevhandleSetDraggedId,
            handleSetOverId: prevhandleSetOverId,
            handleSwap: prevhandleSwap,
        } = prevProps;
        const {
            row: nextrow,
            rowIndex: nextrowIndex,
            columns: nextcolumns,
            gridTemplateColumns: nextgridTemplateColumns,
            handleSetDraggedId: nexthandleSetDraggedId,
            handleSetOverId: nexthandleSetOverId,
            handleSwap: nexthandleSwap,
        } = nextProps;

        console.log({ prevrow, prevrowIndex, prevcolumns, prevgridTemplateColumns, prevhandleSetDraggedId, prevhandleSetOverId, prevhandleSwap });
        console.log({ nextrow, nextrowIndex, nextcolumns, nextgridTemplateColumns, nexthandleSetDraggedId, nexthandleSetOverId, nexthandleSwap });

        console.log({ row: prevrow === nextrow, rowIndex: prevrowIndex === nextrowIndex, columns: prevcolumns === nextcolumns });

        return prevProps === nextProps;
    }
);

const TableContent = ({ rows, columns, setRows, gridTemplateColumnsIn, minCellWidth, columnResizingOffset, updateColumn, reorderColumns }: IProps) => {
    const [gridTemplateColumns, setGridTemplateColumns] = useState('');

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
            const newRows = [...rows];
            const [draggedRow] = newRows.splice(draggedId as number, 1);
            console.log({ draggedRow });

            // if ((draggedId as number) >= (overId as number)) {
            newRows.splice(overId as number, 0, draggedRow);
            // } else {
            //   newRows.splice((overId as number) - 1, 0, draggedRow);
            // }

            setRows(newRows);

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
        const newRows = [...rows];
        const [draggedRow] = newRows.splice(draggedId as number, 1);
        newRows.splice(overId as number, 0, draggedRow);

        setRows(newRows);

        setOverId(null);
        setDraggedId(null);
    }, [overId, draggedId]);
    return (
        <div
            className="table-content"
            onDragEnter={(event: React.DragEvent<HTMLDivElement>) => handleDragEnter(event)}
            onDragLeave={(event: React.DragEvent<HTMLDivElement>) => handleDragLeave(event)}
        >
            {rows.map((row: any, rowIndex) => {
                console.log('ROW RENDERED');
                return (
                    <div key={rowIndex}>
                        <div className="drop-indicator-container" onDragOver={(event: React.DragEvent<HTMLDivElement>) => handleDragOver(event, rowIndex)}>
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
                            // draggedId={draggedId}
                            // overId={overId}
                            // handleDragOver={handleDragOver}
                            // handleDragStart={handleDragStart}
                            // handleDragEnd={handleDragEnd}
                            // handleDragEnter={handleDragEnter}
                            // handleDragLeave={handleDragLeave}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default memo(TableContent);
// Start marker
