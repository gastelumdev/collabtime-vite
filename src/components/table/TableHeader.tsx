import { Box } from '@chakra-ui/react';
import { memo, useCallback, useEffect, useState, useTransition } from 'react';
import CreateColumn from '../../features/dataCollections/CreateColumn';
import { TColumn } from '../../types';
import ColumnMenu from './ColumnMenu';

interface IProps {
    columns: any[];
    gridTemplateColumns: string;
    minCellWidth: number;
    columnResizingOffset: number;
    setGridTemplateColumns?: any;
    rearangeColumns: any;
    headerHeight?: string;
    updateBackendColumns: any;
    updateBackendColumnWidth: any;
    handleGridTemplateColumns: any;
    handleAddNewColumnToRows: any;
    deleteColumn: any;
}

const TableHeader = ({
    columns,
    gridTemplateColumns,
    minCellWidth,
    columnResizingOffset,
    rearangeColumns,
    headerHeight = '40px',
    updateBackendColumns,
    updateBackendColumnWidth,
    handleGridTemplateColumns,
    handleAddNewColumnToRows,
    deleteColumn,
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
                console.log(event);
                setDropColumnIndex(columnIndex);

                for (let i = 0; i < currentColumns.length; i++) {
                    const th: any = document.getElementById(String(i));
                    th.style.backgroundColor = 'white';
                }
                const th: any = document.getElementById(String(columnIndex));
                th.style.backgroundColor = '#f2f2f2';
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

                const row = document.getElementsByClassName('table-row')[0];
                const gridTemplateColumns = getComputedStyle(row).getPropertyValue('grid-template-columns');
                console.log(gridTemplateColumns);
                // Reorder the column widths and set the gridTemplateColumns
                const columnWidths: any = gridTemplateColumns.split(' ');
                columnWidths.shift();
                const [columnWidth] = columnWidths.splice(draggedColumnIndex as number, 1);
                // newColumns[draggedColumnIndex as number].width = columnWidth;
                columnWidths.splice(columnIndex, 0, columnWidth);

                console.log(columnWidths);

                handleGridTemplateColumns(columnWidths.join(' '));
                // API call needed persist column order
                updateBackendColumns(newColumns);
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
    const [mouseIsUp, setMouseIsUp] = useState<boolean>(false);

    // const mouseEnter = useCallback(() => {
    //     setActiveIndex(null);
    //     setResizedWidth(null);
    //     setMouseIsUp(false);
    // }, [activeIndex, resizedWidth, mouseIsUp]);

    const mouseMove = useCallback(
        (e: any) => {
            // On mouse move, change the opacity of the resize handle so that it is visible
            console.log(activeIndex);
            const th: any = document.getElementById(String(activeIndex));
            console.log(th);

            // set the width by getting the new position of the resize handle on the page minus the width of the sidebar
            // and additional left padding
            const table: any = document.getElementById('data-collection-table');
            console.log(table);
            console.log({ windowScrollX: table.scrollLeft });
            const width = e.clientX - columnResizingOffset - th.offsetLeft + Math.floor(table.scrollLeft);
            console.log(e.clientX - columnResizingOffset);
            console.log({ clientX: e.clientX, columnResizingOffset, offsetLeft: th.offsetLeft, width });
            console.log({ width });

            // If the width is greater than minumum allowed header width, resize based on the width calculation
            // else set it to the minumum header width
            th.children[1].style.position = 'absolute';
            if (width > minCellWidth) {
                th.children[1].style.left = `${width}px`;
            } else {
                th.children[1].style.left = `${minCellWidth}px`;
            }

            // Go through each column and if the column is the one being resized,
            // set the width by getting the new position of the resize handle on the page minus the width of the sidebar
            // and additional left padding, else return its current width
            const gridColumns = currentColumns.map((col, i) => {
                col;
                const th: any = document.getElementById(String(i));

                if (i === activeIndex) {
                    const width = e.clientX - columnResizingOffset - th.offsetLeft + Math.floor(table.scrollLeft);

                    return width >= minCellWidth ? `${width}px` : `${minCellWidth}px`;
                }
                return `${th.offsetWidth}px`;
            });

            console.log({ gridColumns });

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
        console.log(resizedWidth);
        if (resizedWidth !== null) {
            // Set the column widths
            const tableRows: any = document.getElementsByClassName('table-row');
            for (const tableRow of tableRows) {
                tableRow.style.gridTemplateColumns = `220px ${columnWidth} 100px`;
            }

            const subTableRows: any = document.getElementsByClassName('table-row subrow');
            for (const tableRow of subTableRows) {
                tableRow.style.gridTemplateColumns = `210px ${columnWidth} 100px`;
            }

            // Set the defaults of the handle
            const th: any = document.getElementById(String(activeIndex));
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

    const handleAddColumn = useCallback(
        (column: TColumn) => {
            console.log(column);
            handleAddNewColumnToRows(column);
        },
        [handleAddNewColumnToRows]
    );

    const handleDeleteColumn = useCallback((column: any) => {
        deleteColumn(column);
    }, []);

    return (
        <div className="table-header">
            <div
                className="table-row header"
                style={{
                    gridTemplateColumns: '220px ' + gridTemplateColumns + ' 100px',
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
                ></span>
                {currentColumns.map((column: any, columnIndex) => {
                    return (
                        <span
                            key={columnIndex}
                            id={String(columnIndex)}
                            className="resize-header"
                            style={{
                                height: '39px',
                                padding: '0px 20px',
                                cursor: 'grab',
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
                                draggable
                                onDragStart={() => handleDragStart(columnIndex)}
                                onDragOver={(event) => handleDragOver(event, columnIndex)}
                                onDragEnd={() => handleDragEnd()}
                                onDrop={(event) => handleDrop(event, columnIndex)}
                                onDragLeave={() => handleDragLeave(columnIndex)}
                                onClick={() => console.log('HEADER CLICKED')}
                            >
                                <ColumnMenu column={column} handleDeleteColumn={handleDeleteColumn} />
                            </div>
                            {/* Resize column box */}
                            <Box
                                width={'5px'}
                                height={headerHeight}
                                position={'absolute'}
                                top={'0'}
                                left={'100%'}
                                bgColor={activeIndex === columnIndex ? '#2d82eb' : 'unset'}
                                _hover={{ bgColor: '#2d82eb', cursor: 'col-resize' }}
                                onMouseDown={() => setActiveIndex(columnIndex)}
                                // onMouseEnter={() => mouseEnter()}
                            ></Box>
                        </span>
                    );
                })}
                <span
                    style={{
                        height: '39px',
                        padding: '0px 20px',
                    }}
                >
                    <CreateColumn columns={columns} createColumn={handleAddColumn} />
                </span>
            </div>
        </div>
    );
};

export default memo(TableHeader);
