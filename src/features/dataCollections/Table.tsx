import { createRef } from 'react';
import { useState, useCallback, useEffect } from 'react';
import { Box, Card, Checkbox, Flex, IconButton, Text } from '@chakra-ui/react';
import './table.css';
import Columns from './Columns';
import { TColumn } from '../../types';
import LabelMenu from './LabelMenu';
import TextInput from './TextInput';
import { FaRegTrashAlt } from 'react-icons/fa';
interface IProps {
    headers: any;
    rows: any;
    headerHeight?: string;
    borderColor?: string;
    minCellWidth: number;
    columnResizingOffset: number;
}

const Table = ({ headers, rows, headerHeight = '30px', minCellWidth, columnResizingOffset }: IProps) => {
    const tableElement = createRef<any>();
    const [setHeaderRefs] = useState<any>([]);
    const [currentColumns, setCurrentColumns] = useState<any[]>(headers || []);
    const [currentRows, setCurrentRows] = useState<any[]>(rows || []);
    const [tableHeight, setTableHeight] = useState<number>(window.innerHeight - 146 - 40);
    const [dragItemRefs, setDragItemRefs] = useState<any[]>([]);
    const [dragOverItemRefs, setDragOverItemRefs] = useState<any[]>([]);

    const [checkedRows, setCheckedRows] = useState<number[]>([]);

    // const [tableHeight, setTableHeight] = useState('auto');

    useEffect(() => {
        setDragItemRefs(
            Array(currentRows.length)
                .fill(null)
                .map(() => createRef())
        );
        setDragOverItemRefs(
            Array(currentRows.length)
                .fill(null)
                .map(() => createRef())
        );
    }, [currentRows]);

    useEffect(() => {
        setCurrentColumns(headers || []);
    }, [headers]);

    useEffect(() => {
        setCurrentRows(rows || []);
    }, [rows]);

    useEffect(() => {
        setHeaderRefs((headerRefs: any) =>
            Array(currentColumns.length)
                .fill(null)
                .map((_, i) => headerRefs[i] || createRef())
        );
    }, [currentColumns]);

    const resizeTable = useCallback(() => {
        setTableHeight(window.innerHeight - 146 - 40);
    }, [tableHeight]);

    useEffect(() => {
        window.addEventListener('resize', resizeTable);

        return () => {
            window.removeEventListener('resize', resizeTable);
        };
    }, []);

    const onChange = useCallback((id: number, columnName: string, value: string) => {
        setCurrentRows((prevRows) =>
            prevRows.map((row, index) => {
                return index !== id
                    ? row
                    : {
                          ...row,
                          values: { ...row.values, [columnName]: value },
                      };
            })
        );
    }, []);

    const rearangeColumns = useCallback(
        (columns: TColumn[]) => {
            setCurrentColumns(columns);
        },
        [currentColumns]
    );

    const onCheckboxChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>, rowIndex: number) => {
            if (event.target.checked) {
                setCheckedRows([...checkedRows, rowIndex]);
            } else {
                setCheckedRows((prevRows) => prevRows.filter((index) => index !== rowIndex));
            }
        },
        [checkedRows]
    );

    const handleDeleteItemClick = useCallback((rows: any[]) => {
        setCurrentRows((prevRows) => prevRows.filter((_, index) => !rows.includes(index)));
        setCheckedRows([]);
    }, []);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [_, setDropIndex] = useState<number | null>(null);
    const [draggedRow, setDraggedRow] = useState<any | null>(null);
    const [dragging, setDragging] = useState<boolean>(false);
    const [mouseDown, setMouseDown] = useState<boolean>(false);

    const handleMouseEnter = useCallback(
        (e: any, rowIndex: number) => {
            e;
            if (activeIndex === null) {
            } else {
                setDropIndex(rowIndex);
            }
        },
        [activeIndex, setDropIndex]
    );

    const handleMouseDown = useCallback(
        (e: any, rowIndex: number) => {
            e;
            setActiveIndex(rowIndex);
            setMouseDown(true);
        },
        [activeIndex]
    );
    const handleMouseLeave = useCallback(
        (e: any) => {
            e;
            if (!dragging && mouseDown) {
                setDraggedRow(currentRows[activeIndex as number]);
                setCurrentRows((prevItems) => prevItems.filter((_: any, index: number) => index !== activeIndex));

                const relativeDiv = document.createElement('div');
                const absoluteDiv = document.createElement('div');
                const textContent = document.createTextNode('item');
                relativeDiv.style.position = 'relative';
                absoluteDiv.style.position = 'absolute';

                absoluteDiv.appendChild(textContent);
                relativeDiv.appendChild(absoluteDiv);

                const th: any = document.getElementById(`row-${activeIndex}`);
                th.children[0].appendChild(relativeDiv);

                tableElement.current.box = th;
                setDragging(true);
            }
        },
        [activeIndex, draggedRow, currentRows, dragging, mouseDown]
    );

    const handleMouseMove = useCallback(
        (e: any) => {
            // absoluteDiv.style.left = '20px';
            tableElement.current.style.top = `${e.clientY - 200}px`;
        },
        [activeIndex]
    );

    // const removeListeners = useCallback(() => {
    //     window.removeEventListener('mouseleave', handleMouseLeave);
    //     window.removeEventListener('mouseup', removeListeners);
    // }, [handleMouseLeave]);

    const handleMouseUp = useCallback(() => {
        // Set the column widths
        // const tr: any = document.getElementById(`row-${activeIndex}`);
        // tr.style.display = 'table-row';
        // tr.style.transform = `translateY(${0}px)`;
        // More defaults
        setActiveIndex(null);
        setDragging(false);
        setMouseDown(false);
        // removeListeners();
    }, [activeIndex, dragging, mouseDown, setDragging, setMouseDown]);

    useEffect(() => {
        if (dragging) {
            window.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [dragging]);

    return (
        <div className="container">
            <div className="table-wrapper">
                <table
                    id="table"
                    className="resizeable-table"
                    style={{
                        gridTemplateColumns: '120px ' + currentColumns.map(() => '180px').join(' '),
                        height: tableHeight,
                    }}
                >
                    <Columns
                        columns={currentColumns}
                        rearangeColumns={rearangeColumns}
                        headerHeight={headerHeight}
                        minCellWidth={minCellWidth}
                        columnResizingOffset={columnResizingOffset}
                    />
                    <tbody>
                        {currentRows.map((row, rowIndex) => {
                            return (
                                <tr
                                    key={rowIndex}
                                    id={`row-${rowIndex}`}
                                    ref={dragOverItemRefs[rowIndex]}
                                    onMouseDown={(event) => handleMouseDown(event, rowIndex)}
                                    onMouseEnter={(event) => handleMouseEnter(event, rowIndex)}
                                    onMouseLeave={(event) => handleMouseLeave(event)}
                                    onMouseUp={() => handleMouseUp()}
                                    // onMouseMove={(event) => handleMouseMove(event)}
                                >
                                    <td>
                                        <Flex
                                            ref={dragItemRefs[rowIndex]}
                                            // draggable={true}
                                            // onDragStart={() => handleDragStart(rowIndex)}
                                            // onDragEnter={(event) => handleDragEnter(event, rowIndex)}
                                            // onDragOver={(event) => handleDragOver(event)}
                                            // onDragEnd={() => handleDragEnd(rowIndex)}
                                            // onDrop={(event) => handleDrop(event, rowIndex)}
                                            // onDragLeave={() => handleDragLeave(rowIndex)}
                                        >
                                            <Box h={'24px'} w={'20px'} mr={'5px'} bgColor={false ? 'red' : '#f5f5f5'} borderRight={'1px solid lightgray'}></Box>
                                            <Checkbox
                                                isChecked={checkedRows.includes(rowIndex)}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => onCheckboxChange(event, rowIndex)}
                                            />
                                        </Flex>
                                    </td>
                                    {currentColumns.map((column, columnIndex) => {
                                        return (
                                            <td key={columnIndex}>
                                                {column.type === 'text' ? (
                                                    <TextInput id={rowIndex} columnName={column.name} value={row.values[column.name]} onChange={onChange} />
                                                ) : column.type === 'label' || column.type === 'priority' || column.type === 'status' ? (
                                                    <LabelMenu
                                                        id={rowIndex}
                                                        columnName={column.name}
                                                        labels={column.labels}
                                                        value={row.values[column.name]}
                                                        onChange={onChange}
                                                    />
                                                ) : null}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {checkedRows.length > 0 ? (
                    <Box position={'relative'}>
                        <Card
                            position={'absolute'}
                            backgroundColor={'white'}
                            right={'40px'}
                            bottom={'50px'}
                            boxShadow={'2xl'}
                            colorScheme={'red'}
                            border={'1px solid lightgray'}
                        >
                            <Flex>
                                <Box
                                    minH={'100%'}
                                    width={'60px'}
                                    backgroundColor={'red'}
                                    mr={'26px'}
                                    pl="22px"
                                    py={'8px'}
                                    borderRadius={'5px 0px 0px 5px'}
                                    color={'white'}
                                    fontSize={'26px'}
                                >
                                    {checkedRows.length}
                                </Box>
                                <Text fontSize={'xl'} mt={'12px'}>
                                    {checkedRows.length > 1 ? 'items to delete' : 'item to delete'}
                                </Text>
                                <Box
                                    minH={'100%'}
                                    width={'60px'}
                                    pl="22px"
                                    mr={'10px'}
                                    py={'6px'}
                                    ml={'10px'}
                                    borderRadius={'5px 0px 0px 5px'}
                                    color={'white'}
                                    fontSize={'26px'}
                                    _hover={{ color: 'red' }}
                                    onClick={() => handleDeleteItemClick(checkedRows)}
                                >
                                    <IconButton icon={<FaRegTrashAlt />} aria-label="Delete rows" colorScheme="red" />
                                </Box>
                            </Flex>
                        </Card>
                    </Box>
                ) : null}
            </div>
        </div>
    );
};

export default Table;
