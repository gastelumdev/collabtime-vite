// import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Checkbox, Flex, Text } from '@chakra-ui/react';
import React, { memo, useEffect, useMemo, useState } from 'react';
import LabelMenu from '../../features/dataCollections/LabelMenu';
import PeopleMenu from '../../features/dataCollections/PeopleMenu';
import DateInput from '../../features/dataCollections/DateInput';
import TextInput from '../../features/dataCollections/TextInput';
import SubRowsContent from './SubRowsContent';
import EditRow from '../../features/dataCollections/EditRow';
import NoteModal from '../../features/dataCollections/NoteModal';
import { FaRegBell } from 'react-icons/fa';
import { FaRegSquareCheck } from 'react-icons/fa6';
// import UploadMenu from '../../features/dataCollections/UploadMenu';
import UploadModal from './UploadModal';
import { TDocument } from '../../types';

const Row = ({
    row,
    rowIndex,
    columns,
    gridTemplateColumns,
    // handleSetDraggedId,
    // handleSetOverId,
    handleSwap,
    handleChange,
    deleteBoxIsChecked,
    handleDeleteBoxChange,
    rowCallUpdate,
}: {
    row: any;
    rowIndex: number;
    columns: any;
    gridTemplateColumns: string;
    handleSetDraggedId: any;
    handleSetOverId: any;
    handleSwap: any;
    handleChange: any;
    deleteBoxIsChecked: boolean;
    handleDeleteBoxChange: any;
    rowCallUpdate: any;
}) => {
    const rowsData = useMemo(
        () => [
            { _id: '12345', values: { assigned_to: 'Omar', task: 'Task 1', status: 'Done', priority: 'Low', due_date: 'tomorrow' } },
            { _id: '12346', values: { assigned_to: 'Omar', task: 'Task 2', status: 'Done', priority: 'Low', due_date: 'tomorrow' } },
            { _id: '12347', values: { assigned_to: 'Omar', task: 'Task 3', status: 'Done', priority: 'Low', due_date: 'tomorrow' } },
        ],
        []
    );

    // const [isPending, startTransition] = useTransition();

    const [overId, setOverId] = useState<number | null>(null);
    const [draggedId, setDraggedId] = useState<number | null>(null);

    const [deleteCheckboxIsChecked, setDeleteCheckboxIsChecked] = useState(deleteBoxIsChecked);

    useEffect(() => {
        setDeleteCheckboxIsChecked(deleteBoxIsChecked);
    }, [deleteBoxIsChecked]);

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>, rowIndex: number) => {
        event.dataTransfer.setData('text', '');
        localStorage.setItem('rowDragged', `${rowIndex}`);
        // handleSetDraggedId(rowIndex);
        draggedId;
        setDraggedId(rowIndex);
        // const reorderHandle: any = document.getElementById(`reorder-handle-${rowIndex}`);
        // reorderHandle.style.cursor = 'move';
        // setRows((prev) => prev.filter((_, index) => index !== rowIndex));
    };

    const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
        // console.log(draggedId);
        // if (draggedId !== null) {
        event.preventDefault();
        event.stopPropagation();
        // }
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        console.log('Left row ' + rowIndex);
        setOverId(null);
        localStorage.removeItem('rowOver');
        event.preventDefault();
        event.stopPropagation();

        // setOver(false);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>, rowIndex: number) => {
        if (localStorage.getItem('rowDragged') !== null) {
            event.preventDefault();
            event.stopPropagation();

            // handleSetOverId(rowIndex);
            setOverId(rowIndex);
            localStorage.setItem('rowOver', `${rowIndex}`);
        }
    };

    const handleDragEnd = (event: any) => {
        event;
        handleSwap();
        setDraggedId(null);
        setOverId(null);
    };

    const handleDeleteCheckboxChange = () => {
        setDeleteCheckboxIsChecked(!deleteCheckboxIsChecked);
        // startTransition(() => {
        handleDeleteBoxChange(!deleteCheckboxIsChecked, rowIndex);
        // });
    };

    const onChange = (columnName: string, value: string) => {
        console.log(value);
        handleChange({ ...row, values: { ...row.values, [columnName]: value } });
    };

    const editRowOnChange = (row: any) => {
        console.log(row);
        handleChange(row);
    };

    const handleRemindersChange = () => {
        console.log(!row.reminder);
        handleChange({ ...row, reminder: !row.reminder });
    };

    const handleAcknowledgeClick = () => {
        console.log(!row.reminder);
        handleChange({ ...row, acknowledged: !row.acknowledged });
    };

    const [opened, setOpened] = useState<boolean>(row.subRowsAreOpen);

    useEffect(() => {
        setOpened(row.subRowsAreOpen);
    }, [row]);

    const getDocs = (documents: any[]) => {
        handleChange({ ...row, docs: [...row.docs, ...documents] });
    };

    const getUpdatedDoc = (document: TDocument) => {
        const newDocs: any = row.docs.map((rowDoc: any) => {
            return rowDoc._id === document._id ? document : rowDoc;
        });
        handleChange({ ...row, docs: newDocs });
    };

    const removeDoc = (document: TDocument) => {
        const newDocs: any = row.docs.filter((rowDoc: any) => {
            return rowDoc._id !== document._id;
        });

        handleChange({ ...row, docs: newDocs });
    };
    return (
        <>
            <div
                className="drop-indicator-container"
                onDragOver={(event: React.DragEvent<HTMLDivElement>) => handleDragOver(event, rowIndex)}
                onDragLeave={(event: React.DragEvent<HTMLDivElement>) => handleDragLeave(event)}
            >
                <Box
                    id={`drop-indicator-${rowIndex}`}
                    className="drop-indicator"
                    style={{
                        visibility: overId !== null && overId === rowIndex ? 'visible' : 'hidden',
                        bottom:
                            overId === 0 && Number(localStorage.getItem('rowDragged')) >= rowIndex
                                ? '-4px'
                                : overId === rowIndex && Number(localStorage.getItem('rowDragged')) < rowIndex
                                ? '-29px'
                                : '0px',
                    }}
                ></Box>
            </div>
            <Box key={rowIndex} pos={'relative'} _hover={{ bgColor: '#f1f7ff' }} backgroundColor={row.checked ? '#e1eeff' : 'unset'}>
                <>{console.log(`ROW ${rowIndex} RENDERED`)}</>
                <Box
                    key={rowIndex}
                    id={`table-row-container-${rowIndex}`}
                    className="table-row-container"
                    style={{
                        // backgroundColor: draggedId === rowIndex ? '#85bcff' : 'white',
                        borderTop: '1px solid #edf2f7',
                        // height: draggedId !== null && overId === rowIndex && draggedId >= rowIndex ? '26px' : '29px',
                    }}
                >
                    <div
                        className="table-row content"
                        style={{
                            gridTemplateColumns: '220px ' + gridTemplateColumns,
                        }}
                        onDragStart={(event: React.DragEvent<HTMLDivElement>) => handleDragStart(event, rowIndex)}
                        onDragOver={(event: React.DragEvent<HTMLDivElement>) => handleDragOver(event, rowIndex)}
                        onDragEnd={(event: React.DragEvent<HTMLDivElement>) => handleDragEnd(event)}
                        onDragEnter={(event: React.DragEvent<HTMLDivElement>) => handleDragEnter(event)}
                        onDragLeave={(event: React.DragEvent<HTMLDivElement>) => handleDragLeave(event)}
                    >
                        <span style={{ borderRight: '1px solid #edf2f7' }}>
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
                                    style={{ backgroundColor: row.parentRowId ? 'lightblue' : '#2d82eb' }}
                                ></Box>
                                <Box mt={'6px'} ml={'14px'}>
                                    <Checkbox mr={'1px'} isChecked={deleteCheckboxIsChecked} onChange={handleDeleteCheckboxChange} />
                                </Box>
                                <Box pt={'6px'}>
                                    <EditRow row={row} columns={columns} handleChange={editRowOnChange} />
                                </Box>
                                <Box pt={'6px'}>
                                    <NoteModal row={row} updateRow={editRowOnChange} rowCallUpdate={rowCallUpdate} />
                                </Box>
                                <Box pt={'7px'} ml={'10px'} onClick={handleRemindersChange} cursor={'pointer'}>
                                    <Text fontSize={'15px'} color={row.reminder ? '#16b2fc' : '#cccccc'}>
                                        <FaRegBell />
                                    </Text>
                                </Box>
                                <Box pt={'7px'} ml={'10px'} onClick={handleAcknowledgeClick} cursor={'pointer'}>
                                    <Text fontSize={'15px'} color={row.acknowledged ? '#16b2fc' : '#cccccc'}>
                                        <FaRegSquareCheck />
                                    </Text>
                                </Box>
                                <Box pt={'7px'} ml={'10px'} onClick={handleAcknowledgeClick} cursor={'pointer'}>
                                    <UploadModal rowDocuments={row.docs} getDocs={getDocs} getUpdatedDoc={getUpdatedDoc} removeDoc={removeDoc} />
                                </Box>
                                {/* <Button
                                variant={'unstyled'}
                                h={'20px'}
                                outline="unset"
                                onClick={() => {
                                    console.log('BUTTON CLICKED on INDEX', rowIndex);
                                    // setSubrowDrawers((prev) => prev.map((state, index) => (index === rowIndex ? !state : state)));
                                    setOpened(!opened);
                                    handleChange({ ...row, subRowsAreOpen: !opened });
                                }}
                            >
                                <Text>{opened ? <ChevronDownIcon /> : <ChevronRightIcon />}</Text>
                            </Button> */}
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
                                        borderBottom: '1px solid #edf2f7',
                                        paddingLeft: row.parentRowId && columnIndex == 0 ? '20px' : '0px',
                                    }}
                                >
                                    {column.type === 'label' || column.type === 'priority' || column.type === 'status' ? (
                                        <LabelMenu
                                            id={rowIndex}
                                            labels={column.labels}
                                            columnName={column.name}
                                            value={row.values[column.name]}
                                            onChange={onChange}
                                        />
                                    ) : column.type === 'people' ? (
                                        <PeopleMenu
                                            row={row}
                                            columnName={column.name}
                                            people={column.people}
                                            value={row.values[column.name]}
                                            onChange={onChange}
                                        />
                                    ) : column.type === 'date' ? (
                                        <DateInput value={row.values[column.name]} columnName={column.name} onChange={onChange} />
                                    ) : (
                                        <TextInput id={row._id} columnName={column.name} value={row.values[column.name]} onChange={onChange} />
                                    )}
                                    {/* {row.values[column.name]} */}
                                </div>
                            );
                        })}
                    </div>
                </Box>
                <SubRowsContent rows={rowsData} columns={columns} gridTemplateColumns={'170px ' + gridTemplateColumns} opened={opened} />
            </Box>
        </>
    );
};

export default memo(Row);
