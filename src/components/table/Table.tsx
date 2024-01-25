import React, { useEffect } from 'react';
import { useCallback, useState, memo } from 'react';
import './Table.css';
import TableContent from './TableContent';
import TableHeader from './TableHeader';
import { TColumn } from '../../types';

interface ITableProps {
    rowsData: any[];
    columnsData: any[];
    minCellWidth: number;
    columnResizingOffset: number;
    updateColumn: any;
    reorderColumns: any;
}

const Table = ({ rowsData, columnsData, minCellWidth, columnResizingOffset, updateColumn, reorderColumns }: ITableProps) => {
    const [overId, setOverId] = useState<number | null>(null);
    const [draggedId, setDraggedId] = useState<number | null>(null);

    const [rows, setRows] = useState<any[]>(rowsData);
    const [columns, setColumns] = useState<any[]>(columnsData);

    const [gridTemplateColumns, setGridTemplateColumns] = useState<string>(columnsData.map((_) => '180px').join(' '));

    useEffect(() => {
        setRows(rowsData);
        setColumns(columnsData);
        console.log(rowsData);
        console.log(columnsData);

        setGridTemplateColumns(
            columnsData
                .map((column) => {
                    return column.width !== undefined ? column.width : '180px';
                })
                .join(' ')
        );
    }, [rowsData, columnsData]);

    const handleSetRows = useCallback((newRows: any[]) => {
        setRows(newRows);
    }, []);

    const handleSetGridTemplateColumns = useCallback(
        (columnWidths: string) => {
            setGridTemplateColumns(columnWidths);
        },
        [gridTemplateColumns]
    );

    const rearangeColumns = useCallback(
        (columns: TColumn[]) => {
            setColumns(
                columns.map((column, index) => {
                    return { ...column, position: index + 1 };
                })
            );
        },
        [columns]
    );

    const updateBackendColumns = useCallback(
        (columns: TColumn[]) => {
            setColumns(columns);
            reorderColumns(columns);
        },
        [rearangeColumns, setColumns]
    );

    const updateBackendColumnWidth = useCallback(
        async (column: TColumn) => {
            updateColumn(column);
        },
        [updateColumn]
    );

    // const updateFrontendColumnWidth = useCallback((column: TColumn) => {

    // })

    const handleGridTemplateColumns = useCallback((gridTemplateColumns: string) => {
        setGridTemplateColumns(gridTemplateColumns);
    }, []);

    return (
        <div id={'data-collection-table'} className={'table'}>
            <TableHeader
                columns={columns}
                gridTemplateColumns={gridTemplateColumns}
                minCellWidth={minCellWidth}
                columnResizingOffset={columnResizingOffset}
                setGridTemplateColumns={handleSetGridTemplateColumns}
                rearangeColumns={rearangeColumns}
                updateBackendColumns={updateBackendColumns}
                updateBackendColumnWidth={updateBackendColumnWidth}
                handleGridTemplateColumns={handleSetGridTemplateColumns}
            />
            <TableContent
                rows={rows}
                columns={columns}
                setRows={handleSetRows}
                gridTemplateColumnsIn={gridTemplateColumns}
                minCellWidth={minCellWidth}
                columnResizingOffset={columnResizingOffset}
                reorderColumns={reorderColumns}
                updateColumn={updateColumn}
            />
        </div>
    );
};

export default memo(Table);
