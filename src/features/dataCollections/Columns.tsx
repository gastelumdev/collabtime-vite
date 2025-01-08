import { memo, useCallback, useEffect, useState } from 'react';
import { TColumn } from '../../types';
import './table.css';

interface IProps {
    columns: TColumn[];
    rearangeColumns: any;
    headerHeight?: string;
    borderColor?: string;
    minCellWidth: number;
    columnResizingOffset: number;
}
const Columns = ({ columns, rearangeColumns, headerHeight, minCellWidth, columnResizingOffset }: IProps) => {
    const [currentColumns, setCurrentColumns] = useState(columns);
    const [headerRefs] = useState<any>([]);
    const [columnWidth, setColumnWidth] = useState('');

    useEffect(() => {
        setCurrentColumns(columns);
    }, [columns]);

    // ******************* COLUMN REORDERING ******************************
    // ********************************************************************
    // let draggedColumnIndex: number | null = null;
    const [draggedColumnIndex, setDraggedColumnIndex] = useState<number | null>(null);

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
            event.preventDefault();
            // If the header being dragged is over a header other than it's self,
            // turn it blue else set it back to white
            if (draggedColumnIndex !== columnIndex) {
                for (let i = 0; i < currentColumns.length; i++) {
                    const th: any = document.getElementById(String(i));
                    th.style.backgroundColor = 'white';
                }
                const th: any = document.getElementById(String(columnIndex));
                th.style.backgroundColor = 'lightblue';
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
                const [draggedColumn] = newColumns.splice(draggedColumnIndex || 0, 1);
                newColumns.splice(columnIndex, 0, draggedColumn);
                setCurrentColumns(newColumns);
                rearangeColumns(newColumns);
                // API call needed persist column order
            }
        },
        [draggedColumnIndex, currentColumns]
    );

    // ******************* COLUMN WIDTH RESIZING ********************************
    // **************************************************************************
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const mouseMove = useCallback(
        (e: any) => {
            // On mouse move, change the opacity of the resize handle so that it is visible
            const th: any = document.getElementById(String(activeIndex));
            th.children[0].children[1].style.opacity = '1';

            // set the width by getting the new position of the resize handle on the page minus the width of the sidebar
            // and additional left padding
            const width = e.clientX - columnResizingOffset - th.offsetLeft;

            // If the width is greater than minumum allowed header width, resize based on the width calculation
            // else set it to the minumum header width
            th.children[0].children[1].style.position = 'absolute';
            if (width > minCellWidth) {
                th.children[0].children[1].style.left = `${width}px`;
            } else {
                th.children[0].children[1].style.left = `${minCellWidth}px`;
            }

            // Go through each column and if the column is the one being resized,
            // set the width by getting the new position of the resize handle on the page minus the width of the sidebar
            // and additional left padding, else return its current width
            const gridColumns = currentColumns.map((col, i) => {
                col;
                const th: any = document.getElementById(String(i));

                if (i === activeIndex) {
                    const width = e.clientX - columnResizingOffset - th.offsetLeft;

                    return width >= minCellWidth ? `${width}px` : `${minCellWidth}px`;
                }
                return `${th.offsetWidth}px`;
            });

            // Add the gridTemplateColumns string to state
            setColumnWidth(`120px ${gridColumns.join(' ')}`);

            // Event listener needs to be set here so that it does not go up the DOM tree
            // which creates a lag when the width is less than the minumum header width
            document.addEventListener('mouseup', mouseUp, { once: true });
        },
        [activeIndex, currentColumns, minCellWidth, headerRefs, columnWidth]
    );

    const removeListeners = useCallback(() => {
        window.removeEventListener('mousemove', mouseMove);
        window.removeEventListener('mouseup', removeListeners);
    }, [mouseMove]);

    const mouseUp = useCallback(() => {
        // Set the column widths
        const table: any = document.getElementsByClassName('resizeable-table')[0];
        table.style.gridTemplateColumns = columnWidth;

        // Set the defaults of the handle
        const th: any = document.getElementById(String(activeIndex));
        th.children[0].children[1].style.left = '100%';
        th.children[0].children[1].style.backgroundColor = 'white';
        th.children[0].children[1].style.opacity = '0';

        // More defaults
        setActiveIndex(null);
        removeListeners();
    }, [setActiveIndex, removeListeners, columnWidth]);

    useEffect(() => {
        if (activeIndex !== null) {
            window.addEventListener('mousemove', mouseMove);
            // window.addEventListener('mouseup', mouseUp);
        }

        return () => {
            removeListeners();
        };
    }, [activeIndex, mouseMove, mouseUp, removeListeners]);

    return (
        <>
            <thead>
                <tr>
                    <th></th>
                    {currentColumns.map((column, columnIndex) => (
                        <th
                            key={columnIndex}
                            id={String(columnIndex)}
                            ref={headerRefs[columnIndex]}
                            style={{ height: headerHeight, zIndex: `${100 - columnIndex}` }}
                        >
                            <div className={'handles-container'} style={{ position: 'relative' }}>
                                <div
                                    className="header-reorder-handle"
                                    draggable={true}
                                    onDragStart={() => handleDragStart(columnIndex)}
                                    onDragOver={(event) => handleDragOver(event, columnIndex)}
                                    onDragEnd={() => handleDragEnd()}
                                    onDrop={(event) => handleDrop(event, columnIndex)}
                                    onDragLeave={() => handleDragLeave(columnIndex)}
                                >
                                    {column.name.toUpperCase().split('_').join(' ')}
                                </div>
                                <div
                                    className={`resize-handle ${activeIndex === columnIndex ? 'active' : 'idle'}`}
                                    style={{
                                        height: headerHeight,
                                        width: '5px',
                                    }}
                                    onMouseDown={() => setActiveIndex(columnIndex)}
                                >
                                    <div></div>
                                </div>
                            </div>
                        </th>
                    ))}
                </tr>
            </thead>
        </>
    );
};

export default memo(Columns);
