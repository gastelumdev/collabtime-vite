import DataCollection from '../dataCollections/DataCollection';
import {
    useDeleteDataCollectionViewMutation,
    useGetDataCollectionsQuery,
    useGetOneWorkspaceQuery,
    useGetRowsQuery,
    useUpdateDataCollectionViewMutation,
    useUpdateDataCollectionViewNoRefetchMutation,
} from '../../app/services/api';
import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Center,
    Container,
    Divider,
    Flex,
    Input,
    InputGroup,
    InputLeftAddon,
    InputLeftElement,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Spacer,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
} from '@chakra-ui/react';
import { PiDotsThreeVerticalBold } from 'react-icons/pi';
import Create from './Create';
import { emptyPermissions, emptyViewPermissions } from '../workspaces/UserGroups';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import DeviceCard from '../../components/Cards/DeviceCard';
import { LiaDoorOpenSolid, LiaMicrochipSolid, LiaTemperatureLowSolid } from 'react-icons/lia';
import { RiRemoteControlFill } from 'react-icons/ri';
import { Search2Icon } from '@chakra-ui/icons';
import { TRow } from '../../types';

const View = ({
    dataCollectionView,
    userGroup = { name: '', workspace: '', users: [], permissions: emptyPermissions },
    refetchUserGroup,
    active = true,
}: {
    dataCollectionView: any;
    userGroup: any;
    refetchUserGroup: any;
    active: boolean;
}) => {
    const { id } = useParams();
    const { data: workspace } = useGetOneWorkspaceQuery(id as string);
    const { data: rows, refetch: refetchRows } = useGetRowsQuery({
        dataCollectionId: dataCollectionView.dataCollection || '',
        limit: 0,
        skip: 0,
        sort: 1,
        sortBy: 'createdAt',
        showEmptyRows: false,
        filters: JSON.stringify(dataCollectionView.filters),
    });
    const [deleteDataCollectionView] = useDeleteDataCollectionViewMutation();
    const [updateDataCollectionView] = useUpdateDataCollectionViewMutation();
    const [updateDataCollectionViewNoRefetch] = useUpdateDataCollectionViewNoRefetchMutation();
    const { data } = useGetDataCollectionsQuery(null);
    const [rowsState, setRowsState] = useState(rows);
    const [dateFilteredRows, setDateFilteredRows] = useState<TRow[]>([]);
    const [viewPermissions, setViewPermissions] = useState(emptyViewPermissions);
    const [showCreateRow, setShowCreateRow] = useState(true);
    const [filterValue, setFilterValue] = useState('');
    const [startDateFilterValue, setStartDateFilterValue] = useState('');
    const [endDateFilterValue, setEndDateFilterValue] = useState('');

    useEffect(() => {
        refetchRows();
    }, []);

    useEffect(() => {
        setRowsState(rows);
    }, [rows]);

    useEffect(() => {
        let currentRows = [];
        if (dateFilteredRows.length > 0) {
            currentRows = dateFilteredRows;
        } else {
            if (rows !== undefined) {
                currentRows = rows;
            }
        }

        if (filterValue === '') {
            if (dateFilteredRows.length > 0) {
                setRowsState(dateFilteredRows);
            } else {
                setRowsState(rows);
            }
        } else {
            const columns = dataCollectionView.columns;
            const filteredRows = currentRows?.filter((row) => {
                if (row.isEmpty) return false;
                for (const column of columns) {
                    const value = row.values[column.name];
                    const refs = row.refs[column.name];

                    if (value !== undefined) {
                        if (typeof value === 'string') {
                            const lowerCaseValue = value.toLowerCase();

                            if (filterValue !== '' && lowerCaseValue.startsWith(filterValue.toLowerCase())) {
                                return true;
                            }
                        } else {
                            if (column.type === 'people') {
                                for (const person of value) {
                                    const personObjectKeys = Object.keys(person);
                                    for (const key of personObjectKeys) {
                                        if (filterValue !== '' && person[key as string].toLowerCase().startsWith(filterValue.toLowerCase())) {
                                            return true;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    if (refs !== undefined) {
                        if (column.type === 'reference') {
                            for (const ref of refs) {
                                if (filterValue !== '' && ref.values[column.dataCollectionRefLabel].toLowerCase().startsWith(filterValue.toLowerCase())) {
                                    return true;
                                }
                            }
                        }
                    }
                }
                return false;
            });

            if (filteredRows !== undefined && filteredRows.length > 0) {
                setRowsState(filteredRows);
            } else {
                setRowsState([]);
            }
        }
    }, [rows, filterValue, dateFilteredRows]);

    useEffect(() => {
        const columns = dataCollectionView.columns;
        if (startDateFilterValue !== '' && endDateFilterValue !== '') {
            const filteredRows: TRow[] | undefined = rows?.filter((row) => {
                for (const column of columns) {
                    const value = row.values[column.name];
                    if (column.type === 'date') {
                        const valueDate = new Date(value);
                        const startDate = new Date(startDateFilterValue);
                        const endDate = new Date(endDateFilterValue);

                        if (startDateFilterValue !== '' && endDateFilterValue !== '') {
                            if (valueDate > startDate && valueDate < endDate) {
                                return true;
                            }
                        }
                    }
                }
                return false;
            });

            if (filteredRows !== undefined && filteredRows.length > 0) {
                setDateFilteredRows(filteredRows);
                setRowsState(filteredRows);
            }
        }
    }, [rows, startDateFilterValue, endDateFilterValue]);

    useEffect(() => {
        const socket = io(import.meta.env.VITE_API_URL);
        socket.connect();
        socket.on('update views', () => {
            refetchRows();
        });

        socket.on('update swift sensor data', () => {
            refetchRows();
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        const viewPermissions = userGroup.permissions.views.find((item: any) => {
            return item.view === dataCollectionView._id;
        });

        if (viewPermissions !== undefined) {
            setViewPermissions(viewPermissions.permissions);
        } else {
            refetchUserGroup();
        }
    }, [userGroup, dataCollectionView]);

    useEffect(() => {
        if (rows?.length === 1 && rows[0].isEmpty) {
            setShowCreateRow(viewPermissions.rows.create);
        } else {
            setShowCreateRow(true);
        }
    }, [rows, viewPermissions, dataCollectionView]);

    return (
        <Box>
            <Divider />
            <Box pt={'25px'} pb={'8px'}>
                <Flex>
                    <Text fontSize={'20px'} className="dmsans-400">
                        <span>{dataCollectionView.name}</span>
                        <span style={{ marginLeft: '20px', fontSize: '12px', color: '#2B6CB0', fontWeight: 'bold' }}>
                            {dataCollectionView.public &&
                            (userGroup.permissions.viewActions.update ||
                                userGroup?.permissions.viewActions.delete ||
                                viewPermissions.view.update ||
                                viewPermissions.view.delete)
                                ? 'Public'
                                : ''}
                        </span>
                    </Text>
                    <Spacer />
                    <Box>
                        <Flex>
                            <Box>
                                <Flex>
                                    <InputGroup size={'sm'} mr={'8px'}>
                                        <InputLeftAddon>Start</InputLeftAddon>
                                        <Input
                                            type={'date'}
                                            size={'sm'}
                                            value={startDateFilterValue}
                                            color={startDateFilterValue === '' ? 'gray.300' : 'default'}
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                setStartDateFilterValue(event.target.value);
                                            }}
                                            isDisabled={startDateFilterValue !== '' && endDateFilterValue !== '' && filterValue !== ''}
                                        />
                                    </InputGroup>
                                </Flex>
                            </Box>
                            <Box>
                                <Flex>
                                    <InputGroup size={'sm'}>
                                        <InputLeftAddon>End</InputLeftAddon>
                                        <Input
                                            type={'date'}
                                            size={'sm'}
                                            value={endDateFilterValue}
                                            color={endDateFilterValue === '' ? 'gray.300' : 'default'}
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                setEndDateFilterValue(event.target.value);
                                            }}
                                            isDisabled={startDateFilterValue !== '' && endDateFilterValue !== '' && filterValue !== ''}
                                        />
                                    </InputGroup>
                                </Flex>
                            </Box>
                        </Flex>
                    </Box>
                    <Box mx={'8px'}>
                        <InputGroup>
                            <InputLeftElement pointerEvents="none">
                                <Text>
                                    <Search2Icon color="gray.300" mb={'10px'} fontSize={'14px'} />
                                </Text>
                            </InputLeftElement>
                            <Input
                                value={filterValue}
                                size={'sm'}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    if (startDateFilterValue === '' || endDateFilterValue === '') {
                                        setStartDateFilterValue('');
                                        setEndDateFilterValue('');
                                    }
                                    setFilterValue(event.target.value);
                                }}
                            />
                        </InputGroup>
                    </Box>
                    <Box>
                        <Button
                            size={'sm'}
                            onClick={() => {
                                setFilterValue('');
                                setStartDateFilterValue('');
                                setEndDateFilterValue('');
                                setDateFilteredRows([]);
                            }}
                        >
                            Clear
                        </Button>
                    </Box>
                    {userGroup.permissions.viewActions.update ||
                    userGroup?.permissions.viewActions.delete ||
                    viewPermissions.view.update ||
                    viewPermissions.view.delete ? (
                        <Box ml={'8px'} mt={'5px'}>
                            <Menu>
                                <MenuButton>
                                    <Text fontSize={'24px'}>
                                        <PiDotsThreeVerticalBold />
                                    </Text>
                                </MenuButton>
                                <MenuList fontSize={'14px'}>
                                    {userGroup.permissions.viewActions.update || viewPermissions.view.update ? (
                                        <Create
                                            dataCollections={data!}
                                            view={dataCollectionView}
                                            dataCollection={data?.find((dc) => {
                                                return dc._id == dataCollectionView.dataCollection;
                                            })}
                                        />
                                    ) : null}
                                    {userGroup.permissions.viewActions.delete || viewPermissions.view.delete ? (
                                        <MenuItem
                                            onClick={() => {
                                                deleteDataCollectionView(dataCollectionView._id);
                                            }}
                                        >
                                            <Text>Delete View</Text>
                                        </MenuItem>
                                    ) : null}
                                </MenuList>
                            </Menu>
                        </Box>
                    ) : null}
                </Flex>
            </Box>
            {rows && showCreateRow ? (
                <>
                    {workspace?.type === 'integration' && !['Thresholds'].includes(dataCollectionView.name) ? (
                        <Tabs>
                            <TabList>
                                <Tab>Board</Tab>
                                <Tab>List</Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel>
                                    <Container maxW={'5xl'} mt={1}>
                                        <Flex flexWrap="wrap" gridGap={6} justify={'start'}>
                                            {rows.map((row: any) => {
                                                if (row.isEmpty) return null;
                                                let min_warning = row?.values['min_warning'];
                                                let min_critical = row?.values['min_critical'];
                                                let max_warning = row?.values['max_warning'];
                                                let max_critical = row?.values['max_critical'];

                                                let bgColor = '#3d8d51';
                                                let fontColor = 'white';
                                                let icon = RiRemoteControlFill;
                                                let value = row?.values.value;

                                                let threshold_name = null;

                                                if (row?.values.type === 'Temperature') {
                                                    icon = LiaTemperatureLowSolid;
                                                    value = row?.values.temperature;

                                                    if (value >= max_critical || value <= min_critical) {
                                                        bgColor = 'red';
                                                    }

                                                    if (value >= max_warning && value < max_critical) {
                                                        bgColor = 'orange';
                                                    }

                                                    if (value <= min_warning && value > min_critical) {
                                                        bgColor = 'orange';
                                                    }

                                                    // value = row?.values.temperature.toFixed() + '\u00B0F';
                                                    value = Math.floor(value) + '\u00B0F';
                                                }

                                                if (row?.values.type === 'Door') {
                                                    value = row?.values.status;
                                                    icon = LiaDoorOpenSolid;

                                                    if (value === 'Open') {
                                                        bgColor = 'orange';
                                                    }
                                                }

                                                if (row?.values.type === 'Electric Potential (DC)') {
                                                    icon = LiaMicrochipSolid;
                                                }

                                                if (row?.values.threshold_name !== undefined) {
                                                    threshold_name = row?.values.threshold_name;
                                                }

                                                if (!active) {
                                                    value = '--';
                                                    bgColor = 'gray';
                                                }

                                                return (
                                                    <>
                                                        <DeviceCard
                                                            key={row?.values.name}
                                                            data={{ name: row?.values.name, type: row?.values.type, value, threshold_name }}
                                                            bgColor={bgColor}
                                                            fontColor={fontColor}
                                                            Icon={icon}
                                                        />
                                                    </>
                                                );
                                            })}
                                        </Flex>
                                    </Container>
                                </TabPanel>
                                <TabPanel>
                                    <Box borderBottom={'1px solid #EDF2F7'}>
                                        <DataCollection
                                            showDoneRows={true}
                                            rowsProp={rowsState}
                                            dataCollectionView={dataCollectionView}
                                            rowsAreDraggable={false}
                                            hasCheckboxOptions={false}
                                            hasColumnOptions={false}
                                            columnsAreDraggable={true}
                                            hasCreateColumn={false}
                                            refetchRows={refetchRows}
                                            viewPermissions={viewPermissions}
                                            updateView={updateDataCollectionView}
                                            updateViewNoRefetch={updateDataCollectionViewNoRefetch}
                                            active={active}
                                            // userGroup={userGroup}
                                        />
                                    </Box>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    ) : (
                        <Box borderBottom={'1px solid #EDF2F7'}>
                            <DataCollection
                                showDoneRows={true}
                                rowsProp={rowsState}
                                dataCollectionView={dataCollectionView}
                                rowsAreDraggable={false}
                                hasCheckboxOptions={false}
                                hasColumnOptions={false}
                                columnsAreDraggable={true}
                                hasCreateColumn={false}
                                refetchRows={refetchRows}
                                viewPermissions={viewPermissions}
                                updateView={updateDataCollectionView}
                                updateViewNoRefetch={updateDataCollectionViewNoRefetch}
                                active={active}
                                // userGroup={userGroup}
                            />
                        </Box>
                    )}
                </>
            ) : (
                <Box p={'20px'} bgColor={'#F5FAFF'}>
                    <Center>
                        <Text fontSize={'14px'}>This view is empty.</Text>
                    </Center>
                </Box>
            )}
        </Box>
    );
};

export default View;
