import { useEffect, useState } from 'react';
import {
    useAcknowledgeRowMutation,
    // useGetBlankRowsMutation,
    useGetColumnsQuery,
    useGetDataCollectionQuery,
    // useGetDataCollectionsQuery,
    useGetOneWorkspaceQuery,
    useGetRowsQuery,
    useGetUserGroupsQuery,
    useGetUserQuery,
    useSendFormMutation,
    useUpdateColumnMutation,
    useUpdateDataCollectionMutation,
    // useUpdateRowMutation,
    // useUpdateRowNoTagMutation,
} from '../../app/services/api';
import {
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    Center,
    Checkbox,
    Container,
    Divider,
    Flex,
    Heading,
    Input,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    // Modal,
    // ModalBody,
    // ModalCloseButton,
    // ModalContent,
    // ModalFooter,
    // ModalHeader,
    // ModalOverlay,
    Spacer,
    Text,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import Select from 'react-select';

import LinkItems from '../../utils/linkItems';

import SideBarLayout from '../../components/Layouts/SideBarLayout';
import DataCollection, { tableFontColor } from './DataCollection';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import PrimaryDrawer from '../../components/PrimaryDrawer';
import { cellColorStyles } from './select.styles';
import { TColumn } from '../../types';
import LinksMenu from './LinksMenu';
import { MdContentCopy } from 'react-icons/md';
import { ChevronDownIcon, CloseIcon, RepeatClockIcon } from '@chakra-ui/icons';
// import { CSVLink } from 'react-csv';
import { useTypedSelector } from '../../hooks/store';
// import { toggleShowDoneRows } from '../../components/table/tableSlice';
// import ImportDrawer from '../../components/table/ImportDrawer';
import { emptyDataCollectionPermissions, emptyPermissions } from '../workspaces/UserGroups';
import { io } from 'socket.io-client';

const ViewOne = () => {
    const { id, dataCollectionId } = useParams();
    const [queryParameters] = useSearchParams();
    const { pathname } = useLocation(); // Pathname is used to append /form the current pathname
    // const dispatch = useAppDispatch();

    // const { onClose, onOpen, isOpen } = useDisclosure(); // For template modal
    const { onClose: onCloseFormDrawer, onOpen: _onOpenFormDrawer, isOpen: isOpenFormDrawer } = useDisclosure(); // For form modal
    const toast = useToast();

    const { data: user } = useGetUserQuery(localStorage.getItem('userId') || '');
    const { data: workspace, isFetching: workspaceIsFetching } = useGetOneWorkspaceQuery(localStorage.getItem('workspaceId') || '');
    const { data: dataCollection } = useGetDataCollectionQuery(dataCollectionId || '');

    const {
        data: rowsData,
        refetch,
        // isFetching: rowsAreFetching,
        // isLoading: rowsAreLoading,
    } = useGetRowsQuery({ dataCollectionId: dataCollectionId || '', limit: 0, skip: 0, sort: 1, sortBy: 'createdAt' });

    // const { data: dataCollections } = useGetDataCollectionsQuery(null);
    const { data: columnsData } = useGetColumnsQuery(localStorage.getItem('dataCollectionId') || '');
    const [updateColumn] = useUpdateColumnMutation();
    // const [updateRow] = useUpdateRowMutation();
    // const [updatedRowNoTag] = useUpdateRowNoTagMutation();
    // const [getBlankRows] = useGetBlankRowsMutation();

    const [updateDataCollection] = useUpdateDataCollectionMutation();
    const [sendForm] = useSendFormMutation();
    const [showArchived, setShowArchived] = useState(false);

    const [columns, setColumns] = useState(columnsData);

    const [acknowledgeRow] = useAcknowledgeRowMutation();

    // const [templateNameValue, setTemplateNameValue] = useState<string>('');

    // const [existingTemplateNames, setExistingTemplateNames] = useState<string[]>([]);
    // const [templateExists, setTemplateExists] = useState<boolean>(false);

    const [recipientValue, setRecipientValue] = useState<string>('');

    const [_valuesForExport, setValuesForExport] = useState<any>('');

    /**
     * Socket.io listening for update to refetch data
     */
    useEffect(() => {
        const socket = io(import.meta.env.VITE_API_URL);
        socket.connect();

        socket.on('notify', (data) => {
            if (data.allAssigneeIds.includes(localStorage.getItem('userId'))) {
                if (data.event.actionBy._id !== localStorage.getItem('userId') && data.event.workspace === localStorage.getItem('workspaceId')) {
                    toast({
                        title: `Update`,
                        description: data.event.message,
                        duration: 10000,
                        status: 'info',
                        isClosable: true,
                        position: 'bottom-right',
                    });
                }
            }
        });

        socket.on(`mqtt/${id}`, () => {
            refetch();
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const { data: userGroups, refetch: refetchUserGroups } = useGetUserGroupsQuery(null);
    const [_userGroup, setUserGroup] = useState({ name: '', workspace: '', permissions: emptyPermissions });
    const [dataCollectionPermissions, setDataCollectionPermissions] = useState(emptyDataCollectionPermissions);

    useEffect(() => {
        if (userGroups !== undefined) {
            // Find the user group that the current user is in
            const ug = userGroups?.find((item: any) => {
                return item.users.includes(localStorage.getItem('userId'));
            });

            let dcPermissions;
            if (ug !== undefined) {
                // Find the current data collection being viewed
                dcPermissions = ug.permissions.dataCollections.find((item: any) => {
                    return item.dataCollection === dataCollectionId;
                });

                if (dcPermissions !== undefined) {
                    // Set the user group and data collection
                    setUserGroup(ug);
                    setDataCollectionPermissions(dcPermissions.permissions);
                } else {
                    refetch();
                }
            } else {
                refetch();
            }
        } else {
            refetch();
        }
    }, [userGroups]);

    // Checkboxes for selecting columns for form
    const [checkBoxes, setCheckBoxes] = useState<any>(
        Array(columns?.length)
            .fill(null)
            .map((_: any) => {
                return true;
            })
    );

    // Redux state that toggles done rows
    const showDoneRows = useTypedSelector((state: any) => {
        return state.table.showDoneRows;
    });

    const [_permissions, setPermissions] = useState<number>();

    useEffect(() => {
        getPermissions();
    }, [user]);

    /**
     * Goes through each of the current user's workspaces
     * And if the workspace matches the currently selected workspace
     * The permissions of that workspace are set
     */
    const getPermissions = () => {
        for (const workspace of user?.workspaces || []) {
            if (workspace.id == localStorage.getItem('workspaceId')) {
                setPermissions(workspace.permissions);
            }
        }
    };

    useEffect(() => {
        setColumns(columnsData);
    }, [columnsData]);

    /**
     * Set the columns that are included in the form
     */
    useEffect(() => {
        setCheckBoxes(
            Array(columns?.length)
                .fill(null)
                .map((_: any, index: number) => {
                    const columnsCopy: any = columns;
                    const column: any = columnsCopy !== undefined ? columnsCopy[index] : {};
                    return column.includeInForm;
                })
        );
    }, [columns]);

    /**
     * Set workspace and data collection ids in local storage in case this is being redirected
     * and not set from the workspaces page
     */
    useEffect(() => {
        localStorage.setItem('workspaceId', id || '');
        localStorage.setItem('dataCollectionId', dataCollectionId || '');
    }, [dataCollection]);

    /**
     * Get all the data collection template names to avoid creating duplicates
     */
    // useEffect(() => {
    //     const templateNames = [];
    //     for (const dataCollection of dataCollections || []) {
    //         if (dataCollection.asTemplate !== undefined && dataCollection.asTemplate.active) {
    //             templateNames.push(dataCollection.asTemplate.name.toLowerCase());
    //         }
    //     }
    //     setExistingTemplateNames(templateNames);
    // }, [dataCollections]);

    /**
     * Set the row being acknowledged through email link
     */
    useEffect(() => {
        const acknowledgedRowId = queryParameters.get('acknowledgedRow');
        if (acknowledgedRowId && acknowledgedRowId !== undefined) {
            acknowledgeRow(acknowledgedRowId || '');
        }
    }, [queryParameters]);

    /**
     * Sets up values for export
     */
    useEffect(() => {
        const setupValues: any = [];
        const valsForExport: any = [];
        const rowsCopy: any = rowsData;
        const columnsCopy: any = columnsData;

        if (columnsCopy !== undefined) {
            const key: any = columnsCopy[0].name;
            for (const row of rowsCopy || []) {
                let values: any = {};

                for (const column of columnsCopy || []) {
                    if (!column.isEmpty) {
                        if (column?.type === 'reference') {
                            if (row.refs !== undefined && row.refs[column?.name] !== undefined) {
                                const refs: any = row.refs[column?.name];
                                let refsString = '';
                                if (refs) {
                                    for (const ref of refs) {
                                        refsString += `${ref.values[key]} `;
                                    }
                                    values[column?.name] = refsString;
                                }
                            } else {
                                values[column?.name] = '';
                            }
                        } else {
                            if (row.values && row.values[column?.name] !== undefined) {
                                values[column?.name] = row.values[column?.name];
                            }
                        }
                    }
                }

                setupValues.push(values);
            }

            for (const values of setupValues) {
                let hasValues = false;
                for (const key in values) {
                    if (values[key] !== '') hasValues = true;
                }

                if (hasValues) valsForExport.push(values);
            }
            setValuesForExport(valsForExport);
        }
    }, [rowsData, columnsData]);

    /**
     * Creates template based on the current data collection
     */
    // const handleAddAsTemplateClick = () => {
    //     if (templateNameValue === '') return;
    //     const dataCollectionCopy: any = dataCollection;
    //     updateDataCollection({
    //         ...dataCollectionCopy,
    //         asTemplate: { active: true, name: templateNameValue },
    //     });
    //     // onClose();

    //     toast({
    //         title: `Your template has been created.`,
    //         description: `Click "NEW COLLECTION" in the Data Collections page and select "${templateNameValue}" in the template dropdown to use this template.`,
    //         status: 'info',
    //         duration: 9000,
    //         isClosable: true,
    //     });
    // };

    /**
     * Sends form invite via email
     */
    const handleAddRecipientClick = () => {
        const dataCollectionCopy: any = dataCollection;
        const formRecipientsCopy: any = dataCollection?.formRecipients;

        sendForm({ email: recipientValue });

        updateDataCollection({
            ...dataCollectionCopy,
            formRecipients: [...formRecipientsCopy, { email: recipientValue, sent: false }],
        });

        setRecipientValue('');
    };

    /**
     * Removes a form recipient from the send form list
     * @param formRecipient
     */
    const handleDeleteRecipientClick = (formRecipient: any) => {
        const dataCollectionCopy: any = dataCollection;
        const formRecipientsCopy: any = dataCollection?.formRecipients;

        const filteredFormRecipients = formRecipientsCopy.filter((item: any) => {
            return item.email !== formRecipient.email;
        });

        updateDataCollection({
            ...dataCollectionCopy,
            formRecipients: filteredFormRecipients,
        });
    };

    /**
     * Handles the import rows click
     * @param array
     */
    // const handleImportRows = async (array: any) => {
    //     let numberOfRowsToCreate = 0;
    //     if (rowsData !== undefined) {
    //         if (rowsData?.length < array.length) {
    //             numberOfRowsToCreate = array.length - rowsData?.length + 10;
    //         }
    //         const blankRowsRes: any = await getBlankRows({ numberOfRowsToCreate: numberOfRowsToCreate, dataCollectionId });
    //         const blankRows = blankRowsRes.data;

    //         const newRows = [...rowsData, ...blankRows];

    //         const filledRows = newRows.map((item: TRow, index: number) => {
    //             try {
    //                 return { ...item, isEmpty: false, values: array[index] };
    //             } catch (error) {
    //                 return item;
    //             }
    //         });

    //         for (const row of filledRows) {
    //             await updateRow(row);
    //         }

    //         await refetch();
    //     }
    // };

    return (
        <>
            <SideBarLayout linkItems={LinkItems}>
                <Box>
                    <Container maxW={'full'} mt={{ base: 4, sm: 0 }} p={1}>
                        {/* 
                            This is the card that contains the entire data collection information
                        */}
                        <Card w={'100%'}>
                            <CardHeader>
                                {/* 
                                        Data collection header
                                    */}
                                <Flex>
                                    <Box color={tableFontColor}>
                                        <Heading fontSize={'20px'} mt={'5px'} mb={'4px'} fontWeight={'semibold'}>
                                            {!workspaceIsFetching ? `${workspace?.name} - ${dataCollection?.name}` : null}
                                        </Heading>
                                        <Text fontSize={'sm'}>{dataCollection?.description}</Text>
                                    </Box>
                                    <Spacer />
                                    {/* 
                                        Options dropdown
                                    */}
                                    <Box>
                                        {dataCollectionPermissions.dataCollection.view ? (
                                            <Menu>
                                                <MenuButton
                                                    as={Button}
                                                    size={'sm'}
                                                    // fontSize={'13px'}
                                                    rightIcon={<ChevronDownIcon />}
                                                    w={'100px'}
                                                    bgColor={'#24a2f0'}
                                                    color={'white'}
                                                    _hover={{
                                                        boxShadow: 'lg',
                                                    }}
                                                    _active={{ bgColor: '#24a2f0' }}
                                                >
                                                    <Text fontSize={'13px'}>Options</Text>
                                                </MenuButton>
                                                <MenuList>
                                                    {/* <MenuItem fontSize={'14px'} onClick={onOpenFormDrawer}>
                                                        Form
                                                    </MenuItem>
                                                    <MenuItem fontSize={'14px'}>
                                                        <CSVLink data={valuesForExport}>Export</CSVLink>
                                                    </MenuItem>
                                                    <MenuItem fontSize={'14px'}>
                                                        <ImportDrawer
                                                            columns={columnsData}
                                                            handleImportRows={handleImportRows}
                                                            isFetching={rowsAreFetching}
                                                            isLoading={rowsAreLoading}
                                                        />
                                                    </MenuItem> */}
                                                    <MenuItem
                                                        fontSize={'14px'}
                                                        icon={<RepeatClockIcon />}
                                                        onClick={() => {
                                                            setShowArchived(!showArchived);
                                                        }}
                                                    >
                                                        {showArchived ? 'Hide archived' : 'Show archived'}
                                                    </MenuItem>
                                                </MenuList>
                                            </Menu>
                                        ) : null}
                                    </Box>
                                </Flex>
                            </CardHeader>
                            {/* 
                                The actual data collection table
                            */}
                            <CardBody p={'0'}>
                                {dataCollectionPermissions.dataCollection.view ? (
                                    <>
                                        {!showArchived ? (
                                            <DataCollection
                                                showDoneRows={showDoneRows}
                                                rowsProp={rowsData}
                                                dataCollectionPermissions={dataCollectionPermissions}
                                                refetchPermissions={refetchUserGroups}
                                                refetchRows={refetch}
                                            />
                                        ) : (
                                            <ArchivedDataCollection
                                                dataCollectionPermissions={dataCollectionPermissions}
                                                refetchUserGroups={refetchUserGroups}
                                            />
                                        )}
                                    </>
                                ) : (
                                    <Box mb={'20px'}>
                                        <Center>
                                            <Text>No access to this data collection.</Text>
                                        </Center>
                                    </Box>
                                )}
                            </CardBody>
                        </Card>{' '}
                        {/* This is the end of the card that contains the data collection */}
                    </Container>
                </Box>

                {/* ***************** TEMPLATE MODAL ******************** */}
                {/* <Modal isOpen={isOpen} onClose={onClose} size={'2xl'}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Create template</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Text mb={'30px'}>
                                Creating a template will allow you to create a data collection with the same columns. After naming and creating it, go to create
                                a new data collection and your new template will be available under the template options.
                            </Text>
                            <Text mb={'5px'}>Template Name</Text>
                            <Input
                                value={templateNameValue}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    if (existingTemplateNames.includes(event.target.value.toLowerCase())) {
                                        setTemplateExists(true);
                                    } else {
                                        setTemplateExists(false);
                                    }
                                    setTemplateNameValue(event.target.value);
                                }}
                            />
                            <Box h={'15px'}>{templateExists ? <Text color={'red'}>A template with that name already exists.</Text> : null}</Box>
                        </ModalBody>

                        <ModalFooter>
                            <PrimaryButton onClick={handleAddAsTemplateClick} isDisabled={templateExists}>
                                CREATE
                            </PrimaryButton>
                        </ModalFooter>
                    </ModalContent>
                </Modal> */}

                {/* ******************* FORM DRAWER *************************** */}
                <PrimaryDrawer title={`${dataCollection?.name} Form`} isOpen={isOpenFormDrawer} onClose={onCloseFormDrawer} size="full">
                    <Box w={{ md: '100%', lg: '50%' }} float={{ lg: 'left' }} pr={{ lg: '20px' }}>
                        <Text fontSize={'14px'} mb={'5px'}>
                            Form link
                        </Text>
                        <Box p={'10px'} h={'44px'} border={'1px solid #e2e8f0'} mb={'20px'}>
                            <Flex>
                                <Box overflow={'hidden'} h={'20px'} mr={'10px'} textOverflow={'ellipsis'}>
                                    <Text fontSize={'14px'} overflow={'hidden'} textOverflow={'ellipsis'}>
                                        <a
                                            href={`${import.meta.env.VITE_HOST_URL}${pathname}/form`}
                                            target="_blank"
                                            style={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >{`${import.meta.env.VITE_HOST_URL}${pathname}/form`}</a>
                                    </Text>
                                </Box>
                                <Box
                                    pt={'3px'}
                                    cursor={'pointer'}
                                    onClick={() => {
                                        navigator.clipboard.writeText(`${import.meta.env.VITE_HOST_URL}${pathname}/form`);
                                        toast({
                                            title: `Copied to clipboard`,
                                            position: 'top-right',
                                            status: 'info',
                                        });
                                    }}
                                >
                                    <MdContentCopy />
                                </Box>
                            </Flex>
                        </Box>
                        <Box>
                            <Text fontSize={'14px'}>Send by email</Text>
                            <Flex mt={'5px'}>
                                <Box mr={'5px'} w={'100%'}>
                                    <Input
                                        value={recipientValue}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setRecipientValue(event.target.value)}
                                    />
                                </Box>
                                <PrimaryButton onClick={handleAddRecipientClick}>ADD</PrimaryButton>
                            </Flex>
                        </Box>
                        <Box mt={'20px'}>
                            {(dataCollection?.formRecipients?.length || 0) > 0 ? (
                                dataCollection?.formRecipients?.map((formRecipient: any, index: number) => {
                                    return (
                                        <Box key={index}>
                                            <Flex>
                                                <Text
                                                    fontSize={'12px'}
                                                    pt={'4px'}
                                                    mr={'10px'}
                                                    onClick={() => handleDeleteRecipientClick(formRecipient)}
                                                    cursor={'pointer'}
                                                >
                                                    <CloseIcon />
                                                </Text>
                                                <Text>{formRecipient.email}</Text>
                                            </Flex>
                                        </Box>
                                    );
                                })
                            ) : (
                                <Text>No Recipients</Text>
                            )}
                        </Box>
                    </Box>
                    <Box w={{ md: '100%', lg: '50%' }} float={{ lg: 'right' }} pl={{ lg: '20px' }}>
                        <Box>
                            <Box mb={'20px'} fontSize={'14px'}>
                                <Text>This form is not functional and only used to dispaly the form elements.</Text>
                                <Text>Checkmark all the form elements to include in the form.</Text>
                            </Box>

                            <Box>
                                {columns?.map((column: TColumn, index: number) => {
                                    if (column.isEmpty) return null;
                                    let bgColor: string = '';
                                    const labels: any = column?.labels || [];
                                    const label: any = labels[0] || null;
                                    bgColor = label ? label.color : '';

                                    const options: any = column.labels?.map((item) => {
                                        return {
                                            value: item.title,
                                            label: item.title,
                                            color: item.color,
                                        };
                                    });
                                    const peopleOptions: any = column.people?.map((item) => {
                                        return {
                                            value: item._id,
                                            label: `${item.firstname} ${item.lastname}`,
                                            color: '#ffffff',
                                        };
                                    });
                                    let option = options[0];

                                    return (
                                        <Box mb={'20px'} key={index}>
                                            <Divider mb={'25px'} mt={'10px'} />
                                            <Flex>
                                                <Text mb={'6px'}>{(column.name[0].toUpperCase() + column.name.slice(1)).split('_').join(' ')}</Text>
                                                <Spacer />
                                                <Checkbox
                                                    mb={'6px'}
                                                    isChecked={checkBoxes[index]}
                                                    onChange={() => {
                                                        setCheckBoxes((prev: any) =>
                                                            prev.map((checkBox: boolean, checkboxIndex: number) => {
                                                                if (index === checkboxIndex) return !checkBox;
                                                                return checkBox;
                                                            })
                                                        );
                                                        updateColumn({
                                                            ...column,
                                                            includeInForm: !column.includeInForm,
                                                        });
                                                    }}
                                                />
                                            </Flex>
                                            {column.type === 'label' || column.type === 'priority' || column.type === 'status' ? (
                                                <Box w={'100%'}>
                                                    <Select
                                                        options={options}
                                                        styles={cellColorStyles({
                                                            bgColor,
                                                            padding: '7px',
                                                        })}
                                                        defaultValue={option}
                                                    />
                                                </Box>
                                            ) : column.type === 'people' ? (
                                                <Select
                                                    options={peopleOptions}
                                                    styles={cellColorStyles({
                                                        bgColor: '#ffffff',
                                                        padding: '7px',
                                                        border: '1px solid #e2e8f0',
                                                    })}
                                                />
                                            ) : column.type === 'date' ? (
                                                <input
                                                    type="datetime-local"
                                                    style={{
                                                        border: '1px solid #e2e8f0',
                                                        borderRadius: '5px',
                                                        width: '100%',
                                                        padding: '6px',
                                                    }}
                                                    name={column.name}
                                                />
                                            ) : column.type === 'number' ? (
                                                <input
                                                    type="number"
                                                    name={column.name}
                                                    style={{
                                                        outline: 'none',
                                                        paddingLeft: '15px',
                                                        paddingTop: '6px',
                                                        paddingBottom: '6px',
                                                        border: '1px solid #e2e8f0',
                                                        borderRadius: '5px',
                                                        width: '100%',
                                                    }}
                                                />
                                            ) : column.type === 'upload' ? (
                                                <Box></Box>
                                            ) : column.type === 'link' ? (
                                                <Box>
                                                    <LinksMenu topPadding="7px" border={true} />
                                                </Box>
                                            ) : (
                                                <Input
                                                    value={''}
                                                    size={'md'}
                                                    w={'100%'}
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                        event;
                                                    }}
                                                />
                                            )}
                                        </Box>
                                    );
                                })}
                            </Box>
                        </Box>
                    </Box>
                </PrimaryDrawer>
            </SideBarLayout>
        </>
    );
};

const ArchivedDataCollection = ({ dataCollectionPermissions, refetchUserGroups }: { dataCollectionPermissions: any; refetchUserGroups: any }) => {
    const { dataCollectionId } = useParams();
    const {
        data: rowsData,
        refetch: archivedRefetch,
        // isFetching: archivedRowsAreFetching,
        // isLoading: archivedRowsAreLoading,
    } = useGetRowsQuery({ dataCollectionId: dataCollectionId || '', limit: 0, skip: 0, sort: 1, sortBy: 'createdAt', archived: true });

    useEffect(() => {
        archivedRefetch();
    }, []);
    return (
        <DataCollection
            showDoneRows={true}
            rowsProp={rowsData}
            dataCollectionPermissions={dataCollectionPermissions}
            refetchPermissions={refetchUserGroups}
            isArchives={true}
            refetchRows={archivedRefetch}
        />
    );
};

export default ViewOne;
