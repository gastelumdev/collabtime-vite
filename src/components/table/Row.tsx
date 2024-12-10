// import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Checkbox, Flex, Text } from '@chakra-ui/react';
import React, { memo, useCallback, useEffect, useState } from 'react';
import LabelMenu from '../../features/dataCollections/LabelMenu';
import PeopleMenu from '../../features/dataCollections/PeopleMenu';
import DateInput from '../../features/dataCollections/DateInput';
import TextInput from '../../features/dataCollections/TextInput';
// import SubRowsContent from './SubRowsContent';
import EditRow from '../../features/dataCollections/EditRow';
import NoteModal from '../../features/dataCollections/NoteModal';
import { FaRegSquareCheck } from 'react-icons/fa6';
// import UploadMenu from '../../features/dataCollections/UploadMenu';
import UploadModal from './UploadModal';
import { TDocument } from '../../types';
// import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import Reference from './Reference';
// import { useUpdateRowMutation } from '../../app/services/api';
import { useTypedSelector, useAppDispatch } from '../../hooks/store';
import { addCheckedRowId, removeCheckedRowId } from '../../components/table/tableSlice';
import RemindersDrawer from './RemindersDrawer';
// import { useGetUserGroupsQuery } from '../../app/services/api';
import { emptyDataCollectionPermissions } from '../../features/workspaces/UserGroups';
import { useParams } from 'react-router-dom';
import { useGetOneWorkspaceQuery } from '../../app/services/api';
// import { useParams } from 'react-router-dom';

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
    // handleSubrowVisibility,
    // rowCallUpdate,
    allowed = false,
    isDraggable = false,
    hasCheckboxOptions = true,
    dataCollectionView = null,
    appModel = null,
    permissions = null,
    isArchives = false,
}: {
    row: any;
    rowIndex: number;
    columns: any;
    gridTemplateColumns: string;
    // handleSetDraggedId: any;
    // handleSetOverId: any;
    handleSwap: any;
    handleChange: any;
    deleteBoxIsChecked: boolean;
    handleDeleteBoxChange: any;
    handleSubrowVisibility?: any;
    rowCallUpdate?: any;
    allowed?: boolean;
    showDoneRows?: boolean;
    isDraggable?: boolean;
    hasCheckboxOptions?: boolean;
    dataCollectionView?: any;
    refetchRows?: any;
    appModel?: string | null;
    permissions?: any;
    isArchives?: boolean;
}) => {
    // const rowsData = useMemo(
    //     () => [
    //         { _id: '12345', values: { assigned_to: 'Omar', task: 'Task 1', status: 'Done', priority: 'Low', due_date: 'tomorrow' } },
    //         { _id: '12346', values: { assigned_to: 'Omar', task: 'Task 2', status: 'Done', priority: 'Low', due_date: 'tomorrow' } },
    //         { _id: '12347', values: { assigned_to: 'Omar', task: 'Task 3', status: 'Done', priority: 'Low', due_date: 'tomorrow' } },
    //     ],
    //     []
    // );

    // const [isPending, startTransition] = useTransition();
    const { id } = useParams();

    const dispatch = useAppDispatch();

    const checkedRowIds = useTypedSelector((state: any) => {
        return state.table.checkedRowIds;
    });

    const { data: workspace } = useGetOneWorkspaceQuery(id as string);

    const [overId, setOverId] = useState<number | null>(null);
    const [draggedId, setDraggedId] = useState<number | null>(null);

    const [deleteCheckboxIsChecked, setDeleteCheckboxIsChecked] = useState(deleteBoxIsChecked);

    const [showRow, _setShowRow] = useState(true);

    // const { data: userGroups, refetch: refetchUserGroups } = useGetUserGroupsQuery(null);
    const [dataCollectionPermissions, setDataCollectionPermissions] = useState<any>(emptyDataCollectionPermissions);

    useEffect(() => {
        console.log({ gridTemplateColumns });
        if (permissions !== null) {
            setDataCollectionPermissions(permissions);
        }
    }, [permissions]);

    // useEffect(() => {
    //     const userGroup = userGroups.find((item: any) => {
    //         return item.users.includes(localStorage.getItem('userId'));
    //     });

    //     if (dataCollectionView) {
    //         const viewPermissions = userGroup.permissions.views.find((item: any) => {
    //             return item.view === dataCollectionView._id;
    //         });

    //         if (viewPermissions !== undefined) {
    //             setDataCollectionPermissions(viewPermissions.permissions);
    //         } else {
    //             refetchUserGroups();
    //         }
    //     } else {
    //         let dcId = '';
    //         if (row) {
    //             dcId = row.dataCollection;
    //         }
    //         const dataCollectionPermissions = userGroup.permissions.dataCollections.find((item: any) => {
    //             return item.dataCollection === dataCollectionId || item.dataCollection === dcId || item.dataCollection === appModel;
    //         });

    //         if (dataCollectionPermissions !== undefined) {
    //             setDataCollectionPermissions(dataCollectionPermissions.permissions);
    //         } else {
    //             refetchUserGroups();
    //         }
    //     }
    // }, [userGroups]);

    useEffect(() => {
        setDeleteCheckboxIsChecked(deleteBoxIsChecked);
    }, [deleteBoxIsChecked]);

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>, _rowIndex: number) => {
        if (isDraggable) {
            event.dataTransfer.setData('text', '');
            localStorage.setItem('rowDragged', `${row.position}`);
            localStorage.setItem('dragging', 'true');
            // handleSetDraggedId(rowIndex);
            draggedId;
            setDraggedId(row.position);
            // const reorderHandle: any = document.getElementById(`reorder-handle-${rowIndex}`);
            // reorderHandle.style.cursor = 'move';
            // setRows((prev) => prev.filter((_, index) => index !== rowIndex));
        }
    };

    const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
        // if (draggedId !== null) {
        event.preventDefault();
        event.stopPropagation();
        // }
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        setOverId(null);
        localStorage.removeItem('rowOver');
        event.preventDefault();
        event.stopPropagation();

        // setOver(false);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>, _rowIndex: number) => {
        if (localStorage.getItem('rowDragged') !== null) {
            event.preventDefault();
            event.stopPropagation();

            // handleSetOverId(rowIndex);
            setOverId(row.position);
            localStorage.setItem('rowOver', `${row.position}`);
        }
    };

    const handleDragEnd = useCallback(
        (event: any) => {
            event;
            setDraggedId(null);
            setOverId(null);
            handleSwap();
        },
        [draggedId, overId, handleSwap]
    );

    const handleDeleteCheckboxChange = () => {
        if (checkedRowIds.includes(row._id)) {
            dispatch(removeCheckedRowId(row._id));
        } else {
            dispatch(addCheckedRowId(row._id));
        }
        setDeleteCheckboxIsChecked(!deleteCheckboxIsChecked);
        // startTransition(() => {
        handleDeleteBoxChange(!deleteCheckboxIsChecked, rowIndex);
        // });
    };

    const onChange = (columnName: string, value: string) => {
        // if (columnName === 'status' && value === 'Done') {
        //     setShowRow(false);
        // } else {
        //     setShowRow(true);
        // }
        handleChange({ ...row, values: { ...row.values, [columnName]: value } });
        // refetchRows();
    };

    const onRefChange = (columnName: string, ref: any) => {
        const refs: any = [];
        if (row.refs === undefined) {
            refs.push(ref);
            handleChange({ ...row, refs: { [columnName]: refs } });
        } else {
            if (row.refs[columnName] === undefined) {
                handleChange({ ...row, refs: { ...row.refs, [columnName]: [ref] } });
            } else {
                handleChange({ ...row, refs: { ...row.refs, [columnName]: [...row.refs[columnName], ref] } });
            }
        }

        // handleChange({ ...row, refs: {...row.refs, [columnName]: [...row.refs[columnName], row]} });
    };

    const onRemoveRef = (columnName: string, ref: any) => {
        const rowCopy: any = row;
        const refs: any = rowCopy.refs;
        const refTarget: any = refs[columnName];

        const filteredRefs = refTarget.filter((r: any) => {
            return r._id !== ref._id;
        });

        handleChange({ ...row, refs: { ...row.refs, [columnName]: filteredRefs } });
    };

    const editRowOnChange = (row: any) => {
        handleChange(row);
    };

    const handleAcknowledgeClick = () => {
        handleChange({ ...row, acknowledged: !row.acknowledged });
    };

    const [opened, setOpened] = useState<boolean>();

    useEffect(() => {
        opened;
        setOpened(row.isVisible);
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
            {row.isVisible && showRow ? (
                <Box bgColor={row.parentRowId ? '#f5faff' : row.isParent ? '#ebf5ff' : 'inherit'}>
                    <div
                        className="drop-indicator-container"
                        onDragOver={(event: React.DragEvent<HTMLDivElement>) => handleDragOver(event, row.position)}
                        onDragLeave={(event: React.DragEvent<HTMLDivElement>) => handleDragLeave(event)}
                        // draggable={isDraggable}
                    >
                        <Box
                            id={`drop-indicator-${rowIndex}`}
                            className="drop-indicator"
                            style={{
                                visibility: Boolean(localStorage.getItem('dragging')) && overId !== null && overId === row.position ? 'visible' : 'hidden',
                                bottom:
                                    overId === 1 && Number(localStorage.getItem('rowDragged')) >= row.position
                                        ? '-4px'
                                        : overId === row.position && Number(localStorage.getItem('rowDragged')) < row.position
                                        ? '-29px'
                                        : '0px',
                            }}
                        ></Box>
                    </div>
                    <Box key={rowIndex} pos={'relative'} _hover={{ bgColor: '#f1f7ff' }} backgroundColor={row.checked ? '#e1eeff' : 'unset'}>
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
                                className={dataCollectionView ? `table-row table-row-${dataCollectionView._id} content` : 'table-row content'}
                                style={{
                                    gridTemplateColumns: `${hasCheckboxOptions ? '220px' : '150px'} ${gridTemplateColumns}`,
                                }}
                                // draggable={allowed && isDraggable}
                                onDragStart={(event: React.DragEvent<HTMLDivElement>) => handleDragStart(event, row.position)}
                                onDragOver={(event: React.DragEvent<HTMLDivElement>) => handleDragOver(event, row.position)}
                                // onDragEnd={(event: React.DragEvent<HTMLDivElement>) => handleDragEnd(event)}
                                onDragEnter={(event: React.DragEvent<HTMLDivElement>) => handleDragEnter(event)}
                                onDragLeave={(event: React.DragEvent<HTMLDivElement>) => handleDragLeave(event)}
                                onDrop={(event: React.DragEvent<HTMLDivElement>) => handleDragEnd(event)}
                            >
                                <span style={{ borderRight: '1px solid #edf2f7', width: !hasCheckboxOptions ? '150px' : '220px' }}>
                                    <Flex>
                                        {isDraggable && dataCollectionPermissions.rows.reorder && appModel === null ? (
                                            <Box
                                                id={`reorder-handle-${rowIndex}`}
                                                w={'15px'}
                                                h={'30px'}
                                                bgColor={'#24a2f0'}
                                                cursor={allowed && isDraggable && dataCollectionPermissions.rows.reorder && !isArchives ? 'move' : 'default'}
                                                draggable={allowed && isDraggable && dataCollectionPermissions.rows.reorder && !isArchives}
                                                onDragStart={(event: React.DragEvent<HTMLDivElement>) => handleDragStart(event, row.position)}
                                                onDragOver={(event: React.DragEvent<HTMLDivElement>) => handleDragOver(event, row.position)}
                                                // onDragEnd={(event: React.DragEvent<HTMLDivElement>) => handleDragEnd(event)}
                                                onDragEnter={(event: React.DragEvent<HTMLDivElement>) => handleDragEnter(event)}
                                                onDragLeave={(event: React.DragEvent<HTMLDivElement>) => handleDragLeave(event)}
                                                // onDrop={(event: React.DragEvent<HTMLDivElement>) => handleDragEnd(event)}
                                                style={{ backgroundColor: row.parentRowId ? '#9fdaff' : '#24a2f0' }}
                                            ></Box>
                                        ) : null}
                                        {hasCheckboxOptions && appModel === null ? (
                                            <Box mt={'6px'} ml={'14px'}>
                                                <Checkbox
                                                    mr={'1px'}
                                                    isChecked={checkedRowIds.includes(row._id)}
                                                    onChange={handleDeleteCheckboxChange}
                                                    disabled={!dataCollectionPermissions.rows.subrows && !dataCollectionPermissions.rows.delete}
                                                />
                                            </Box>
                                        ) : null}
                                        <Box pt={'6px'}>
                                            <EditRow row={row} columns={columns} handleChange={editRowOnChange} allowed={allowed} />
                                        </Box>
                                        {dataCollectionPermissions.notes.view ? (
                                            <Box pt={'6px'}>
                                                <NoteModal
                                                    row={row}
                                                    updateRow={editRowOnChange}
                                                    // rowCallUpdate={rowCallUpdate}
                                                    allowed={dataCollectionPermissions.notes.create}
                                                />
                                            </Box>
                                        ) : null}
                                        <Box pt={'7px'} ml={'10px'} cursor={dataCollectionPermissions.reminders.view ? 'pointer' : 'default'}>
                                            <RemindersDrawer row={row} handleChange={editRowOnChange} allowed={dataCollectionPermissions.reminders.view} />
                                        </Box>
                                        <Box
                                            pt={'7px'}
                                            ml={'10px'}
                                            onClick={allowed ? handleAcknowledgeClick : () => {}}
                                            cursor={allowed ? 'pointer' : 'default'}
                                        >
                                            <Text fontSize={'15px'} color={row.acknowledged && allowed ? '#16b2fc' : '#cccccc'}>
                                                <FaRegSquareCheck />
                                            </Text>
                                        </Box>
                                        <Box pt={'7px'} ml={'10px'} cursor={'pointer'}>
                                            <UploadModal
                                                rowDocuments={row.docs}
                                                getDocs={getDocs}
                                                getUpdatedDoc={getUpdatedDoc}
                                                removeDoc={removeDoc}
                                                permissions={dataCollectionPermissions}
                                            />
                                        </Box>
                                        {/* {row.position} */}
                                        {/* {row.isParent ? (
                                            <Button
                                                variant={'unstyled'}
                                                h={'20px'}
                                                outline="unset"
                                                onClick={() => {
                                                    // setSubrowDrawers((prev) => prev.map((state, index) => (index === rowIndex ? !state : state)));
                                                    // setOpened(!opened);
                                                    // updateRow({ ...row, showSubrows: !opened });
                                                    handleSubrowVisibility(row);
                                                }}
                                            >
                                                <Text>{row.showSubrows ? <ChevronDownIcon /> : <ChevronRightIcon />}</Text>
                                            </Button>
                                        ) : null} */}
                                    </Flex>
                                </span>
                                {columns.map((column: any, columnIndex: number) => {
                                    let value = row?.values[column?.name];
                                    let min_warning = row?.values['min_warning'];
                                    let min_critical = row?.values['min_critical'];
                                    let max_warning = row?.values['max_warning'];
                                    let max_critical = row?.values['max_critical'];

                                    const columnsPermissions = dataCollectionPermissions.columns.find((item: any) => {
                                        return item.name === column?.name;
                                    });

                                    if (columnsPermissions !== undefined && !columnsPermissions?.permissions.column.view) {
                                        return null;
                                    }

                                    let labels = column?.labels.filter((label: any) => {
                                        if (columnsPermissions !== undefined) {
                                            return columnsPermissions.permissions.labels.includes(label.title);
                                        }
                                    });

                                    if (labels !== undefined && labels.length === 0) {
                                        labels = column?.labels;
                                    }

                                    let editable = false;
                                    if (columnsPermissions?.permissions.column.update && appModel === null) {
                                        editable = true;
                                    } else if (appModel !== null && (column?.primary === undefined || !column?.primary)) {
                                        editable = true;
                                    }
                                    if (column?.autoIncremented) {
                                        editable = false;
                                    }

                                    let allowed = columnsPermissions === undefined || columnsPermissions?.permissions.column.update;

                                    let isCustomLink = column?.primary !== undefined ? column?.primary && dataCollectionView : false;

                                    let bgColor = 'default';
                                    let textColor = 'black';
                                    let fontWeight = 'normal';
                                    let position = 'left';
                                    let isDisabled = false;

                                    if (workspace?.type === 'integration') {
                                        position = 'center';
                                        if (['temperature'].includes(column?.name) && row.values['type'] === 'Temperature') {
                                            fontWeight = 'bold';
                                            position = 'center';
                                            textColor = 'white';
                                            bgColor = 'default';
                                            if (value >= max_critical) {
                                                bgColor = 'red';
                                            } else if (value < max_critical && value >= max_warning) {
                                                bgColor = 'orange';
                                            } else if (value < max_warning && value >= min_warning) {
                                                // bgColor = '#0f71a4';
                                                bgColor = '#398c4e';
                                            } else if (value < min_warning && value > min_critical) {
                                                bgColor = '#0f71a4';
                                            } else if (value <= min_critical) {
                                                bgColor = 'red';
                                            }

                                            if (max_critical === null || max_warning === null || min_critical === null || min_warning === null) {
                                                bgColor = 'default';
                                                textColor = 'black';
                                            }
                                        }

                                        if (['value', 'status'].includes(column?.name)) {
                                            fontWeight = 'bold';
                                            position = 'center';
                                        }

                                        if (['temperature', 'min_critical', 'min_warning', 'max_critical', 'max_warning'].includes(column?.name)) {
                                            if (value && value !== undefined) {
                                                value = Number(Number(value).toFixed(2));
                                            }
                                        }

                                        if (row.values[column?.name] === null) {
                                            isDisabled = true;
                                            bgColor = 'lightgray';
                                        }

                                        isCustomLink = false;

                                        if (column.name === 'threshold_name' && value === null) {
                                            value = 'None';
                                        }
                                    }
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
                                            {column?.type === 'label' || column?.type === 'priority' || column?.type === 'status' ? (
                                                <LabelMenu
                                                    id={rowIndex}
                                                    labels={labels}
                                                    columnName={column?.name}
                                                    value={row.values !== undefined ? value : null}
                                                    onChange={onChange}
                                                    allowed={allowed}
                                                    fontWeight={fontWeight}
                                                />
                                            ) : column?.type === 'people' ? (
                                                <PeopleMenu
                                                    row={row}
                                                    columnName={column?.name}
                                                    people={column?.people}
                                                    values={row.values !== undefined ? value : null}
                                                    onChange={onChange}
                                                    allowed={allowed}
                                                />
                                            ) : column?.type === 'date' ? (
                                                <DateInput
                                                    value={row.values !== undefined ? value : null}
                                                    columnName={column?.name}
                                                    onChange={onChange}
                                                    allowed={allowed}
                                                />
                                            ) : column?.type === 'reference' ? (
                                                <Reference
                                                    column={column !== undefined ? column : {}}
                                                    refs={row.refs && row.refs[column?.name] !== undefined ? row.refs[column?.name] : []}
                                                    onRefChange={onRefChange}
                                                    onRemoveRef={onRemoveRef}
                                                    allowed={allowed}
                                                />
                                            ) : (
                                                <TextInput
                                                    id={row._id}
                                                    columnName={column?.name}
                                                    inputType={column?.type}
                                                    value={row.values !== undefined ? value : null}
                                                    onChange={onChange}
                                                    allowed={allowed || editable || (column?.autoIncremented !== undefined && !column?.autoIncremented)}
                                                    isCustomLink={isCustomLink}
                                                    bgColor={bgColor}
                                                    textColor={textColor}
                                                    fontWeight={fontWeight}
                                                    position={position}
                                                    isDisabled={isDisabled}
                                                />
                                            )}
                                            {/* {value} */}
                                        </div>
                                    );
                                })}
                            </div>
                        </Box>
                        {/* <SubRowsContent rows={rowsData} columns={columns} gridTemplateColumns={'170px ' + gridTemplateColumns} opened={opened} /> */}
                    </Box>
                </Box>
            ) : null}
        </>
    );
};

export default memo(Row);
