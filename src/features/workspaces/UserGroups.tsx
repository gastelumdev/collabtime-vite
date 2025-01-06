import {
    Box,
    Button,
    Card,
    CardBody,
    Checkbox,
    Flex,
    Input,
    MenuItem,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    Spacer,
    Stack,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useDisclosure,
} from '@chakra-ui/react';
import PrimaryDrawer from '../../components/PrimaryDrawer';
import {
    useCreateUserGroupMutation,
    useDeleteUserGroupMutation,
    useGetAllWorkspaceUsersQuery,
    useGetDataCollectionsQuery,
    useGetDataCollectionViewsQuery,
    useGetUserGroupsQuery,
    useUpdateUserGroupMutation,
} from '../../app/services/api';
import { useEffect, useState } from 'react';
import PrimaryButton from '../../components/Buttons/PrimaryButton';

const w = '80vw';
export const allPrivileges = {
    workspace: { view: true, create: true, update: true, delete: true, invite: true, tag: true, userGroups: true },
    dataCollectionActions: { view: true, create: true, update: true, delete: true, tag: true },
    viewActions: { view: true, create: true, update: true, delete: true },
    dataCollections: [],
    views: [],
    docs: { view: true, create: true, update: true, delete: true, tag: true },
    chat: { view: true, create: true },
};
export const emptyPermissions = {
    workspace: { view: true, create: false, update: false, delete: false, invite: false, tag: false, userGroups: false },
    dataCollectionActions: { view: false, create: false, update: false, delete: false, tag: false },
    viewActions: { view: false, create: false, update: false, delete: false },
    dataCollections: [],
    views: [],
    docs: { view: false, create: false, update: false, delete: false, tag: false },
    chat: { view: false, create: false },
};

export const emptyDataCollectionPermissions = {
    dataCollection: { view: false, update: false, delete: false, tag: false },
    rows: { reorder: false, create: false, delete: false, subrows: false },
    columnActions: { reorder: false, create: false, update: false, delete: false, resize: false },
    notes: { view: false, create: false },
    reminders: { view: false },
    docs: { view: false, create: false, update: false, delete: false },
    columns: [],
};

export const emptyViewPermissions = {
    view: { view: false, update: false, delete: false },
    rows: { reorder: false, create: false, delete: false, subrows: false },
    columnActions: { reorder: false, create: false, update: false, delete: false, resize: false },
    notes: { view: false, create: false },
    reminders: { view: false },
    docs: { view: false, create: false, update: false, delete: false },
    columns: [],
};

export const emptyColumnPermissions = {
    column: { view: false, update: false, delete: false, reorder: false, resize: false },
    labels: [],
};

