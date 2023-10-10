import React, { useState } from "react";
import "./table.css";

interface ColumnWidths {
    [key: string]: number;
}

const ResizableTable: React.FC = () => {
    const initialColumnWidths: ColumnWidths = {
        col1: 150, // Initial column width in pixels
        col2: 200, // Initial column width in pixels
        // Add more columns and their initial widths as needed
    };

    const [columnWidths, setColumnWidths] =
        useState<ColumnWidths>(initialColumnWidths);
    const [isResizing, setIsResizing] = useState<boolean>(false);
    const [resizingColumn, setResizingColumn] = useState<string | null>(null);
    const [mouseX, setMouseX] = useState<number>(0);

    const handleMouseDown = (e: React.MouseEvent, columnName: string) => {
        setIsResizing(true);
        setResizingColumn(columnName);
        setMouseX(e.clientX);

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isResizing) return;

        const newWidth =
            columnWidths[resizingColumn as string] + e.clientX - mouseX;

        if (newWidth >= 50) {
            // Minimum width for a column (adjust as needed)
            const updatedColumnWidths = {
                ...columnWidths,
                [resizingColumn as string]: newWidth,
            };

            setColumnWidths(updatedColumnWidths);
            setMouseX(e.clientX);
        }
    };

    const handleMouseUp = () => {
        setIsResizing(false);
        setResizingColumn(null);

        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    return (
        <table>
            <thead>
                <tr>
                    <th style={{ width: columnWidths.col1 }}>
                        Column 1
                        <div
                            className="resize-handle"
                            onMouseDown={(e) => handleMouseDown(e, "col1")}
                        />
                    </th>
                    <th style={{ width: columnWidths.col2 }}>
                        Column 2
                        <div
                            className="resize-handle"
                            onMouseDown={(e) => handleMouseDown(e, "col2")}
                        />
                    </th>
                    {/* Add more table headers and columns as needed */}
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Row 1, Column 1</td>
                    <td>Row 1, Column 2</td>
                </tr>
                {/* Add more table rows and cells as needed */}
            </tbody>
        </table>
    );
};

export default ResizableTable;
