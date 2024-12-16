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
    Center,
    Container,
    Divider,
    Flex,
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

const View = ({
    dataCollectionView,
    userGroup = { name: '', workspace: '', users: [], permissions: emptyPermissions },
    refetchUserGroup,
}: {
    dataCollectionView: any;
    userGroup: any;
    refetchUserGroup: any;
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
    const [viewPermissions, setViewPermissions] = useState(emptyViewPermissions);

    useEffect(() => {
        refetchRows();
    }, []);

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

    return (
        <Box>
            <Divider />
            <Box pt={'25px'} pb={'4px'} mt={'20px'}>
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

                    {userGroup.permissions.viewActions.update ||
                    userGroup?.permissions.viewActions.delete ||
                    viewPermissions.view.update ||
                    viewPermissions.view.delete ? (
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
                    ) : null}
                </Flex>
            </Box>
            {rows && rows?.length > 0 ? (
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

                                                console.log({ threshold_name });
                                                return (
                                                    <>
                                                        <DeviceCard
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
                                            rowsProp={rows}
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
                                rowsProp={rows}
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