const UserGroups = () => {
    const { onOpen, onClose, isOpen } = useDisclosure();

    const { data: userGroups } = useGetUserGroupsQuery(null);
    const [createUserGroup] = useCreateUserGroupMutation();
    const [updateUserGroup] = useUpdateUserGroupMutation();

    const { data: dataCollections } = useGetDataCollectionsQuery(null);
    const { data: views } = useGetDataCollectionViewsQuery(null);

    const [activeButtonName, setActiveButtonName] = useState('Create');
    const [allIsChecked, setAllIsChecked] = useState(false);
    const [currentPermissions, setCurrentPermissions] = useState(emptyPermissions);
    const [currentDataCollectionPermissions, setCurrentDataCollectionPermissions] = useState({
        dataCollection: '',
        name: '',
        permissions: emptyDataCollectionPermissions,
    });
    const [currentViewPermissions, setCurrentViewPermissions] = useState({ dataCollection: '', view: '', name: '', permissions: emptyViewPermissions });
    const [columns, setColumns] = useState([]);
    const [viewColumns, setViewColumns] = useState([]);
    const [currentColumnPermissions, setCurrentColumnPermissions] = useState({ column: '', name: '', permissions: emptyColumnPermissions });
    const [currentViewColumnPermissions, setCurrentViewColumnPermissions] = useState({ column: '', name: '', permissions: emptyColumnPermissions });
    const [allWorkspaceChecked, setAllWorkspaceChecked] = useState(false);
    const [newUserGroupName, setNewUserGroupName] = useState('');
    const [formError, setFormError] = useState(true);
    const [nameError, setNameError] = useState(false);

    const [allViewsColumns, setAllViewsColumns] = useState([]);
    const [labels, setLabels] = useState([]);
    // const [chosenLabels, setChosenLabels] = useState([]);

    useEffect(
        () => {
            // console.log({ views });
            // console.log({ userGroups });
            // console.log({ currentPermissions });
            // console.log({ currentDataCollectionPermissions });
            // console.log({ currentColumnPermissions });
            // console.log({ columns });
            // console.log({ currentViewPermissions });
            // console.log({ currentViewColumnPermissions });
            // console.log({ viewColumns });
        },
        [
            // userGroups,
            // currentPermissions,
            // currentDataCollectionPermissions,
            // currentColumnPermissions,
            // columns,
            // currentViewPermissions,
            // currentViewColumnPermissions,
            // viewColumns,
        ]
    );

    useEffect(() => {
        if (views !== undefined) {
            let viewsColumns: any = [];

            for (const view of views) {
                for (const col of view.columns) {
                    viewsColumns.push(col);
                }
            }

            // console.log(viewsColumns);
            setAllViewsColumns(viewsColumns);
        }
    }, [views]);

    useEffect(() => {
        console.log('Use Effect executed');
        const column: any = allViewsColumns.find((item: any) => {
            return item?._id === currentViewColumnPermissions.column;
        });
        if (column !== undefined) {
            if (['label', 'status'].includes(column.type)) {
                setLabels(column.labels);
            } else {
                setLabels([]);
            }
        }
    }, [currentViewColumnPermissions]);

    useEffect(() => {
        if (activeButtonName === 'Create' && userGroups !== undefined) {
            console.log('Create is active');
            console.log({ userGroups });
            // Find the first user group
            const userGroup: any = userGroups?.find((_ug: any) => {
                return true;
            });
            // Get the different data collection permissions
            const dataCollections = userGroup?.permissions.dataCollections;
            // Set up data collection permissions
            const emptyDataCollections = dataCollections?.map((dc: any) => {
                const columns = dc.permissions.columns;

                const newColumns = columns.map((col: any) => {
                    return { ...col, permissions: emptyColumnPermissions };
                });
                return { ...dc, permissions: { ...emptyDataCollectionPermissions, columns: newColumns } };
            });

            // setCurrentPermissions({ ...currentPermissions, dataCollections: emptyDataCollections });

            const dc = dataCollections?.find((_dc: any) => {
                return true;
            });

            setCurrentDataCollectionPermissions(emptyDataCollections[0]);

            const firstColumn = dc?.permissions.columns.find((_col: any) => {
                return true;
            });

            const newCurrentColumn = { ...firstColumn, permissions: emptyColumnPermissions };

            setCurrentColumnPermissions(newCurrentColumn);

            setColumns(
                dc?.permissions.columns.map((col: any) => {
                    return { ...col, permissions: emptyColumnPermissions };
                })
            );

            const views = userGroup?.permissions.views;

            const emptyViews = views?.map((v: any) => {
                const columns = v.permissions.columns;

                const newColumns = columns.map((col: any) => {
                    return { ...col, permissions: emptyColumnPermissions };
                });
                return { ...v, permissions: { ...emptyViewPermissions, columns: newColumns } };
            });

            const v = views?.find((_v: any) => {
                return true;
            });

            setCurrentViewPermissions(emptyViews[0]);

            const firstViewColumn = v?.permissions.columns.find((_col: any) => {
                return true;
            });

            const newCurrentViewColumn = { ...firstViewColumn, permissions: emptyColumnPermissions };
            setCurrentViewColumnPermissions(newCurrentViewColumn);

            setViewColumns(
                v?.permissions.columns.map((view: any) => {
                    return { ...view, permissions: emptyColumnPermissions };
                })
            );

            setCurrentPermissions({ ...currentPermissions, dataCollections: emptyDataCollections, views: emptyViews });
        }
    }, [userGroups, activeButtonName]);

    useEffect(() => {
        if (currentPermissions.workspace.view && activeButtonName !== '') {
            setFormError(false);
        } else {
            setFormError(true);
        }
    }, [formError, activeButtonName, currentPermissions]);

    const handleCheckAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setCurrentPermissions((prev) => ({
                ...allPrivileges,
                dataCollections: prev.dataCollections,
                views: prev.views,
            }));
            handleUpdateUserGroup({ ...allPrivileges, dataCollections: currentPermissions.dataCollections, views: currentPermissions.views });
        } else {
            setCurrentPermissions((prev) => ({
                ...emptyPermissions,
                dataCollections: prev.dataCollections,
                views: prev.views,
            }));
            handleUpdateUserGroup({ ...emptyPermissions, dataCollections: currentPermissions.dataCollections, views: currentPermissions.views });
        }
        setAllWorkspaceChecked(event.target.checked);
    };

    const handleWorkspaceCheck = (permissionName: string, value: string) => {
        setCurrentPermissions((prev) => ({
            ...prev,
            workspace: { ...prev.workspace, [permissionName]: !value },
        }));

        handleUpdateUserGroup({ ...currentPermissions, workspace: { ...currentPermissions.workspace, [permissionName]: !value } });
    };

    const handleDataCollectionActionsCheck = (permissionName: string, value: string) => {
        setCurrentPermissions((prev) => ({
            ...prev,
            dataCollectionActions: { ...prev.dataCollectionActions, [permissionName]: !value },
        }));

        handleUpdateUserGroup({ ...currentPermissions, dataCollectionActions: { ...currentPermissions.dataCollectionActions, [permissionName]: !value } });
    };

    const handleviewActionsCheck = (permissionName: string, value: string) => {
        setCurrentPermissions((prev) => ({
            ...prev,
            viewActions: { ...prev.viewActions, [permissionName]: !value },
        }));

        handleUpdateUserGroup({ ...currentPermissions, viewActions: { ...currentPermissions.viewActions, [permissionName]: !value } });
    };

    const handleDocsCheck = (permissionName: string, value: string) => {
        setCurrentPermissions((prev) => ({
            ...prev,
            docs: { ...prev.docs, [permissionName]: !value },
        }));

        handleUpdateUserGroup({ ...currentPermissions, docs: { ...currentPermissions.docs, [permissionName]: !value } });
    };

    const handleChatCheck = (permissionName: string, value: string) => {
        setCurrentPermissions((prev) => ({
            ...prev,
            chat: { ...prev.chat, [permissionName]: !value },
        }));

        handleUpdateUserGroup({ ...currentPermissions, chat: { ...currentPermissions.chat, [permissionName]: !value } });
    };

    const handleDataCollectionCheck = (dataCollectionId: string, type: string, permissionName: string, value: string) => {
        const newCurrentDataCollectionPermissions: any = {
            ...currentDataCollectionPermissions,
            permissions: {
                ...currentDataCollectionPermissions.permissions,
                [type]: {
                    ...currentDataCollectionPermissions.permissions[type as keyof typeof currentDataCollectionPermissions.permissions],
                    [permissionName]: !value,
                },
            },
        };

        setCurrentDataCollectionPermissions(newCurrentDataCollectionPermissions);

        const newCurrentDataCollections: any = currentPermissions.dataCollections.map((dc: any) => {
            if (dc.dataCollection === dataCollectionId) {
                return newCurrentDataCollectionPermissions;
            }
            return dc;
        });

        setCurrentPermissions((prev) => ({
            ...prev,
            dataCollections: newCurrentDataCollections,
        }));

        if (activeButtonName !== 'Create') {
            handleUpdateUserGroup({ ...currentPermissions, dataCollections: newCurrentDataCollections });
        }
    };

    const handleViewCheck = (viewId: string, type: string, permissionName: string, value: string) => {
        const newCurrentViewPermissions: any = {
            ...currentViewPermissions,
            permissions: {
                ...currentViewPermissions.permissions,
                [type]: {
                    ...currentViewPermissions.permissions[type as keyof typeof currentViewPermissions.permissions],
                    [permissionName]: !value,
                },
            },
        };

        setCurrentViewPermissions(newCurrentViewPermissions);

        const newCurrentViews: any = currentPermissions.views.map((v: any) => {
            if (v.view === viewId) {
                return newCurrentViewPermissions;
            }
            return v;
        });

        setCurrentPermissions((prev) => ({
            ...prev,
            views: newCurrentViews,
        }));

        handleUpdateUserGroup({ ...currentPermissions, views: newCurrentViews });
    };

    const handleColumnRowsCheck = (permissionName: string, value: string) => {
        const newCurrentColumnsPermissions = {
            ...currentColumnPermissions,
            permissions: {
                column: { ...currentColumnPermissions.permissions.column, [permissionName]: !value },
                labels: [...currentColumnPermissions.permissions.labels],
            },
        };

        setCurrentColumnPermissions(newCurrentColumnsPermissions);

        const newColumns = currentDataCollectionPermissions.permissions.columns.map((col: any) => {
            if (col.column === currentColumnPermissions.column) {
                return newCurrentColumnsPermissions;
            }
            return col;
        });

        const newCurrentDataCollectionPermissions: any = {
            ...currentDataCollectionPermissions,
            permissions: { ...currentDataCollectionPermissions.permissions, columns: newColumns },
        };

        setCurrentDataCollectionPermissions(newCurrentDataCollectionPermissions);

        const newCurrentDataCollections: any = currentPermissions.dataCollections.map((dc: any) => {
            if (dc.dataCollection === newCurrentDataCollectionPermissions.dataCollection) {
                return newCurrentDataCollectionPermissions;
            }
            return dc;
        });

        const newCurrentPermissions = { ...currentPermissions, dataCollections: newCurrentDataCollections };
        setCurrentPermissions(newCurrentPermissions);

        handleUpdateUserGroup(newCurrentPermissions);
    };

    const handleViewColumnRowsCheck = (permissionName: string, value: string) => {
        const newCurrentViewColumnsPermissions = {
            ...currentViewColumnPermissions,
            permissions: {
                column: { ...currentViewColumnPermissions.permissions.column, [permissionName]: !value },
                labels: [...currentViewColumnPermissions.permissions.labels],
            },
        };

        setCurrentViewColumnPermissions(newCurrentViewColumnsPermissions);

        const newColumns = currentViewPermissions.permissions.columns.map((col: any) => {
            if (col.column === currentViewColumnPermissions.column) {
                return newCurrentViewColumnsPermissions;
            }
            return col;
        });

        const newCurrentViewPermissions: any = {
            ...currentViewPermissions,
            permissions: { ...currentViewPermissions.permissions, columns: newColumns },
        };

        setCurrentViewPermissions(newCurrentViewPermissions);

        const newCurrentViews: any = currentPermissions.views.map((v: any) => {
            if (v.view === newCurrentViewPermissions.view) {
                return newCurrentViewPermissions;
            }
            return v;
        });

        const newCurrentPermissions = { ...currentPermissions, views: newCurrentViews };
        setCurrentPermissions(newCurrentPermissions);

        handleUpdateUserGroup(newCurrentPermissions);
    };

    const handleViewColumnLabelsCheck = (labelTitle: never, permissionLabels: any) => {
        let newPermissions: any;
        if (permissionLabels.includes(labelTitle as never)) {
            const filteredLabels: never[] = permissionLabels.filter((item: any) => {
                return item !== labelTitle;
            });

            newPermissions = {
                ...currentViewColumnPermissions,
                permissions: {
                    ...currentViewColumnPermissions.permissions,
                    labels: [...filteredLabels],
                },
            };
            setCurrentViewColumnPermissions(newPermissions);
        } else {
            newPermissions = {
                ...currentViewColumnPermissions,
                permissions: {
                    ...currentViewColumnPermissions.permissions,
                    labels: [...(currentViewColumnPermissions.permissions.labels as never), labelTitle as never],
                },
            };
            setCurrentViewColumnPermissions(newPermissions);
        }

        const newColumns = currentViewPermissions.permissions.columns.map((col: any) => {
            if (col.column === currentViewColumnPermissions.column) {
                return newPermissions;
            }
            return col;
        });

        const newCurrentViewPermissions: any = {
            ...currentViewPermissions,
            permissions: { ...currentViewPermissions.permissions, columns: newColumns },
        };

        setCurrentViewPermissions(newCurrentViewPermissions);

        const newCurrentViews: any = currentPermissions.views.map((v: any) => {
            if (v.view === newCurrentViewPermissions.view) {
                return newCurrentViewPermissions;
            }
            return v;
        });

        const newCurrentPermissions = { ...currentPermissions, views: newCurrentViews };
        setCurrentPermissions(newCurrentPermissions);

        handleUpdateUserGroup(newCurrentPermissions);
    };

    const resetPermissions = () => {
        setActiveButtonName('Create');
        setCurrentPermissions(emptyPermissions);
        setAllIsChecked(false);
        setAllWorkspaceChecked(false);
        setCurrentDataCollectionPermissions({
            dataCollection: '',
            name: '',
            permissions: emptyDataCollectionPermissions,
        });
        setCurrentColumnPermissions({ column: '', name: '', permissions: emptyColumnPermissions });
        setNewUserGroupName('');
    };

    const handleUpdateUserGroup = (newCurrentPermissions: any) => {
        const userGroup = userGroups.find((item: any) => {
            return item.name === activeButtonName;
        });

        const newUserGroup = { ...userGroup, permissions: { ...newCurrentPermissions } };

        updateUserGroup(newUserGroup);
    };

    return (
        <>
            <MenuItem onClick={onOpen}>User Groups</MenuItem>
            <PrimaryDrawer
                onClose={onClose}
                isOpen={isOpen}
                title={
                    <Box>
                        <Flex>
                            <Text>User Groups</Text>
                            <Spacer />
                            <Box mr={'40px'}>
                                {activeButtonName === 'Create' ? (
                                    <PrimaryButton
                                        onClick={() => {
                                            createUserGroup({
                                                name: newUserGroupName,
                                                workspace: localStorage.getItem('workspaceId'),
                                                permissions: currentPermissions,
                                                users: [],
                                            });
                                            resetPermissions();
                                        }}
                                        size="sm"
                                        isDisabled={formError || nameError || newUserGroupName === ''}
                                    >
                                        Save
                                    </PrimaryButton>
                                ) : null}
                            </Box>
                        </Flex>
                    </Box>
                }
                size="full"
            >
                <Flex>
                    <DrawerColumn w={'200px'} title="User Groups">
                        <Button
                            colorScheme="blue"
                            w={'160px'}
                            fontSize={'12px'}
                            size={'xs'}
                            mb={'20px'}
                            isActive={activeButtonName === 'Create'}
                            onClick={resetPermissions}
                        >
                            <Text>Create User Group</Text>
                        </Button>
                        <Box fontSize={'14px'}>
                            {userGroups?.map((userGroup: any) => {
                                return (
                                    <Box key={userGroup.name}>
                                        <Button
                                            w={'160px'}
                                            size={'xs'}
                                            mb={'5px'}
                                            colorScheme="blue"
                                            isActive={activeButtonName === userGroup.name}
                                            onClick={() => {
                                                setActiveButtonName(userGroup.name);
                                                setCurrentPermissions(userGroup.permissions);
                                                setCurrentDataCollectionPermissions(userGroup.permissions.dataCollections[0]);
                                                setCurrentColumnPermissions(userGroup.permissions.dataCollections[0].permissions.columns[0]);
                                                setCurrentViewPermissions(userGroup.permissions.views[0]);
                                                setCurrentViewColumnPermissions(userGroup.permissions.views[0].permissions.columns[0]);

                                                if (userGroup.name === 'All Privileges') {
                                                    setAllIsChecked(true);
                                                } else {
                                                    setAllIsChecked(false);
                                                }
                                            }}
                                        >
                                            <Text>{userGroup.name}</Text>
                                        </Button>
                                    </Box>
                                );
                            })}
                        </Box>
                        <Box>
                            <Users />
                        </Box>
                    </DrawerColumn>
                    <Flex>
                        <Box>
                            <DrawerColumn w={w} title={'User Group Name'}>
                                <Flex>
                                    <Box>
                                        <Box mb={'12px'} fontSize={'12px'}>
                                            {activeButtonName === 'Create' ? (
                                                <Text>
                                                    Create an new user group by entering a name and selecting the actions the users withing this group are
                                                    allowed to perform and then click save.
                                                </Text>
                                            ) : (
                                                <Text>
                                                    Toggle the actions the users withing this group are allowed to perform. Changes are automatically saved.
                                                </Text>
                                            )}
                                        </Box>
                                        <Text fontSize={'14px'}>{activeButtonName === 'Create' ? 'User Group Name' : activeButtonName}</Text>
                                        {activeButtonName == 'Create' ? (
                                            <>
                                                <Input
                                                    w={'300px'}
                                                    size={'sm'}
                                                    placeholder="Enter user group name"
                                                    value={newUserGroupName}
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                        const userGroup = userGroups.find((item: any) => {
                                                            return item.name === event.target.value;
                                                        });

                                                        if (userGroup !== undefined) {
                                                            setNameError(true);
                                                        } else {
                                                            setNameError(false);
                                                        }

                                                        if (event.target.value === '') {
                                                            setNameError(true);
                                                        }
                                                        setNewUserGroupName(event.target.value);
                                                    }}
                                                    isInvalid={nameError}
                                                    errorBorderColor="red.300"
                                                />
                                            </>
                                        ) : null}
                                        <Text color="red" fontSize={'12px'} visibility={nameError ? 'visible' : 'hidden'}>
                                            {newUserGroupName === '' && nameError
                                                ? `User group name cannot be empty`
                                                : `A user group named ${newUserGroupName} already exists.`}
                                        </Text>
                                    </Box>
                                    <Spacer />
                                    {activeButtonName !== 'Create' ? (
                                        <Box>
                                            {!['All Privileges', 'View Only', 'No Access'].includes(activeButtonName) ? (
                                                <DeleteModal
                                                    userGroup={
                                                        userGroups.find((userGroup: any) => {
                                                            return userGroup.name === activeButtonName;
                                                        }) || {}
                                                    }
                                                    resetPermissions={resetPermissions}
                                                />
                                            ) : null}
                                        </Box>
                                    ) : null}
                                </Flex>
                            </DrawerColumn>

                            <DrawerColumn w={w} title="Workspace">
                                <Flex>
                                    <Box mr={'60px'}>
                                        <Text fontSize={'18px'} mb={'20px'}>
                                            Workspace
                                        </Text>
                                        <Stack mt={1} spacing={1}>
                                            <CheckboxOption text={'All'} isChecked={allWorkspaceChecked || allIsChecked} onChange={handleCheckAll} />
                                            {/* WORKSPACE CHECKMARKS */}
                                            {Object.keys(currentPermissions.workspace).map((permissionName: string) => {
                                                const value: any = currentPermissions.workspace[permissionName as keyof typeof currentPermissions.workspace];
                                                return (
                                                    <CheckboxOption
                                                        key={permissionName}
                                                        text={`${permissionName[0].toUpperCase()}${permissionName.slice(1)}`}
                                                        isChecked={value}
                                                        onChange={() => handleWorkspaceCheck(permissionName, value)}
                                                    />
                                                );
                                            })}
                                        </Stack>
                                    </Box>
                                    <Box mr={'60px'}>
                                        <Text fontSize={'18px'} mb={'20px'}>
                                            Data Collections
                                        </Text>
                                        <Stack mt={1} spacing={1}>
                                            {Object.keys(currentPermissions.dataCollectionActions).map((permissionName: string) => {
                                                const value: any =
                                                    currentPermissions.dataCollectionActions[
                                                        permissionName as keyof typeof currentPermissions.dataCollectionActions
                                                    ];
                                                return (
                                                    <CheckboxOption
                                                        key={permissionName}
                                                        text={`${permissionName[0].toUpperCase()}${permissionName.slice(1)}`}
                                                        isChecked={value}
                                                        onChange={() => handleDataCollectionActionsCheck(permissionName, value)}
                                                    />
                                                );
                                            })}
                                        </Stack>
                                    </Box>
                                    <Box mr={'60px'}>
                                        <Text fontSize={'18px'} mb={'20px'}>
                                            Views
                                        </Text>
                                        <Stack mt={1} spacing={1}>
                                            {Object.keys(currentPermissions.viewActions).map((permissionName: string) => {
                                                const value: any =
                                                    currentPermissions.viewActions[permissionName as keyof typeof currentPermissions.viewActions];
                                                return (
                                                    <CheckboxOption
                                                        key={permissionName}
                                                        text={`${permissionName[0].toUpperCase()}${permissionName.slice(1)}`}
                                                        isChecked={value}
                                                        onChange={() => handleviewActionsCheck(permissionName, value)}
                                                    />
                                                );
                                            })}
                                        </Stack>
                                    </Box>
                                    <Box mr={'60px'}>
                                        <Text fontSize={'18px'} mb={'20px'}>
                                            Docs
                                        </Text>
                                        <Stack mt={1} spacing={1}>
                                            {Object.keys(currentPermissions.docs).map((permissionName: string) => {
                                                const value: any = currentPermissions.docs[permissionName as keyof typeof currentPermissions.docs];
                                                return (
                                                    <CheckboxOption
                                                        key={permissionName}
                                                        text={`${permissionName[0].toUpperCase()}${permissionName.slice(1)}`}
                                                        isChecked={value}
                                                        onChange={() => handleDocsCheck(permissionName, value)}
                                                    />
                                                );
                                            })}
                                        </Stack>
                                    </Box>
                                    <Box mr={'60px'}>
                                        <Text fontSize={'18px'} mb={'20px'}>
                                            Chat
                                        </Text>
                                        <Stack mt={1} spacing={1}>
                                            {Object.keys(currentPermissions.chat).map((permissionName: string) => {
                                                const value: any = currentPermissions.chat[permissionName as keyof typeof currentPermissions.chat];
                                                return (
                                                    <CheckboxOption
                                                        key={permissionName}
                                                        text={`${permissionName[0].toUpperCase()}${permissionName.slice(1)}`}
                                                        isChecked={value}
                                                        onChange={() => handleChatCheck(permissionName, value)}
                                                    />
                                                );
                                            })}
                                        </Stack>
                                    </Box>
                                </Flex>
                            </DrawerColumn>
                            {/* **********************************************************************************************************
                             *************************************************************************************************************
                             *************************************************************************************************************
                             *************************************************************************************************************
                             *************************************************************************************************************
                             *************************************************************************************************************
                             ********************* DATA COLLECTIONS
                             */}
                            {currentPermissions?.dataCollections.length > 0 ? (
                                <DrawerColumn w={w} title="Data Collections">
                                    <Text fontSize={'18px'} mb={'20px'}>
                                        Data Collections
                                    </Text>

                                    <Box w={'300px'} mb={'20px'}>
                                        <Select
                                            size={'sm'}
                                            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                                                const dataCollectionPermissions: any = currentPermissions?.dataCollections.find((dc: any) => {
                                                    return dc.name === event.target.value;
                                                });
                                                setCurrentDataCollectionPermissions(dataCollectionPermissions);
                                                setCurrentColumnPermissions(dataCollectionPermissions.permissions.columns[0]);
                                                setColumns(dataCollectionPermissions.permissions.columns);
                                            }}
                                        >
                                            {activeButtonName === 'Create'
                                                ? dataCollections?.map((dataCollection: any) => {
                                                      if (!dataCollection.main) {
                                                          return null;
                                                      }
                                                      return (
                                                          <option key={dataCollection.name} value={dataCollection.name}>
                                                              {dataCollection.name}
                                                          </option>
                                                      );
                                                  })
                                                : currentPermissions?.dataCollections.map((dataCollection: any) => {
                                                      return (
                                                          <option key={dataCollection.name} value={dataCollection.name}>
                                                              {dataCollection.name}
                                                          </option>
                                                      );
                                                  })}
                                        </Select>
                                    </Box>
                                    <Flex>
                                        <Box mr={'60px'}>
                                            <Text fontSize={'18px'} mb={'20px'}>
                                                Data Collection
                                            </Text>
                                            <Stack mt={1} spacing={1}>
                                                {Object.keys(currentDataCollectionPermissions.permissions.dataCollection).map((permissionName: string) => {
                                                    // const value: any = currentPermissions.chat[permissionName as keyof typeof currentPermissions.chat];
                                                    const value: any =
                                                        currentDataCollectionPermissions.permissions.dataCollection[
                                                            permissionName as keyof typeof currentDataCollectionPermissions.permissions.dataCollection
                                                        ];
                                                    return (
                                                        <CheckboxOption
                                                            key={permissionName}
                                                            text={`${permissionName[0].toUpperCase()}${permissionName.slice(1)}`}
                                                            isChecked={value}
                                                            onChange={() =>
                                                                handleDataCollectionCheck(
                                                                    currentDataCollectionPermissions.dataCollection,
                                                                    'dataCollection',
                                                                    permissionName,
                                                                    value
                                                                )
                                                            }
                                                        />
                                                    );
                                                })}
                                            </Stack>
                                        </Box>
                                        <Box mr={'60px'}>
                                            <Text fontSize={'18px'} mb={'20px'}>
                                                Rows
                                            </Text>
                                            <Stack mt={1} spacing={1}>
                                                {Object.keys(currentDataCollectionPermissions.permissions.rows).map((permissionName: string) => {
                                                    // const value: any = currentPermissions.chat[permissionName as keyof typeof currentPermissions.chat];
                                                    const value: any =
                                                        currentDataCollectionPermissions.permissions.rows[
                                                            permissionName as keyof typeof currentDataCollectionPermissions.permissions.rows
                                                        ];
                                                    return (
                                                        <CheckboxOption
                                                            key={permissionName}
                                                            text={`${permissionName[0].toUpperCase()}${permissionName.slice(1)}`}
                                                            isChecked={value}
                                                            onChange={() =>
                                                                handleDataCollectionCheck(
                                                                    currentDataCollectionPermissions.dataCollection,
                                                                    'rows',
                                                                    permissionName,
                                                                    value
                                                                )
                                                            }
                                                        />
                                                    );
                                                })}
                                            </Stack>
                                        </Box>
                                        <Box mr={'60px'}>
                                            <Text fontSize={'18px'} mb={'20px'}>
                                                Columns
                                            </Text>
                                            <Stack mt={1} spacing={1}>
                                                {Object.keys(currentDataCollectionPermissions.permissions.columnActions).map((permissionName: string) => {
                                                    // const value: any = currentPermissions.chat[permissionName as keyof typeof currentPermissions.chat];
                                                    const value: any =
                                                        currentDataCollectionPermissions.permissions.columnActions[
                                                            permissionName as keyof typeof currentDataCollectionPermissions.permissions.columnActions
                                                        ];
                                                    return (
                                                        <CheckboxOption
                                                            key={permissionName}
                                                            text={`${permissionName[0].toUpperCase()}${permissionName.slice(1)}`}
                                                            isChecked={value}
                                                            onChange={() =>
                                                                handleDataCollectionCheck(
                                                                    currentDataCollectionPermissions.dataCollection,
                                                                    'columnActions',
                                                                    permissionName,
                                                                    value
                                                                )
                                                            }
                                                        />
                                                    );
                                                })}
                                            </Stack>
                                        </Box>
                                        <Box mr={'60px'}>
                                            <Text fontSize={'18px'} mb={'20px'}>
                                                Notes
                                            </Text>
                                            <Stack mt={1} spacing={1}>
                                                {Object.keys(currentDataCollectionPermissions.permissions.notes).map((permissionName: string) => {
                                                    // const value: any = currentPermissions.chat[permissionName as keyof typeof currentPermissions.chat];
                                                    const value: any =
                                                        currentDataCollectionPermissions.permissions.notes[
                                                            permissionName as keyof typeof currentDataCollectionPermissions.permissions.notes
                                                        ];
                                                    return (
                                                        <CheckboxOption
                                                            key={permissionName}
                                                            text={`${permissionName[0].toUpperCase()}${permissionName.slice(1)}`}
                                                            isChecked={value}
                                                            onChange={() =>
                                                                handleDataCollectionCheck(
                                                                    currentDataCollectionPermissions.dataCollection,
                                                                    'notes',
                                                                    permissionName,
                                                                    value
                                                                )
                                                            }
                                                        />
                                                    );
                                                })}
                                            </Stack>
                                        </Box>
                                        <Box mr={'60px'}>
                                            <Text fontSize={'18px'} mb={'20px'}>
                                                Reminders
                                            </Text>
                                            <Stack mt={1} spacing={1}>
                                                {Object.keys(currentDataCollectionPermissions.permissions.reminders).map((permissionName: string) => {
                                                    // const value: any = currentPermissions.chat[permissionName as keyof typeof currentPermissions.chat];
                                                    const value: any =
                                                        currentDataCollectionPermissions.permissions.reminders[
                                                            permissionName as keyof typeof currentDataCollectionPermissions.permissions.reminders
                                                        ];
                                                    return (
                                                        <CheckboxOption
                                                            key={permissionName}
                                                            text={`${permissionName[0].toUpperCase()}${permissionName.slice(1)}`}
                                                            isChecked={value}
                                                            onChange={() =>
                                                                handleDataCollectionCheck(
                                                                    currentDataCollectionPermissions.dataCollection,
                                                                    'reminders',
                                                                    permissionName,
                                                                    value
                                                                )
                                                            }
                                                        />
                                                    );
                                                })}
                                            </Stack>
                                        </Box>
                                        <Box mr={'60px'}>
                                            <Text fontSize={'18px'} mb={'20px'}>
                                                Upload
                                            </Text>
                                            <Stack mt={1} spacing={1}>
                                                {Object.keys(currentDataCollectionPermissions.permissions.docs).map((permissionName: string) => {
                                                    // const value: any = currentPermissions.chat[permissionName as keyof typeof currentPermissions.chat];
                                                    const value: any =
                                                        currentDataCollectionPermissions.permissions.docs[
                                                            permissionName as keyof typeof currentDataCollectionPermissions.permissions.docs
                                                        ];
                                                    return (
                                                        <CheckboxOption
                                                            key={permissionName}
                                                            text={`${permissionName[0].toUpperCase()}${permissionName.slice(1)}`}
                                                            isChecked={value}
                                                            onChange={() =>
                                                                handleDataCollectionCheck(
                                                                    currentDataCollectionPermissions.dataCollection,
                                                                    'docs',
                                                                    permissionName,
                                                                    value
                                                                )
                                                            }
                                                        />
                                                    );
                                                })}
                                            </Stack>
                                        </Box>
                                    </Flex>
                                    <Box w={'300px'} mb={'20px'} mt={'30px'}>
                                        <Text fontSize={'18px'} mb={'20px'}>
                                            Columns
                                        </Text>
                                        <Select
                                            size={'sm'}
                                            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                                                const columnPermissions: any = currentDataCollectionPermissions?.permissions.columns.find((col: any) => {
                                                    return col.name === event.target.value;
                                                });
                                                setCurrentColumnPermissions(columnPermissions);
                                            }}
                                            value={currentColumnPermissions.name}
                                        >
                                            {activeButtonName === 'Create'
                                                ? columns?.map((column: any) => {
                                                      return (
                                                          <option key={column.name} value={column.name}>
                                                              {`${column.name[0].toUpperCase()}${column.name.slice(1)}`.split('_').join(' ')}
                                                          </option>
                                                      );
                                                  })
                                                : currentDataCollectionPermissions?.permissions.columns.map((column: any) => {
                                                      return (
                                                          <option key={column.name} value={column.name}>
                                                              {`${column.name[0].toUpperCase()}${column.name.slice(1)}`.split('_').join(' ')}
                                                          </option>
                                                      );
                                                  })}
                                        </Select>
                                    </Box>
                                    <Flex>
                                        <Box mr={'60px'}>
                                            <Text fontSize={'18px'} mb={'20px'}>
                                                Columns
                                            </Text>
                                            <Stack mt={1} spacing={1}>
                                                {Object.keys(currentColumnPermissions.permissions.column).map((permissionName: string) => {
                                                    // const value: any = currentPermissions.chat[permissionName as keyof typeof currentPermissions.chat];
                                                    const value: any =
                                                        currentColumnPermissions.permissions.column[
                                                            permissionName as keyof typeof currentColumnPermissions.permissions.column
                                                        ];
                                                    return (
                                                        <CheckboxOption
                                                            key={permissionName}
                                                            text={`${permissionName[0].toUpperCase()}${permissionName.slice(1)}`}
                                                            isChecked={value}
                                                            onChange={() => handleColumnRowsCheck(permissionName, value)}
                                                        />
                                                    );
                                                })}
                                            </Stack>
                                        </Box>
                                    </Flex>
                                </DrawerColumn>
                            ) : null}
                            {/* **********************************************************************************************************
                             *************************************************************************************************************
                             *************************************************************************************************************
                             *************************************************************************************************************
                             *************************************************************************************************************
                             *************************************************************************************************************
                             ********************* VIEWS
                             */}
                            {currentPermissions?.views.length > 0 ? (
                                <DrawerColumn w={w} title="Views">
                                    <Text fontSize={'18px'} mb={'20px'}>
                                        Views
                                    </Text>

                                    <Box w={'300px'} mb={'20px'}>
                                        <Select
                                            size={'sm'}
                                            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                                                console.log(currentPermissions);
                                                const viewPermissions: any = currentPermissions?.views.find((v: any) => {
                                                    console.log(v.name, event.target.value);
                                                    return v.name === event.target.value;
                                                });
                                                console.log(viewPermissions);
                                                setCurrentViewPermissions(viewPermissions);
                                                setCurrentViewColumnPermissions(viewPermissions.permissions.columns[0]);
                                                setViewColumns(viewPermissions.permissions.columns);
                                            }}
                                        >
                                            {activeButtonName === 'Create'
                                                ? views?.map((view: any) => {
                                                      return (
                                                          <option key={view.name} value={view.name}>
                                                              {view.name}
                                                          </option>
                                                      );
                                                  })
                                                : currentPermissions?.views.map((view: any) => {
                                                      return (
                                                          <option key={view.name} value={view.name}>
                                                              {view.name}
                                                          </option>
                                                      );
                                                  })}
                                        </Select>
                                    </Box>
                                    <Flex>
                                        <Box mr={'60px'}>
                                            <Text fontSize={'18px'} mb={'20px'}>
                                                View
                                            </Text>
                                            <Stack mt={1} spacing={1}>
                                                {Object.keys(currentViewPermissions.permissions.view).map((permissionName: string) => {
                                                    // const value: any = currentPermissions.chat[permissionName as keyof typeof currentPermissions.chat];
                                                    const value: any =
                                                        currentViewPermissions.permissions.view[
                                                            permissionName as keyof typeof currentViewPermissions.permissions.view
                                                        ];
                                                    return (
                                                        <CheckboxOption
                                                            key={permissionName}
                                                            text={`${permissionName[0].toUpperCase()}${permissionName.slice(1)}`}
                                                            isChecked={value}
                                                            onChange={() => handleViewCheck(currentViewPermissions.view, 'view', permissionName, value)}
                                                        />
                                                    );
                                                })}
                                            </Stack>
                                        </Box>
                                        <Box mr={'60px'}>
                                            <Text fontSize={'18px'} mb={'20px'}>
                                                Rows
                                            </Text>
                                            <Stack mt={1} spacing={1}>
                                                {Object.keys(currentViewPermissions.permissions.rows).map((permissionName: string) => {
                                                    // const value: any = currentPermissions.chat[permissionName as keyof typeof currentPermissions.chat];
                                                    const value: any =
                                                        currentViewPermissions.permissions.rows[
                                                            permissionName as keyof typeof currentViewPermissions.permissions.rows
                                                        ];
                                                    return (
                                                        <CheckboxOption
                                                            key={permissionName}
                                                            text={`${permissionName[0].toUpperCase()}${permissionName.slice(1)}`}
                                                            isChecked={value}
                                                            onChange={() => handleViewCheck(currentViewPermissions.view, 'rows', permissionName, value)}
                                                        />
                                                    );
                                                })}
                                            </Stack>
                                        </Box>
                                        <Box mr={'60px'}>
                                            <Text fontSize={'18px'} mb={'20px'}>
                                                Columns
                                            </Text>
                                            <Stack mt={1} spacing={1}>
                                                {Object.keys(currentViewPermissions.permissions.columnActions).map((permissionName: string) => {
                                                    // const value: any = currentPermissions.chat[permissionName as keyof typeof currentPermissions.chat];
                                                    const value: any =
                                                        currentViewPermissions.permissions.columnActions[
                                                            permissionName as keyof typeof currentViewPermissions.permissions.columnActions
                                                        ];
                                                    return (
                                                        <CheckboxOption
                                                            key={permissionName}
                                                            text={`${permissionName[0].toUpperCase()}${permissionName.slice(1)}`}
                                                            isChecked={value}
                                                            onChange={() =>
                                                                handleViewCheck(currentViewPermissions.view, 'columnActions', permissionName, value)
                                                            }
                                                        />
                                                    );
                                                })}
                                            </Stack>
                                        </Box>
                                        <Box mr={'60px'}>
                                            <Text fontSize={'18px'} mb={'20px'}>
                                                Notes
                                            </Text>
                                            <Stack mt={1} spacing={1}>
                                                {Object.keys(currentViewPermissions.permissions.notes).map((permissionName: string) => {
                                                    // const value: any = currentPermissions.chat[permissionName as keyof typeof currentPermissions.chat];
                                                    const value: any =
                                                        currentViewPermissions.permissions.notes[
                                                            permissionName as keyof typeof currentViewPermissions.permissions.notes
                                                        ];
                                                    return (
                                                        <CheckboxOption
                                                            key={permissionName}
                                                            text={`${permissionName[0].toUpperCase()}${permissionName.slice(1)}`}
                                                            isChecked={value}
                                                            onChange={() => handleViewCheck(currentViewPermissions.view, 'notes', permissionName, value)}
                                                        />
                                                    );
                                                })}
                                            </Stack>
                                        </Box>
                                        <Box mr={'60px'}>
                                            <Text fontSize={'18px'} mb={'20px'}>
                                                Reminders
                                            </Text>
                                            <Stack mt={1} spacing={1}>
                                                {Object.keys(currentViewPermissions.permissions.reminders).map((permissionName: string) => {
                                                    // const value: any = currentPermissions.chat[permissionName as keyof typeof currentPermissions.chat];
                                                    const value: any =
                                                        currentViewPermissions.permissions.reminders[
                                                            permissionName as keyof typeof currentViewPermissions.permissions.reminders
                                                        ];
                                                    return (
                                                        <CheckboxOption
                                                            key={permissionName}
                                                            text={`${permissionName[0].toUpperCase()}${permissionName.slice(1)}`}
                                                            isChecked={value}
                                                            onChange={() => handleViewCheck(currentViewPermissions.view, 'reminders', permissionName, value)}
                                                        />
                                                    );
                                                })}
                                            </Stack>
                                        </Box>
                                        <Box mr={'60px'}>
                                            <Text fontSize={'18px'} mb={'20px'}>
                                                Upload
                                            </Text>
                                            <Stack mt={1} spacing={1}>
                                                {Object.keys(currentViewPermissions.permissions.docs).map((permissionName: string) => {
                                                    // const value: any = currentPermissions.chat[permissionName as keyof typeof currentPermissions.chat];
                                                    const value: any =
                                                        currentViewPermissions.permissions.docs[
                                                            permissionName as keyof typeof currentViewPermissions.permissions.docs
                                                        ];
                                                    return (
                                                        <CheckboxOption
                                                            key={permissionName}
                                                            text={`${permissionName[0].toUpperCase()}${permissionName.slice(1)}`}
                                                            isChecked={value}
                                                            onChange={() => handleViewCheck(currentViewPermissions.view, 'docs', permissionName, value)}
                                                        />
                                                    );
                                                })}
                                            </Stack>
                                        </Box>
                                    </Flex>
                                    <Box w={'300px'} mb={'20px'} mt={'30px'}>
                                        <Text fontSize={'18px'} mb={'20px'}>
                                            Columns
                                        </Text>
                                        <Select
                                            size={'sm'}
                                            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                                                const columnPermissions: any = currentViewPermissions?.permissions.columns.find((col: any) => {
                                                    return col.name === event.target.value;
                                                });
                                                setCurrentViewColumnPermissions(columnPermissions);
                                            }}
                                            value={currentViewColumnPermissions.name}
                                        >
                                            {activeButtonName === 'Create'
                                                ? viewColumns?.map((column: any) => {
                                                      return (
                                                          <option key={column.name} value={column.name}>
                                                              {`${column.name[0].toUpperCase()}${column.name.slice(1)}`.split('_').join(' ')}
                                                          </option>
                                                      );
                                                  })
                                                : currentViewPermissions?.permissions.columns.map((column: any) => {
                                                      return (
                                                          <option key={column.name} value={column.name}>
                                                              {`${column.name[0].toUpperCase()}${column.name.slice(1)}`.split('_').join(' ')}
                                                          </option>
                                                      );
                                                  })}
                                        </Select>
                                    </Box>
                                    <Flex>
                                        <Box mr={'60px'}>
                                            <Text fontSize={'18px'} mb={'20px'}>
                                                Columns
                                            </Text>

                                            <Stack mt={1} spacing={1}>
                                                {Object.keys(currentViewColumnPermissions.permissions.column || {}).map((permissionName: string) => {
                                                    // const value: any = currentPermissions.chat[permissionName as keyof typeof currentPermissions.chat];
                                                    const value: any =
                                                        currentViewColumnPermissions.permissions.column[
                                                            permissionName as keyof typeof currentViewColumnPermissions.permissions.column
                                                        ];
                                                    return (
                                                        <CheckboxOption
                                                            key={permissionName}
                                                            text={`${permissionName[0].toUpperCase()}${permissionName.slice(1)}`}
                                                            isChecked={value}
                                                            onChange={() => handleViewColumnRowsCheck(permissionName, value)}
                                                        />
                                                    );
                                                })}
                                            </Stack>
                                        </Box>
                                        <Box mr={'60px'}>
                                            {labels.length > 0 ? (
                                                <Text fontSize={'18px'} mb={'20px'}>
                                                    Columns
                                                </Text>
                                            ) : null}

                                            <Stack mt={1} spacing={1}>
                                                {labels.length > 0
                                                    ? labels.map((label: any) => {
                                                          const labelTitle: string = label.title;
                                                          const permissionLabels: never[] = currentViewColumnPermissions.permissions.labels;
                                                          return (
                                                              <CheckboxOption
                                                                  key={label.title}
                                                                  text={label.title}
                                                                  isChecked={permissionLabels.includes(labelTitle as never)}
                                                                  onChange={() => handleViewColumnLabelsCheck(labelTitle as never, permissionLabels)}
                                                              />
                                                          );
                                                      })
                                                    : null}
                                                {/* {Object.keys(currentViewColumnPermissions.permissions.column || {}).map((permissionName: string) => {
                                                    // const value: any = currentPermissions.chat[permissionName as keyof typeof currentPermissions.chat];
                                                    const value: any =
                                                        currentViewColumnPermissions.permissions.column[
                                                            permissionName as keyof typeof currentViewColumnPermissions.permissions.column
                                                        ];
                                                    return (
                                                        <CheckboxOption
                                                            key={permissionName}
                                                            text={`${permissionName[0].toUpperCase()}${permissionName.slice(1)}`}
                                                            isChecked={value}
                                                            onChange={() => handleViewColumnRowsCheck(permissionName, value)}
                                                        />
                                                    );
                                                })} */}
                                            </Stack>
                                        </Box>
                                    </Flex>
                                    <Flex mt={'20px'}>
                                        <Spacer />
                                        <Box>
                                            {activeButtonName === 'Create' ? (
                                                <PrimaryButton
                                                    onClick={() => {
                                                        document.getElementById('scroller')?.scroll(0, 0);
                                                        createUserGroup({
                                                            name: newUserGroupName,
                                                            workspace: localStorage.getItem('workspaceId'),
                                                            permissions: currentPermissions,
                                                            users: [],
                                                        });
                                                        resetPermissions();
                                                    }}
                                                    isDisabled={formError}
                                                >
                                                    Save
                                                </PrimaryButton>
                                            ) : null}
                                        </Box>
                                    </Flex>
                                </DrawerColumn>
                            ) : null}
                        </Box>
                    </Flex>
                </Flex>
            </PrimaryDrawer>
        </>
    );
};

