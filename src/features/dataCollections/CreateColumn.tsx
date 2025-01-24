import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Flex,
    HStack,
    Input,
    Spacer,
    Spinner,
    Stack,
    Text,
    useDisclosure,
    Select,
    Checkbox,
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '@chakra-ui/react';
import ReactSelect from 'react-select';

import { AiOutlineClose } from 'react-icons/ai';
import { MdOutlineColorLens } from 'react-icons/md';

import { TColumn, TLabel } from '../../types';
import PrimaryDrawer from '../../components/PrimaryDrawer';
import Divider from '../../components/Divider/Divider';

import { getTextColor } from '../../utils/helpers';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import { BsPlusCircle } from 'react-icons/bs';
import { useParams } from 'react-router-dom';
import { useGetColumnsQuery, useGetDataCollectionsQuery, useGetWorkspaceUsersQuery } from '../../app/services/api';
import { FaUserPlus } from 'react-icons/fa6';

interface TProps {
    column?: TColumn | null;
    columns: TColumn[];
    updateColumn?: any;
    createColumn?: any;
    columnIsUpdating: boolean;
    addNewColumnToRows: any;
    handleSetColumns?: any;
    columnsAreFetching?: boolean;
    refetchPermissions?: any;
}

const CreateColumn = ({
    column = null,
    columns,
    updateColumn,
    createColumn,
    columnIsUpdating = false,
    addNewColumnToRows,
    handleSetColumns,
    columnsAreFetching = false,
    refetchPermissions,
}: TProps) => {
    const { id, dataCollectionId } = useParams();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { data: dataCollections } = useGetDataCollectionsQuery(null);
    const { data: workspaceUsers } = useGetWorkspaceUsersQuery(id as string);

    // const { data: columns } = useGetColumnsQuery(null);
    // const [createColumn] = useCreateColumnMutation();

    const [columnName, setColumnName] = useState<string>('');
    const [columnType, setColumnType] = useState<string>('text');
    const [columnRef, setColumnRef] = useState<any>(null);
    const [columnRefLabel, setColumnRefLabel] = useState(null);
    const [columnNameError, setColumnNameError] = useState<boolean>(false);
    const [showLabelForm, setShowLabelForm] = useState(false);
    const [showReferenceForm, setShowReferenceForm] = useState(false);
    const [showColumnNameSelection, setShowColumnNameSelection] = useState(false);
    const [prefix, setPrefix] = useState('');

    const defaultLabels = [
        { title: 'Label 1', color: '#005796', default: true },
        // { title: 'Label 2', color: '#4FAD00' },
        // { title: 'Label 3', color: '#ffa507' },
    ];
    const defaultLabel = {
        title: '',
        color: '#015796',
        default: false,
    };
    const [labelOptions, setLabelOptions] = useState<TLabel>(defaultLabel);
    const [labels, setLabels] = useState<TLabel[]>(defaultLabels);
    const [labelStyles, setLabelStyles] = useState<any>({});
    const [labelTitleError, setLabelTitleError] = useState<boolean>(false);

    useEffect(() => {
        if (column !== null) {
            setColumnName(column.name);

            if (column.type === 'label') {
                setShowLabelForm(true);
                setColumnType(column.type);
            }
        }
    }, [column]);

    useEffect(() => {
        for (const column of columns || []) {
            if (column.type === 'label') {
                setLabelStyles({ ...labelStyles, [column.name]: '' });
            }
        }
        setShowLabelForm(false);
    }, []);

    /**
     * Creates a new column
     * This should be replaced by RTK
     */
    const handleAddColumn = async () => {
        if (!columnNameError) {
            const newColumn: TColumn = {
                dataCollection: dataCollectionId || '',
                name: columnName,
                type: columnType,
                permanent: false,
                labels: labels,
                dataCollectionRef: columnRef,
                dataCollectionRefLabel: columnRefLabel,
                people: [],
                includeInForm: true,
                includeInExport: true,
                // position: columns[columns.length - 1].position + 1,
                position: 0,
                prefix,
            };

            // Set column name to a database friendly underscore naming
            newColumn.name = newColumn.name.toLowerCase().split(' ').join('_');

            handleSetColumns(newColumn);
            // const createdColumn = await createColumn(newColumn);

            await createColumn(newColumn);
            addNewColumnToRows(newColumn);
            setShowLabelForm(false);
            setShowReferenceForm(false);
            if (!columnsAreFetching) {
                closeDrawer();
            }

            refetchPermissions();
        }
    };

    const handleUpdateColumn = async () => {
        if (!columnNameError) {
            const updatedColumn = { ...column, name: columnName.toLowerCase().split(' ').join('_'), labels: labels, type: columnType, prefix };

            await updateColumn(updatedColumn);
            addNewColumnToRows(updatedColumn);
            setShowLabelForm(false);
            setShowReferenceForm(false);
            closeDrawer();

            refetchPermissions();
        }
    };

    /**
     * Sets the column name when input changes in create column drawer
     * @param event
     */
    const handleColumnNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;

        const columnNamesMap: any = {};

        for (const column of columns || []) {
            if (columnNamesMap[column.name] == undefined) columnNamesMap[column.name] = column.name;
        }

        if (columnNamesMap[value.toLowerCase().split(' ').join('_')] || value == '') {
            setColumnNameError(true);
        } else {
            setColumnNameError(false);
        }

        setColumnName(value);
    };

    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOption = event.target.value;
        setColumnType(selectedOption);

        if (selectedOption === 'label') {
            setShowLabelForm(true);
        } else {
            setShowLabelForm(false);
        }

        if (selectedOption === 'priority') {
            setLabels([
                { title: 'Low', color: '#28B542', default: true },
                { title: 'High', color: '#FFA500', default: false },
                { title: 'Critical', color: '#FF0000', default: false },
            ]);
        }

        if (selectedOption === 'status') {
            setLabels([
                { title: 'Ready to start', color: '#121f82', default: true },
                { title: 'Working on it', color: '#146c96', default: false },
                { title: 'Pending review', color: '#FFA500', default: false },
                { title: 'Done', color: '#28B542', default: false },
            ]);
        }

        if (selectedOption === 'reference') {
            setShowReferenceForm(true);
        } else {
            setShowReferenceForm(false);
        }
    };

    // const handleSelectType = (selectedOption: any) => {
    //     setColumnType(selectedOption.value);

    //     if (selectedOption.value === 'label') {
    //         setShowLabelForm(true);
    //     } else {
    //         setShowLabelForm(false);
    //     }

    //     if (selectedOption.value === 'priority') {
    //         setLabels([
    //             { title: 'Low', color: '#28B542' },
    //             { title: 'High', color: '#FFA500' },
    //             { title: 'Critical', color: '#FF0000' },
    //         ]);
    //     }

    //     if (selectedOption.value === 'status') {
    //         setLabels([
    //             { title: 'Ready to start', color: '#121f82' },
    //             { title: 'Working on it', color: '#146c96' },
    //             { title: 'Pending review', color: '#FFA500' },
    //             { title: 'Done', color: '#28B542' },
    //         ]);
    //     }

    //     if (selectedOption.value === 'reference') {
    //         setShowReferenceForm(true);
    //     } else {
    //         setShowReferenceForm(false);
    //     }
    // };

    const handleSelectDataCollection = (selectedOption: any) => {
        setColumnRef(selectedOption.value);
        setShowColumnNameSelection(true);
    };

    const handleSelectColumn = (selectedOption: any) => {
        setColumnRefLabel(selectedOption.value);
    };

    const handleLabelOptionsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.name == 'title' && event.target.value == '') {
            setLabelTitleError(true);
        } else {
            setLabelTitleError(false);
        }
        setLabelOptions({
            ...labelOptions,
            [event.target.name]: event.target.value,
        });
    };

    const removeLabel = (label: TLabel) => {
        const newLabels = labels.filter((item: TLabel) => {
            return label.title !== item.title;
        });

        setLabels(newLabels);
    };

    const addLabel = () => {
        setLabelTitleError(false);
        if (labelOptions.title === '') {
            setLabelTitleError(true);
        } else {
            labelOptions.default = labels.length === 0 ? true : false;
            const labelsCopy = [...labels, labelOptions];
            setLabels(labelsCopy);

            setLabelOptions(defaultLabel);
        }
    };

    const closeDrawer = () => {
        onClose();
        setShowLabelForm(false);
        setColumnName('');
        setColumnType('');
        setLabels(defaultLabels);
        setLabelOptions(defaultLabel);
        setShowLabelForm(false);
        setShowReferenceForm(false);
    };

    const handleOnOpen = () => {
        if (columnType === 'label') {
            setShowLabelForm(true);
            if (column !== null) setLabels((column as any).labels);
        }
        if (column !== null) {
            setColumnName(column.name);

            if (column.type === 'label') {
                setShowLabelForm(true);
                setColumnType(column.type);
                setLabels((column as any).labels);
            }
        }
        onOpen();
    };

    const setAsDefault = (label: TLabel) => {
        const newLabels = labels.map((item: TLabel) => {
            if (item.default) {
                return { ...item, default: false };
            }
            if (item.title === label.title) {
                return { ...item, default: true };
            }
            return item;
        });
        setLabels(newLabels);
    };
    return (
        <>
            <Box>
                {column !== null ? (
                    <Box w={'100%'} textAlign={'left'} fontSize={'14px'} cursor={'pointer'} onClick={handleOnOpen}>
                        Update column
                    </Box>
                ) : (
                    <Button onClick={handleOnOpen} variant={'unstyled'}>
                        {column !== null ? 'Edit Column' : <BsPlusCircle size={'19px'} color={'gray'} />}
                    </Button>
                )}
            </Box>
            <PrimaryDrawer isOpen={isOpen} onClose={closeDrawer} title={column !== null ? 'Update existing column' : 'Create a new column'}>
                <Stack spacing="24px">
                    <Box>
                        <Flex>
                            <Text mb={'5px'}>Name</Text>
                            <Text ml={'8px'} pt={'2px'} fontSize={'14px'} color={'#e53e3e'}>
                                {!column && columnNameError ? '* Column already exists or name is empty.' : ''}
                            </Text>
                        </Flex>
                        <Input
                            // ref={firstField}
                            id="columnName"
                            name="columnName"
                            value={`${columnName.split('_').join(' ').slice(0, 1).toUpperCase()}${columnName.split('_').join(' ').slice(1)}`}
                            placeholder="Please enter column name"
                            onChange={handleColumnNameChange}
                            isInvalid={!column && columnNameError}
                        />
                    </Box>
                    {column ? null : (
                        <Box>
                            <Text mb={'5px'}>Type</Text>
                            <Select
                                id="columnType"
                                name="columnType"
                                value={columnType}
                                // defaultValue={columnType}
                                placeholder="Please select column type"
                                // onChange={(selectedOption: any) => handleSelectType(selectedOption)}
                                onChange={handleTypeChange}
                                // options={[
                                //     { value: 'text', label: 'Text' },
                                //     // { value: 'number', label: 'Number' },
                                //     { value: 'date', label: 'Date' },
                                //     { value: 'label', label: 'Label' },
                                //     { value: 'people', label: 'Assign To' },
                                //     { value: 'priority', label: 'Priority' },
                                //     { value: 'status', label: 'Status' },
                                //     { value: 'reference', label: 'Reference' },
                                //     // { value: 'upload', label: 'Uploads' },
                                //     // { value: 'link', label: 'Link' },
                                // ]}
                                // styles={
                                //     {
                                //         control: (styles: any) => {
                                //             return { ...styles, borderColor: '#e2e8f0' };
                                //         },
                                //     } as any
                                // }
                            >
                                <option value="text">Text</option>
                                <option value="number">Number</option>
                                <option value="date">Date</option>
                                <option value="label">Label</option>
                                <option value="people">People</option>
                                <option value="priority">Priority</option>
                                <option value="status">Status</option>
                                <option value="reference">Reference</option>
                            </Select>
                        </Box>
                    )}
                    {showLabelForm ? (
                        <>
                            <Divider gradient="radial-gradient(#eceef1 40%, white 60%)" marginBottom="0" marginTop="0" />
                            <Flex>
                                <Box mr={'20px'}>
                                    <HStack>
                                        <Text mb={'10px'}>Labels</Text>
                                        {labelTitleError ? (
                                            <Text mb={'5px'} color={'red'} fontSize={'sm'}>
                                                * Required
                                            </Text>
                                        ) : null}
                                    </HStack>
                                    <Input
                                        // ref={firstField}
                                        id="labelName"
                                        name="title"
                                        value={labelOptions.title}
                                        size={'sm'}
                                        placeholder="Please enter label name"
                                        onChange={handleLabelOptionsChange}
                                    />
                                </Box>
                                <Box mb={'10px'} pt={'32px'}>
                                    {/* <Text mb={"5px"}>Label color</Text> */}
                                    <HStack>
                                        <MdOutlineColorLens color={'rgb(123, 128, 154)'} />
                                        <Box pt={'5px'}>
                                            <input
                                                type={'color'}
                                                // ref={firstField}
                                                id="labelColor"
                                                name="color"
                                                height={'300px'}
                                                value={labelOptions.color}
                                                onChange={handleLabelOptionsChange}
                                            />
                                        </Box>
                                    </HStack>
                                </Box>
                                <Spacer />
                                <Box mt={'36px'}>
                                    <PrimaryButton onClick={addLabel} isDisabled={labelOptions.title == ''} size="sm">
                                        Add label
                                    </PrimaryButton>
                                </Box>
                            </Flex>
                            <Box>
                                {labels.map((label: TLabel, index: number) => {
                                    return (
                                        <Box key={index} bg={label.color} p={'5px'} m={'5px'}>
                                            <Flex>
                                                <Text mt={'5px'} mr={'10px'}>
                                                    <AiOutlineClose color={getTextColor(label.color)} onClick={() => removeLabel(label)} />
                                                </Text>
                                                <Text color={getTextColor(label.color)} fontWeight={'semibold'}>
                                                    {label.title}
                                                </Text>
                                                {label.default ? (
                                                    <Box pt={'4px'} ml={'16px'}>
                                                        <Text color={'white'} fontSize={'12px'}>
                                                            Default
                                                        </Text>
                                                    </Box>
                                                ) : null}
                                                <Spacer />
                                                {!label.default ? (
                                                    <Box p={'4px'}>
                                                        <Box
                                                            // py={'3px'}
                                                            px={'8px'}
                                                            _hover={{ cursor: 'pointer' }}
                                                            onClick={() => setAsDefault(label)}
                                                        >
                                                            <Text fontSize={'12px'} color={'white'}>
                                                                Set as default
                                                            </Text>
                                                        </Box>
                                                    </Box>
                                                ) : null}
                                                <Box px={'10px'}>
                                                    <Popover>
                                                        <PopoverTrigger>
                                                            <Box px={'10px'}>
                                                                <Text fontSize={'14px'} color={'white'} mt={'5px'}>
                                                                    <FaUserPlus />
                                                                </Text>
                                                            </Box>
                                                        </PopoverTrigger>
                                                        <PopoverContent>
                                                            <Box p={'12px'}>
                                                                <Text fontWeight={'semibold'} mb={'5px'}>
                                                                    Select users to notify
                                                                </Text>
                                                                <Stack>
                                                                    {workspaceUsers?.members.map((user) => {
                                                                        return (
                                                                            <Checkbox
                                                                                isChecked={label.users?.includes(user.email)}
                                                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                                                    if (event.target.checked) {
                                                                                        const newLabels = labels.map((item: TLabel) => {
                                                                                            if (item.title === label.title) {
                                                                                                if (item.users !== undefined) {
                                                                                                    return { ...item, users: [...item?.users, user.email] };
                                                                                                } else {
                                                                                                    return { ...item, users: [user.email] };
                                                                                                }
                                                                                            }
                                                                                            return item;
                                                                                        });
                                                                                        setLabels(newLabels);
                                                                                    } else {
                                                                                        const newLabels = labels.map((item: TLabel) => {
                                                                                            if (item.title === label.title) {
                                                                                                const newUsers = item.users?.filter((u: string) => {
                                                                                                    return u !== user.email;
                                                                                                });

                                                                                                return { ...item, users: newUsers };
                                                                                            }
                                                                                            return item;
                                                                                        });

                                                                                        setLabels(newLabels);
                                                                                    }
                                                                                }}
                                                                            >{`${user.firstname} ${user.lastname}`}</Checkbox>
                                                                        );
                                                                    })}
                                                                </Stack>
                                                            </Box>
                                                        </PopoverContent>
                                                    </Popover>
                                                </Box>
                                                <Box border={'2px solid lightgray'} w={'20px'} h={'20px'} mt={'2px'}>
                                                    <input
                                                        type={'color'}
                                                        value={label.color}
                                                        style={{ opacity: 0, display: 'block', width: '20px', height: '20px', border: 'none' }}
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                            const newLabels = labels.map((item: TLabel) => {
                                                                if (item.title === label.title) {
                                                                    return { ...item, color: event.target.value };
                                                                }
                                                                return item;
                                                            });

                                                            setLabels(newLabels);
                                                        }}
                                                    />
                                                </Box>
                                            </Flex>
                                        </Box>
                                    );
                                })}
                            </Box>
                        </>
                    ) : null}
                    {showReferenceForm ? (
                        <>
                            <ReactSelect
                                id="dataCollections"
                                name="dataCollections"
                                placeholder="Please select the data collection that will be referenced"
                                onChange={(selectedOption: any) => handleSelectDataCollection(selectedOption)}
                                options={dataCollections
                                    ?.map((dataCollection: any) => {
                                        return { value: dataCollection._id, label: dataCollection.name };
                                    })
                                    .filter((dataCollection: any) => {
                                        return dataCollection.value !== dataCollectionId;
                                    })}
                                styles={
                                    {
                                        control: (styles: any) => {
                                            return { ...styles, borderColor: '#e2e8f0' };
                                        },
                                    } as any
                                }
                            />
                            {showColumnNameSelection ? <ColumnSelection dataCollectionId={columnRef} handleSelectedColumn={handleSelectColumn} /> : null}
                        </>
                    ) : null}
                    {columnType === 'number' ? (
                        <Input
                            name={'prefix'}
                            value={prefix}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setPrefix(event.target.value);
                            }}
                        />
                    ) : null}
                </Stack>
                <Flex mt={'20px'}>
                    <Spacer />
                    {column !== null ? (
                        <PrimaryButton onClick={handleUpdateColumn} isDisabled={columnNameError || columnName == '' || columnIsUpdating}>
                            {columnIsUpdating ? <Spinner /> : 'UPDATE'}
                        </PrimaryButton>
                    ) : (
                        <PrimaryButton onClick={handleAddColumn} isDisabled={columnNameError || columnName == '' || columnIsUpdating}>
                            {columnIsUpdating ? <Spinner /> : 'SAVE'}
                        </PrimaryButton>
                    )}
                </Flex>
            </PrimaryDrawer>
        </>
    );
};

const ColumnSelection = ({ dataCollectionId, handleSelectedColumn }: { dataCollectionId: string; handleSelectedColumn: any }) => {
    const { data: columns } = useGetColumnsQuery(dataCollectionId);
    return (
        <>
            <ReactSelect
                id="dataCollections"
                name="dataCollections"
                placeholder="Please select the data collection that will be referenced"
                onChange={(selectedOption: any) => handleSelectedColumn(selectedOption)}
                options={
                    columns?.map((column: any) => {
                        return { value: column.name, label: column.name };
                    })
                    // .filter((dataCollection: any) => {
                    //     return dataCollection.value !== dataCollectionId;
                    // })
                }
                styles={
                    {
                        control: (styles: any) => {
                            return { ...styles, borderColor: '#e2e8f0' };
                        },
                    } as any
                }
            />
        </>
    );
};

export default CreateColumn;
