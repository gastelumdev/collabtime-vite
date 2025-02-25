import DataCollection, { cellBorderColor } from '../dataCollections/DataCollection';
import {
    useDeleteDataCollectionViewMutation,
    useGetDataCollectionsQuery,
    useGetOneWorkspaceQuery,
    useGetRowsQuery,
    useUpdateDataCollectionViewMutation,
    useUpdateDataCollectionViewNoRefetchMutation,
    useUpdateRowMutation,
} from '../../app/services/api';
import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Center,
    Container,
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
import { CloseIcon, Search2Icon } from '@chakra-ui/icons';
import { TRow } from '../../types';
import './view.css';
import { PiTrashSimple } from 'react-icons/pi';
import PointCard from '../dataCollections/apps/controlByWebAppComponents/PointCard';
import { controlByWebSettings } from '../dataCollections/apps/controlByWebAppComponents/controlByWebSettings';

const View = ({
    dataCollectionView,
    rowsProp = null,
    userGroup = { name: '', workspace: '', users: [], permissions: emptyPermissions },
    refetchUserGroup,
    active = true,
    showCreateRowProp = true,
    execute = null,
}: {
    dataCollectionView: any;
    rowsProp?: any;
    userGroup: any;
    refetchUserGroup: any;
    active: boolean;
    showCreateRowProp?: boolean;
    execute?: any;
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
        showCreateRow: showCreateRowProp,
        filters: JSON.stringify(dataCollectionView.filters),
    });
    const [deleteDataCollectionView] = useDeleteDataCollectionViewMutation();
    const [updateDataCollectionView] = useUpdateDataCollectionViewMutation();
    const [updateDataCollectionViewNoRefetch] = useUpdateDataCollectionViewNoRefetchMutation();
    const [updateRow] = useUpdateRowMutation();
    const { data } = useGetDataCollectionsQuery(null);
    const [rowsState, setRowsState] = useState(rows);
    const [dateFilteredRows, setDateFilteredRows] = useState<TRow[]>([]);
    const [viewPermissions, setViewPermissions] = useState(emptyViewPermissions);
    const [showCreateRow, setShowCreateRow] = useState(true);
    const [filterValue, setFilterValue] = useState('');
    const [startDateFilterValue, setStartDateFilterValue] = useState('');
    const [endDateFilterValue, setEndDateFilterValue] = useState('');
    const [showSearch, setShowSearch] = useState(false);

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
                    let refs = [];
                    if (row.refs !== undefined) {
                        refs = row.refs[column.name];
                    }

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

        socket.on(`mqtt/${id}`, () => {
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

    const resetSearch = () => {
        setFilterValue('');
        setStartDateFilterValue('');
        setEndDateFilterValue('');
        setDateFilteredRows([]);
    };

    return (
        <Box mb={'50px'}>
            {workspace?._id === controlByWebSettings.psId && rowsState && rowsState.length < 2 ? null : (
                <Box pt={'25px'} pb={'8px'}>
                    <Flex>
                        <Text fontSize={'20px'} className="dmsans-400">
                            <span style={{ fontSize: '18px' }}>{dataCollectionView.name}</span>
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
                        {!showSearch ? (
                            <Button
                                size={'sm'}
                                variant={'outline'}
                                pl={'20px'}
                                leftIcon={<Search2Icon />}
                                mr={showSearch ? '8px' : '0px'}
                                onClick={() => {
                                    setShowSearch(!showSearch);
                                    resetSearch();
                                }}
                            ></Button>
                        ) : null}
                        <Box className={`search-drawer ${!showSearch ? 'search-drawer__hide' : ''}`}>
                            <Flex>
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
                                <Box mr={'8px'}>
                                    <Button
                                        size={'sm'}
                                        onClick={() => {
                                            resetSearch();
                                        }}
                                    >
                                        Clear
                                    </Button>
                                </Box>
                                {showSearch ? (
                                    <Button
                                        size={'sm'}
                                        variant={'outline'}
                                        pl={'20px'}
                                        color={'gray'}
                                        leftIcon={<CloseIcon />}
                                        // mr={showSearch ? '8px' : '0px'}
                                        onClick={() => {
                                            setShowSearch(!showSearch);
                                        }}
                                    ></Button>
                                ) : null}
                            </Flex>
                        </Box>
                        {userGroup.permissions.viewActions.update ||
                        userGroup?.permissions.viewActions.delete ||
                        viewPermissions.view.update ||
                        viewPermissions.view.delete ? (
                            <Box ml={'8px'}>
                                <Menu>
                                    <MenuButton
                                        p={'3px'}
                                        borderRadius={'4px'}
                                        _hover={{ bgColor: 'gray.100' }}
                                        borderWidth={'1px'}
                                        borderStyle={'solid'}
                                        borderColor={'gay.100'}
                                    >
                                        <Box>
                                            <Text>
                                                <PiDotsThreeVerticalBold size={'20px'} />
                                            </Text>
                                        </Box>
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
                                                icon={<PiTrashSimple />}
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
            )}
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
                                    <Container maxW={{ base: '5xl', sm: 'sm' }} mt={1}>
                                        <Flex flexWrap="wrap" gridGap={6} justify={'start'}>
                                            {rowsState?.map((row: any) => {
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

                                                if (row?.values.type === 'Humidity') {
                                                    value = row?.values.humidity;

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
                                                    value = Math.floor(value) + '%';
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
                                                    <DeviceCard
                                                        key={row?.values.name}
                                                        data={{ name: row?.values.name, type: row?.values.type, value, threshold_name }}
                                                        bgColor={bgColor}
                                                        fontColor={fontColor}
                                                        Icon={icon}
                                                    />
                                                );
                                            })}
                                        </Flex>
                                    </Container>
                                </TabPanel>
                                <TabPanel>
                                    <Box
                                        borderBottom={`1px solid ${cellBorderColor}`}
                                        boxShadow={'base'}
                                        borderLeft={'6px solid rgb(36, 162, 240)'}
                                        borderRadius={'7px'}
                                    >
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
                    ) : workspace?._id == controlByWebSettings.psId && rowsState && rowsState.length > 1 ? (
                        <>
                            <Tabs>
                                <TabList>
                                    <Tab>AO Points</Tab>
                                    <Tab>List</Tab>
                                </TabList>
                                <TabPanels>
                                    <TabPanel px={0}>
                                        <Box>
                                            <Container maxW={'5xl'} mt={1} px={{ sm: 0 }}>
                                                <Box
                                                    bgColor={'rgb(215, 223, 224)'}
                                                    px={'30px'}
                                                    pt={'20px'}
                                                    boxShadow={'inner'}
                                                    border={'1px solid rgb(218, 218, 218)'}
                                                >
                                                    <Box mb={'20px'}>
                                                        <Text fontSize={'20px'} fontWeight={'semibold'} mb={'6px'}>
                                                            Relay Outputs
                                                        </Text>
                                                        <Flex flexWrap="wrap" gridGap={3} justify={'start'}>
                                                            {rowsState?.map((row: TRow) => {
                                                                if (row.isEmpty || row.values.type !== 'Relay Output') return null;

                                                                return <PointCard key={row?._id} row={row} values={row.values} updateRow={updateRow} />;
                                                            })}
                                                        </Flex>
                                                    </Box>
                                                    <Box mb={'20px'}>
                                                        <Text fontSize={'20px'} fontWeight={'semibold'} mb={'6px'}>
                                                            Digital Inputs
                                                        </Text>
                                                        <Flex flexWrap="wrap" gridGap={3} justify={'start'}>
                                                            {rowsState?.map((row: TRow) => {
                                                                if (row.isEmpty || row.values.type !== 'Digital Input') return null;

                                                                return <PointCard key={row?._id} row={row} values={row.values} updateRow={updateRow} />;
                                                            })}
                                                        </Flex>
                                                    </Box>
                                                    <Box mb={'20px'}>
                                                        <Text fontSize={'20px'} fontWeight={'semibold'} mb={'6px'}>
                                                            Registers
                                                        </Text>
                                                        <Flex flexWrap="wrap" gridGap={3} justify={'start'}>
                                                            {rowsState?.map((row: TRow) => {
                                                                if (row.isEmpty || row.values.type !== 'Register') return null;

                                                                return <PointCard key={row?._id} row={row} values={row.values} updateRow={updateRow} />;
                                                            })}
                                                        </Flex>
                                                    </Box>
                                                </Box>
                                            </Container>
                                        </Box>
                                    </TabPanel>
                                    <TabPanel>
                                        <Box
                                            borderBottom={`1px solid ${cellBorderColor}`}
                                            boxShadow={'base'}
                                            borderLeft={'6px solid rgb(36, 162, 240)'}
                                            borderRadius={'7px'}
                                        >
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
                        </>
                    ) : (
                        <>
                            {workspace?._id === controlByWebSettings.psId && rowsState && rowsState.length < 2 ? null : (
                                <Box
                                    borderBottom={`1px solid ${cellBorderColor}`}
                                    boxShadow={'base'}
                                    borderLeft={'6px solid rgb(36, 162, 240)'}
                                    borderRadius={'7px'}
                                >
                                    <DataCollection
                                        showDoneRows={true}
                                        rowsProp={rowsProp || rowsState}
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
                                        execute={execute}
                                        // userGroup={userGroup}
                                    />
                                </Box>
                            )}
                        </>
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