const DrawerColumn = ({ w, children }: { w: string; title: string; children: any }) => {
    return (
        <Box w={w} mx={'5px'} mb={'10px'}>
            <Card boxShadow={'none'} border={'1px solid #e4e5e6'}>
                <CardBody>
                    <Box>{children}</Box>
                </CardBody>
            </Card>
        </Box>
    );
};

const CheckboxOption = ({ text, onChange, isChecked = false }: { text: string; onChange?: any; isChecked?: boolean }) => {
    return (
        <Checkbox
            spacing={'12px'}
            isChecked={isChecked}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                onChange(event);
            }}
        >
            <Text fontSize={'15px'}>{text}</Text>
        </Checkbox>
    );
};

const DeleteModal = ({ userGroup, resetPermissions }: { userGroup: any; resetPermissions: any }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [deleteUserGroup] = useDeleteUserGroupMutation();
    return (
        <>
            <Button size={'sm'} onClick={onOpen}>
                Delete
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{`Delete ${userGroup.name}?`}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>{`This delete action cannot be undone. Are you sure you want to delete the "${userGroup.name}" user group?`}</ModalBody>

                    <ModalFooter>
                        <Button
                            variant="outline"
                            colorScheme="red"
                            onClick={() => {
                                deleteUserGroup(userGroup._id);
                                resetPermissions();
                                onClose();
                            }}
                        >
                            Delete
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

const Users = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { data: users } = useGetAllWorkspaceUsersQuery(null);
    const { data: userGroups } = useGetUserGroupsQuery(null);
    const [updateUserGroup] = useUpdateUserGroupMutation();

    const handleOnChange = (event: React.ChangeEvent<HTMLSelectElement>, user: any) => {
        const userGroupId = event.target.value;

        const selectedUserGroup = userGroups.find((item: any) => {
            return item._id === userGroupId;
        });

        if (selectedUserGroup !== undefined) {
            const newSelectedUserGroup = { ...selectedUserGroup, users: [...selectedUserGroup.users, user._id] };

            updateUserGroup(newSelectedUserGroup);
        }

        const originalUserGroup = userGroups.find((item: any) => {
            return item.users.includes(user._id);
        });

        if (originalUserGroup !== undefined) {
            const newOriginalUserGroup = {
                ...originalUserGroup,
                users: originalUserGroup.users.filter((item: any) => {
                    console.log(item);
                    return item !== user._id;
                }),
            };

            updateUserGroup(newOriginalUserGroup);
        }
    };
    return (
        <Box>
            <Button w={'160px'} size={'xs'} mb={'5px'} colorScheme="blue" mt={'20px'} onClick={onOpen}>
                Users
            </Button>
            <PrimaryDrawer onClose={onClose} isOpen={isOpen} title={'Users'} size="full">
                <TableContainer>
                    <Table variant={'simple'} size={'sm'}>
                        <Thead>
                            <Tr>
                                <Th>First name</Th>
                                <Th>Last name</Th>
                                <Th>User Group</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {users?.map((user: any) => {
                                let defaultUserGroupId = '';
                                const defaultUserGroup = userGroups.find((item: any) => {
                                    return item.users.includes(user._id);
                                });

                                if (defaultUserGroup !== undefined) {
                                    defaultUserGroupId = defaultUserGroup._id;
                                }
                                return (
                                    <Tr key={user.email}>
                                        <Td>{user.firstname}</Td>
                                        <Td>{user.lastname}</Td>
                                        <Td>
                                            <Select
                                                size={'xs'}
                                                // placeholder="No Group"
                                                value={defaultUserGroupId}
                                                onChange={(event: React.ChangeEvent<HTMLSelectElement>) => handleOnChange(event, user)}
                                            >
                                                {userGroups.map((userGroup: any) => {
                                                    return (
                                                        <option key={userGroup.name} value={userGroup._id}>
                                                            {userGroup.name}
                                                        </option>
                                                    );
                                                })}
                                            </Select>
                                        </Td>
                                    </Tr>
                                );
                            })}
                        </Tbody>
                    </Table>
                </TableContainer>
            </PrimaryDrawer>
        </Box>
    );
};

export default UserGroups;
